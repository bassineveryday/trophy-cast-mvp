-- Fix the search path security warning for the log_sensitive_import_access function
DROP FUNCTION IF EXISTS public.log_sensitive_import_access(text, text, uuid, uuid);

CREATE OR REPLACE FUNCTION public.log_sensitive_import_access(
  _table_name text,
  _operation text,
  _import_log_id uuid,
  _user_id uuid DEFAULT auth.uid()
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Log the access for security auditing
  INSERT INTO public.role_audit_log (
    user_id,
    target_user_id,
    action,
    role_type,
    club_id,
    reason,
    user_agent,
    ip_address
  )
  SELECT 
    _user_id,
    _user_id,
    _operation || ' on ' || _table_name,
    'data_access',
    mil.club_id,
    'Accessed sensitive member import data for import: ' || _import_log_id::text,
    current_setting('request.headers', true)::json->>'user-agent',
    inet(current_setting('request.headers', true)::json->>'x-forwarded-for')
  FROM public.member_import_logs mil
  WHERE mil.id = _import_log_id;
EXCEPTION 
  WHEN OTHERS THEN
    -- Don't block operations if logging fails
    NULL;
END;
$$;