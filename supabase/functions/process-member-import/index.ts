import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ImportRow {
  row_number: number;
  name: string;
  email: string;
  phone?: string;
  home_state?: string;
  city?: string;
  club_role?: string;
  signature_techniques?: string;
  emergency_contact?: string;
  boat_registration?: string;
}

interface ValidationError {
  field: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { importLogId, data } = await req.json();

    if (!importLogId || !data || !Array.isArray(data)) {
      throw new Error('Invalid request data');
    }

    console.log(`Processing import with ${data.length} rows for log ID: ${importLogId}`);

    // Validate and process each row
    const processedRows = [];
    for (let i = 0; i < data.length; i++) {
      const row = data[i] as ImportRow;
      const validationErrors: ValidationError[] = [];
      let isValid = true;

      // Validate required fields
      if (!row.name || row.name.trim() === '') {
        validationErrors.push({ field: 'name', message: 'Name is required' });
        isValid = false;
      }

      if (!row.email || row.email.trim() === '') {
        validationErrors.push({ field: 'email', message: 'Email is required' });
        isValid = false;
      } else {
        // Validate email format
        const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
        if (!emailRegex.test(row.email)) {
          validationErrors.push({ field: 'email', message: 'Invalid email format' });
          isValid = false;
        }
      }

      // Validate club role
      const validRoles = ['member', 'president', 'vice_president', 'secretary', 'treasurer', 'tournament_director', 'conservation_director'];
      if (row.club_role && !validRoles.includes(row.club_role.toLowerCase().replace(' ', '_'))) {
        validationErrors.push({ field: 'club_role', message: 'Invalid club role' });
        isValid = false;
      }

      // Validate phone format (basic validation)
      if (row.phone && row.phone.trim() !== '') {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = row.phone.replace(/[\s\-\(\)]/g, '');
        if (!phoneRegex.test(cleanPhone)) {
          validationErrors.push({ field: 'phone', message: 'Invalid phone format' });
          isValid = false;
        }
      }

      // Check for duplicate email
      let isDuplicate = false;
      if (row.email && isValid) {
        const { data: existingUser } = await supabase.auth.admin.listUsers();
        isDuplicate = existingUser?.users?.some(user => user.email === row.email) || false;
      }

      // Parse signature techniques
      let signatureTechniques: string[] = [];
      if (row.signature_techniques && row.signature_techniques.trim() !== '') {
        signatureTechniques = row.signature_techniques
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0);
      }

      processedRows.push({
        import_log_id: importLogId,
        row_number: i + 1,
        name: row.name?.trim() || '',
        email: row.email?.trim().toLowerCase() || '',
        phone: row.phone?.trim() || null,
        home_state: row.home_state?.trim() || null,
        city: row.city?.trim() || null,
        club_role: row.club_role?.toLowerCase().replace(' ', '_') || 'member',
        signature_techniques: signatureTechniques,
        emergency_contact: row.emergency_contact?.trim() || null,
        boat_registration: row.boat_registration?.trim() || null,
        validation_errors: validationErrors.length > 0 ? validationErrors : null,
        is_valid: isValid && !isDuplicate,
        is_duplicate: isDuplicate
      });
    }

    // Insert processed rows into staging table
    const { error: stagingError } = await supabase
      .from('member_import_staging')
      .insert(processedRows);

    if (stagingError) {
      console.error('Error inserting staging data:', stagingError);
      throw stagingError;
    }

    // Update import log with processing results
    const validRows = processedRows.filter(row => row.is_valid).length;
    const invalidRows = processedRows.length - validRows;

    const { error: updateError } = await supabase
      .from('member_import_logs')
      .update({
        total_rows: processedRows.length,
        successful_imports: 0, // Will be updated during actual import
        failed_imports: 0,
        status: 'validated',
        errors: processedRows
          .filter(row => !row.is_valid)
          .map(row => ({
            row: row.row_number,
            errors: row.validation_errors,
            is_duplicate: row.is_duplicate
          }))
      })
      .eq('id', importLogId);

    if (updateError) {
      console.error('Error updating import log:', updateError);
      throw updateError;
    }

    console.log(`Validation complete: ${validRows} valid, ${invalidRows} invalid rows`);

    return new Response(
      JSON.stringify({
        success: true,
        totalRows: processedRows.length,
        validRows,
        invalidRows,
        importLogId
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error: any) {
    console.error('Error in process-member-import:', error);
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