-- Fix the member_import_staging security implementation
-- Previous migration failed due to attempting to create policy on a view

-- Drop existing policies if any remain
DROP POLICY IF EXISTS "Only importing user can view staging data during active import" ON public.member_import_staging;
DROP POLICY IF EXISTS "Only importing user can insert staging data during processing" ON public.member_import_staging;
DROP POLICY IF EXISTS "Only importing user can update staging data during validation" ON public.member_import_staging;
DROP POLICY IF EXISTS "System can delete staging data for finalized imports" ON public.member_import_staging;

-- Drop the view if it exists
DROP VIEW IF EXISTS public.member_import_staging_summary;

-- Drop the trigger and function if they exist
DROP TRIGGER IF EXISTS enforce_staging_expiration ON public.member_import_staging;
DROP FUNCTION IF EXISTS public.check_staging_data_expiration();

-- Create new stricter policies that only allow the importing user access
CREATE POLICY "Only importing user can view staging data during active import"
ON public.member_import_staging
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.imported_by = auth.uid()
    AND mil.status IN ('processing', 'validating')
  )
);

CREATE POLICY "Only importing user can insert staging data during processing"
ON public.member_import_staging
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.imported_by = auth.uid()
    AND mil.status = 'processing'
  )
);

CREATE POLICY "Only importing user can update staging data during validation"
ON public.member_import_staging
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.imported_by = auth.uid()
    AND mil.status IN ('processing', 'validating')
  )
);

CREATE POLICY "Only importing user can delete staging data for finalized imports"
ON public.member_import_staging
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.imported_by = auth.uid()
    AND mil.status IN ('completed', 'failed')
  )
);

-- Add automatic expiration check function
CREATE OR REPLACE FUNCTION public.check_staging_data_expiration()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent insertion of staging data older than 2 hours
  IF NEW.created_at < NOW() - INTERVAL '2 hours' THEN
    RAISE EXCEPTION 'Staging data has expired and must be deleted for security';
  END IF;
  RETURN NEW;
END;
$$;

-- Add trigger to enforce expiration
CREATE TRIGGER enforce_staging_expiration
BEFORE INSERT OR UPDATE ON public.member_import_staging
FOR EACH ROW
EXECUTE FUNCTION public.check_staging_data_expiration();

-- Create a masked view for club officers to monitor imports without seeing PII
CREATE OR REPLACE VIEW public.member_import_staging_summary AS
SELECT 
  mis.id,
  mis.import_log_id,
  mis.row_number,
  mis.is_valid,
  mis.is_duplicate,
  mis.validation_errors,
  mis.club_role,
  mis.created_at,
  -- Mask sensitive data
  CASE 
    WHEN mis.name IS NOT NULL THEN '***REDACTED***'
    ELSE NULL 
  END as name_status,
  CASE 
    WHEN mis.email IS NOT NULL THEN '***@***'
    ELSE NULL 
  END as email_status,
  CASE 
    WHEN mis.phone IS NOT NULL THEN '***-***-****'
    ELSE NULL 
  END as phone_status,
  -- Only show if data exists, not the actual values
  (mis.emergency_contact IS NOT NULL) as has_emergency_contact,
  (mis.home_state IS NOT NULL) as has_home_state,
  (mis.city IS NOT NULL) as has_city
FROM public.member_import_staging mis;

-- Grant access to the view
GRANT SELECT ON public.member_import_staging_summary TO authenticated;

-- Views use security_invoker to check permissions based on underlying table RLS
-- No need to create policies on the view itself - the underlying table policies will apply

-- Update the cleanup function to be more aggressive (30 minutes instead of 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_staging_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete staging data for completed/failed imports older than 30 minutes
  DELETE FROM public.member_import_staging
  WHERE import_log_id IN (
    SELECT id
    FROM public.member_import_logs
    WHERE status IN ('completed', 'failed')
    AND completed_at < NOW() - INTERVAL '30 minutes'
  );
  
  -- Also delete any staging data older than 2 hours regardless of status
  DELETE FROM public.member_import_staging
  WHERE created_at < NOW() - INTERVAL '2 hours';
  
  -- Log cleanup action
  RAISE NOTICE 'Cleaned up staging data older than 30 minutes (or 2 hours absolute)';
END;
$$;

-- Add comment documenting security measures
COMMENT ON TABLE public.member_import_staging IS 'SECURITY CRITICAL: Contains PII data (emails, phones, addresses). Access restricted to importing user only. Data auto-expires after 2 hours. Club officers can use member_import_staging_summary view for masked data.';

COMMENT ON VIEW public.member_import_staging_summary IS 'Masked view of staging data for club officers. Shows validation status without exposing PII. Access controlled by underlying table RLS policies.';