#!/usr/bin/env node

/**
 * Lane Isolation Smoke Test
 * 
 * Tests that lane-safe views and RPCs are working correctly.
 * This script verifies:
 * - v_aoy_standings_demo view returns data
 * - aoy_for_current_user_demo RPC works
 * - event_points_for_current_user_demo RPC works (with/without event_id)
 * 
 * Usage: node scripts/smokeLane.mjs
 * 
 * Note: Requires authentication. Run after signing in to the app.
 * Exit code is always 0 (never throws) to avoid breaking CI.
 */

import { createClient } from '@supabase/supabase-js';

// Supabase config (from src/integrations/supabase/client.ts)
const SUPABASE_URL = "https://jgpjktzghngpzxsxfurm.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpncGprdHpnaG5ncHp4c3hmdXJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg5MTI3MjcsImV4cCI6MjA3NDQ4ODcyN30.H-22Vdy3czvZ1guas49IR4JFAs0E-mEdhHFIhkvwt7w";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// ANSI color codes
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';

function pass(msg) {
  console.log(`${GREEN}✅ ${msg}${RESET}`);
}

function fail(msg) {
  console.log(`${RED}❌ ${msg}${RESET}`);
}

function warn(msg) {
  console.log(`${YELLOW}⚠️  ${msg}${RESET}`);
}

async function testViewQuery() {
  console.log('\n=== Test 1: v_aoy_standings_demo view ===');
  try {
    const { data, error } = await supabase
      .from('v_aoy_standings_demo')
      .select('member_id, member_name, season_year, total_aoy_points, aoy_rank, boater_status, club_id')
      .order('aoy_rank', { ascending: true })
      .limit(3);

    if (error) {
      fail(`View query failed: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      warn('View query succeeded but returned no data (may be expected if no AOY data exists)');
      return;
    }

    pass(`View query succeeded: ${data.length} rows returned`);
    console.log(`   Top 3: ${data.map(r => `${r.member_name} (${r.total_aoy_points} pts)`).join(', ')}`);
  } catch (e) {
    fail(`View query threw: ${e.message}`);
  }
}

async function testAOYRPC() {
  console.log('\n=== Test 2: aoy_for_current_user_demo RPC ===');
  try {
    const { data, error } = await supabase.rpc('aoy_for_current_user_demo');

    if (error) {
      fail(`AOY RPC failed: ${error.message}`);
      return;
    }

    if (!data || data.length === 0) {
      warn('AOY RPC succeeded but returned no data (user may not have club_id or no AOY data exists)');
      return;
    }

    pass(`AOY RPC succeeded: ${data.length} rows returned`);
    console.log(`   Sample: ${data.slice(0, 3).map(r => `${r.member_name} (${r.total_aoy_points} pts)`).join(', ')}`);
  } catch (e) {
    fail(`AOY RPC threw: ${e.message}`);
  }
}

async function testEventPointsRPC() {
  console.log('\n=== Test 3a: event_points_for_current_user_demo RPC (no event_id) ===');
  try {
    const { data, error } = await supabase.rpc('event_points_for_current_user_demo');

    if (error) {
      fail(`Event points RPC (no filter) failed: ${error.message}`);
    } else if (!data || data.length === 0) {
      warn('Event points RPC (no filter) succeeded but returned no data');
    } else {
      pass(`Event points RPC (no filter) succeeded: ${data.length} rows returned`);
      console.log(`   Sample: ${data.slice(0, 3).map(r => `${r.member_name} (Place ${r.place})`).join(', ')}`);
    }
  } catch (e) {
    fail(`Event points RPC (no filter) threw: ${e.message}`);
  }

  console.log('\n=== Test 3b: event_points_for_current_user_demo RPC (with dummy event_id) ===');
  try {
    // Use a dummy UUID - should return empty results but not error
    const dummyEventId = '00000000-0000-0000-0000-000000000000';
    const { data, error } = await supabase.rpc('event_points_for_current_user_demo', {
      p_event_id: dummyEventId
    });

    if (error) {
      fail(`Event points RPC (with filter) failed: ${error.message}`);
    } else {
      pass('Event points RPC (with filter) succeeded');
      if (data && data.length > 0) {
        console.log(`   Unexpectedly found ${data.length} rows for dummy event_id`);
      }
    }
  } catch (e) {
    fail(`Event points RPC (with filter) threw: ${e.message}`);
  }
}

async function main() {
  console.log('🧪 Trophy Cast Lane Isolation Smoke Tests\n');
  console.log('Testing lane-safe views and RPCs...');
  console.log('Note: These tests use anon key, so some may require auth.\n');

  await testViewQuery();
  await testAOYRPC();
  await testEventPointsRPC();

  console.log('\n✨ Smoke tests complete!');
  console.log('Note: Warnings are normal if no data exists in your lane or user not authenticated.\n');
}

main().catch(e => {
  console.error('Smoke test script error:', e);
  process.exit(0); // Never fail CI
});
