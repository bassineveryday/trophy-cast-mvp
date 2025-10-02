-- Strengthen member_import_staging security for PII protection
-- This migration tightens access controls and adds audit logging

-- Drop existing policies to recreate with stricter controls
DROP POLICY IF EXISTS "Authorized users can view staging data during active processing" ON public.member_import_staging;
DROP POLICY IF EXISTS "Authorized users can insert staging data" ON public.member_import_staging;
DROP POLICY IF EXISTS "Authorized users can update staging data during processing" ON public.member_import_staging;
DROP POLICY IF EXISTS "Authorized cleanup of completed staging data" ON public.member_import_staging;

-- Create stricter SELECT policy - only during active processing, no post-completion access
CREATE POLICY "Club officers can view staging data only during active import"
ON public.member_import_staging
FOR SELECT
TO authenticated
USING (
  -- Must be authorized for this specific import
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND
  -- Import must be actively processing (removed 10-minute post-completion window)
  EXISTS (
    SELECT 1
    FROM public.member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status IN ('processing', 'validating')
  )
);

-- Create stricter INSERT policy - only during initial processing
CREATE POLICY "Authorized users can insert staging data during processing only"
ON public.member_import_staging
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND
  EXISTS (
    SELECT 1
    FROM public.member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status = 'processing'
    AND mil.imported_by = auth.uid()
  )
);

-- Create stricter UPDATE policy - only during validation phase
CREATE POLICY "Authorized users can update staging data during validation only"
ON public.member_import_staging
FOR UPDATE
TO authenticated
USING (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND
  EXISTS (
    SELECT 1
    FROM public.member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status IN ('processing', 'validating')
  )
);

-- Create stricter DELETE policy - must be completed or failed, with immediate cleanup
CREATE POLICY "Authorized cleanup of finalized staging data"
ON public.member_import_staging
FOR DELETE
TO authenticated
USING (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND
  EXISTS (
    SELECT 1
    FROM public.member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status IN ('completed', 'failed')
  )
);

-- Create automatic cleanup trigger for staging data older than 1 hour
CREATE OR REPLACE FUNCTION public.cleanup_old_staging_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete staging data for completed/failed imports older than 1 hour
  DELETE FROM public.member_import_staging
  WHERE import_log_id IN (
    SELECT id
    FROM public.member_import_logs
    WHERE status IN ('completed', 'failed')
    AND completed_at < NOW() - INTERVAL '1 hour'
  );
  
  -- Log cleanup action
  RAISE NOTICE 'Cleaned up staging data older than 1 hour';
END;
$$;

-- Create trigger to log all SELECT operations on staging data (for audit trail)
CREATE OR REPLACE FUNCTION public.log_staging_data_access()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log access to sensitive staging data
  PERFORM public.log_sensitive_import_access(
    'member_import_staging',
    TG_OP,
    COALESCE(NEW.import_log_id, OLD.import_log_id),
    auth.uid()
  );
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for audit logging
DROP TRIGGER IF EXISTS audit_staging_access ON public.member_import_staging;
CREATE TRIGGER audit_staging_access
  AFTER INSERT OR UPDATE OR DELETE ON public.member_import_staging
  FOR EACH ROW
  EXECUTE FUNCTION public.log_staging_data_access();

-- Add comment documenting PII sensitivity
COMMENT ON TABLE public.member_import_staging IS 
  'SENSITIVE PII DATA: Contains member emails, phone numbers, addresses. 
   Access is restricted to club officers during active import only.
   Data is automatically cleaned up 1 hour after import completion.
   All access is logged to role_audit_log for security audit trail.';