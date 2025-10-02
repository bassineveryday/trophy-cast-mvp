-- Enable pg_cron extension for automatic cleanup scheduling
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Update the cleanup function to be more aggressive (reduce from 30 to 10 minutes)
CREATE OR REPLACE FUNCTION public.cleanup_old_staging_data()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete staging data for completed/failed imports older than 10 minutes (reduced from 30)
  DELETE FROM public.member_import_staging
  WHERE import_log_id IN (
    SELECT id
    FROM public.member_import_logs
    WHERE status IN ('completed', 'failed')
    AND completed_at < NOW() - INTERVAL '10 minutes'
  );
  
  -- Also delete any staging data older than 2 hours regardless of status (hard limit)
  DELETE FROM public.member_import_staging
  WHERE created_at < NOW() - INTERVAL '2 hours';
  
  -- Log cleanup action with details
  RAISE NOTICE 'Cleaned up staging data: completed/failed imports older than 10 minutes, and all data older than 2 hours';
END;
$$;

-- Schedule automatic cleanup every 10 minutes
SELECT cron.schedule(
  'cleanup-member-import-staging-data',
  '*/10 * * * *', -- Every 10 minutes
  $$
  SELECT public.cleanup_old_staging_data();
  $$
);

-- Add additional security comment to the table
COMMENT ON TABLE member_import_staging IS 'HIGHLY SENSITIVE PII DATA - CRITICAL SECURITY MEASURES:
⚠️  Contains: emails, phone numbers, emergency contacts, addresses
🔒 Access: ONLY importing user during active import (processing/validating status)
⏱️  Retention: Auto-deleted 10 minutes after completion/failure
🛡️  Hard Limit: All data >2 hours is forcibly deleted
📋 Audit: All access logged to role_audit_log
🤖 Cleanup: Automated via pg_cron every 10 minutes
⚠️  NEVER backup or replicate this table to non-production environments
⚠️  Data is NOT encrypted at rest - minimize storage time';

-- Add security audit logging for write operations (INSERT/UPDATE/DELETE)
CREATE OR REPLACE FUNCTION public.audit_staging_write_operations()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  import_status text;
BEGIN
  -- Get the import status
  SELECT mil.status INTO import_status
  FROM member_import_logs mil
  WHERE mil.id = COALESCE(NEW.import_log_id, OLD.import_log_id);
  
  -- Log all write operations for security auditing
  PERFORM public.log_sensitive_import_access(
    'member_import_staging',
    TG_OP,
    COALESCE(NEW.import_log_id, OLD.import_log_id),
    auth.uid()
  );
  
  -- Warn if operation is outside normal processing window
  IF import_status NOT IN ('processing', 'validating') OR import_status IS NULL THEN
    RAISE WARNING 'Staging data modified with status: % by user: % operation: %', 
      COALESCE(import_status, 'NULL'), 
      COALESCE(auth.uid()::text, 'UNKNOWN'),
      TG_OP;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$;

-- Create trigger for audit logging of write operations
DROP TRIGGER IF EXISTS audit_staging_write_ops ON member_import_staging;
CREATE TRIGGER audit_staging_write_ops
  AFTER INSERT OR UPDATE OR DELETE ON member_import_staging
  FOR EACH ROW
  EXECUTE FUNCTION public.audit_staging_write_operations();