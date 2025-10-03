import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch AOY standings for a specific club using the lane-isolated view
 * Only returns data for the current user's lane (production or demo)
 */
export async function fetchAOYStandingsByClub(clubId: string) {
  const { data, error } = await supabase
    .from("v_aoy_standings_demo")
    .select("member_id, member_name, season_year, total_aoy_points, aoy_rank, boater_status, club_id")
    .eq("club_id", clubId)
    .order("aoy_rank", { ascending: true });

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch all AOY standings using the lane-isolated view
 * Automatically filtered by user's lane (production or demo)
 */
export async function fetchAOYStandings(seasonYear?: number) {
  let query = supabase
    .from("v_aoy_standings_demo")
    .select("member_id, member_name, season_year, total_aoy_points, aoy_rank, boater_status, club_id")
    .order("aoy_rank", { ascending: true });

  if (seasonYear) {
    query = query.eq("season_year", seasonYear);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch AOY standings for current user's club using RPC (lane-safe)
 * No parameters needed - automatically filtered by user's lane and club
 * TODO: Add to Supabase types when regenerating
 */
export async function fetchAOYForMyClub() {
  const { data, error } = await (supabase.rpc as any)('aoy_for_current_user_demo');
  
  if (error) throw error;
  return data ?? [];
}

/**
 * Fetch event points for current user's club using RPC (lane-safe)
 * Optionally filter by specific event ID
 * TODO: Add to Supabase types when regenerating
 */
export async function fetchEventPointsForMyClub(eventId?: string) {
  const { data, error } = await (supabase.rpc as any)(
    'event_points_for_current_user_demo',
    eventId ? { p_event_id: eventId } : {}
  );
  
  if (error) throw error;
  return data ?? [];
}
