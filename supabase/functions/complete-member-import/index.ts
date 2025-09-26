import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { importLogId, clubId } = await req.json();

    if (!importLogId || !clubId) {
      throw new Error('Missing importLogId or clubId');
    }

    console.log(`Completing import for log ID: ${importLogId}, club ID: ${clubId}`);

    // Get valid rows from staging table
    const { data: stagingRows, error: stagingError } = await supabase
      .from('member_import_staging')
      .select('*')
      .eq('import_log_id', importLogId)
      .eq('is_valid', true);

    if (stagingError) {
      console.error('Error fetching staging data:', stagingError);
      throw stagingError;
    }

    if (!stagingRows || stagingRows.length === 0) {
      throw new Error('No valid rows found to import');
    }

    let successCount = 0;
    let failureCount = 0;
    const importErrors = [];

    // Process each valid row
    for (const row of stagingRows) {
      try {
        // Create user account
        const { data: newUser, error: userError } = await supabase.auth.admin.createUser({
          email: row.email,
          password: Math.random().toString(36).slice(-12), // Temporary password
          email_confirm: true,
          user_metadata: {
            name: row.name,
            club: clubId,
            signature_techniques: row.signature_techniques || []
          }
        });

        if (userError) {
          console.error(`Error creating user for ${row.email}:`, userError);
          failureCount++;
          importErrors.push({
            row: row.row_number,
            email: row.email,
            error: userError.message
          });
          continue;
        }

        if (!newUser.user) {
          failureCount++;
          importErrors.push({
            row: row.row_number,
            email: row.email,
            error: 'Failed to create user'
          });
          continue;
        }

        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            user_id: newUser.user.id,
            name: row.name,
            club: clubId,
            city: row.city,
            home_state: row.home_state,
            signature_techniques: row.signature_techniques || []
          });

        if (profileError) {
          console.error(`Error creating profile for ${row.email}:`, profileError);
          // Continue anyway, profile creation failure shouldn't block user creation
        }

        // Assign club role
        const { error: roleError } = await supabase
          .from('user_roles')
          .insert({
            user_id: newUser.user.id,
            club_id: clubId,
            club_role: row.club_role || 'member',
            is_active: true
          });

        if (roleError) {
          console.error(`Error assigning role for ${row.email}:`, roleError);
          // Continue anyway, role assignment failure shouldn't block user creation
        }

        // Send password reset email (acts as welcome email)
        const { error: resetError } = await supabase.auth.admin.generateLink({
          type: 'recovery',
          email: row.email,
          options: {
            redirectTo: `${Deno.env.get('SUPABASE_URL')?.replace('.supabase.co', '')}.vercel.app/auth`
          }
        });

        if (resetError) {
          console.error(`Error sending welcome email to ${row.email}:`, resetError);
          // Don't fail the import for email issues
        }

        successCount++;
        console.log(`Successfully imported user: ${row.email}`);

      } catch (error: any) {
        console.error(`Error processing row ${row.row_number}:`, error);
        failureCount++;
        importErrors.push({
          row: row.row_number,
          email: row.email,
          error: error.message
        });
      }
    }

    // Update import log with final results
    const { error: updateError } = await supabase
      .from('member_import_logs')
      .update({
        successful_imports: successCount,
        failed_imports: failureCount,
        status: 'completed',
        completed_at: new Date().toISOString(),
        errors: importErrors.length > 0 ? importErrors : null
      })
      .eq('id', importLogId);

    if (updateError) {
      console.error('Error updating import log:', updateError);
    }

    // Clean up staging data
    const { error: cleanupError } = await supabase
      .from('member_import_staging')
      .delete()
      .eq('import_log_id', importLogId);

    if (cleanupError) {
      console.error('Error cleaning up staging data:', cleanupError);
    }

    console.log(`Import completed: ${successCount} successful, ${failureCount} failed`);

    return new Response(
      JSON.stringify({
        success: true,
        successCount,
        failureCount,
        errors: importErrors
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in complete-member-import:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
};

serve(handler);