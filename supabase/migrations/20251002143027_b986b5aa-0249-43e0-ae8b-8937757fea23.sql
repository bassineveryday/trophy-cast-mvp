-- Drop the member_import_staging_summary view as it's not needed
-- The underlying member_import_staging table already has proper RLS policies
-- that restrict access to authorized club officers and the importing user only
DROP VIEW IF EXISTS member_import_staging_summary CASCADE;

-- Add a comment to the member_import_staging table documenting the security measures
COMMENT ON TABLE member_import_staging IS 'HIGHLY SENSITIVE: Contains PII during member import process. Access restricted to:
1. Only the user who initiated the import during processing/validating status
2. Only club officers authorized for the specific club during processing/validating status
3. Automatically deleted 30 minutes after import completion/failure
4. Hard limit: All data older than 2 hours is automatically deleted
5. All access is logged to role_audit_log for security auditing';