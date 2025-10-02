-- Fix role_audit_log RLS policies to use security definer functions
-- and restrict all write operations

-- Drop existing policies
DROP POLICY IF EXISTS "Club officers can view club audit logs" ON public.role_audit_log;
DROP POLICY IF EXISTS "Platform admins can view audit logs" ON public.role_audit_log;

-- Create improved SELECT policies using security definer functions
CREATE POLICY "Club officers can view their club audit logs"
ON public.role_audit_log
FOR SELECT
TO authenticated
USING (
  -- Platform admins can see everything
  public.is_platform_admin(auth.uid())
  OR
  -- Club officers can only see logs for their clubs
  (club_id IS NOT NULL AND public.is_club_officer(auth.uid(), club_id))
);

-- Audit logs should be append-only from application logic
-- No direct INSERT/UPDATE/DELETE by users
-- Only system/edge functions with service role can write

CREATE POLICY "Only service role can insert audit logs"
ON public.role_audit_log
FOR INSERT
TO authenticated
WITH CHECK (false);  -- Deny all user inserts

CREATE POLICY "Audit logs cannot be updated"
ON public.role_audit_log
FOR UPDATE
TO authenticated
USING (false);  -- Deny all updates

CREATE POLICY "Audit logs cannot be deleted"
ON public.role_audit_log
FOR DELETE
TO authenticated
USING (false);  -- Deny all deletes