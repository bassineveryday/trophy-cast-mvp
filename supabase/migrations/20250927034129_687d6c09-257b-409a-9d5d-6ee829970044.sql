-- Fix security issue: Implement stricter RLS policies for member_import_staging table
-- This addresses the "Customer Personal Data Could Be Stolen During Import Process" finding

-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Club officers can manage staging data" ON public.member_import_staging;

-- Create more restrictive policies with better security controls

-- 1. Only allow SELECT for authorized club officers and import initiator during active import
CREATE POLICY "Authorized users can view staging data during active import" 
ON public.member_import_staging 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 
    FROM member_import_logs mil
    JOIN user_roles ur ON ur.club_id = mil.club_id
    WHERE mil.id = member_import_staging.import_log_id
    AND (
      -- Import initiator can always view their import
      (mil.imported_by = auth.uid()) 
      OR 
      -- Club officers can view during processing or recent completion (within 1 hour)
      (
        ur.user_id = auth.uid() 
        AND ur.club_role = ANY (ARRAY['club_admin'::club_role, 'president'::club_role, 'vice_president'::club_role, 'secretary'::club_role])
        AND ur.is_active = true
        AND (
          mil.status IN ('processing', 'validating') 
          OR (mil.status = 'completed' AND mil.completed_at > NOW() - INTERVAL '1 hour')
        )
      )
    )
  )
);

-- 2. Only allow INSERT for the import processing system (service role or import initiator)
CREATE POLICY "System can insert staging data"
ON public.member_import_staging 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.imported_by = auth.uid()
    AND mil.status IN ('processing', 'validating')
  )
);

-- 3. Only allow UPDATE for validation corrections by authorized users
CREATE POLICY "Authorized users can update staging data during processing"
ON public.member_import_staging 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 
    FROM member_import_logs mil
    JOIN user_roles ur ON ur.club_id = mil.club_id
    WHERE mil.id = member_import_staging.import_log_id
    AND (mil.imported_by = auth.uid() OR (
      ur.user_id = auth.uid() 
      AND ur.club_role = ANY (ARRAY['club_admin'::club_role, 'president'::club_role, 'vice_president'::club_role, 'secretary'::club_role])
      AND ur.is_active = true
    ))
    AND mil.status IN ('processing', 'validating')
  )
);

-- 4. Only allow DELETE for cleanup after successful import or by authorized officers
CREATE POLICY "Authorized cleanup of staging data"
ON public.member_import_staging 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 
    FROM member_import_logs mil
    JOIN user_roles ur ON ur.club_id = mil.club_id
    WHERE mil.id = member_import_staging.import_log_id
    AND (
      -- Import initiator can delete after completion
      (mil.imported_by = auth.uid() AND mil.status = 'completed') 
      OR 
      -- Club admins can delete for cleanup
      (
        ur.user_id = auth.uid() 
        AND ur.club_role = ANY (ARRAY['club_admin'::club_role, 'president'::club_role])
        AND ur.is_active = true
      )
    )
  )
);

-- 5. Add a security definer function to log access to sensitive import data for audit purposes
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
  INSERT INTO role_audit_log (
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
  FROM member_import_logs mil
  WHERE mil.id = _import_log_id;
EXCEPTION 
  WHEN OTHERS THEN
    -- Don't block operations if logging fails
    NULL;
END;
$$;