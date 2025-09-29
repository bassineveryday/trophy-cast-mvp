-- Fix member_import_staging RLS policies to prevent data exposure
-- The current policies have potential recursive issues with user_roles table

-- First, create a security definer function for club officer checks
CREATE OR REPLACE FUNCTION public.is_authorized_for_member_import(_user_id uuid, _import_log_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = _import_log_id
    AND (
      -- User who initiated the import
      mil.imported_by = _user_id
      OR
      -- Club officers who can access this club's imports
      EXISTS (
        SELECT 1 
        FROM user_roles ur
        WHERE ur.user_id = _user_id
        AND ur.club_id = mil.club_id
        AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary')
        AND ur.is_active = true
      )
    )
  )
$$;

-- Drop existing policies
DROP POLICY IF EXISTS "Authorized users can view staging data during active import" ON public.member_import_staging;
DROP POLICY IF EXISTS "Authorized users can update staging data during processing" ON public.member_import_staging;
DROP POLICY IF EXISTS "System can insert staging data" ON public.member_import_staging;
DROP POLICY IF EXISTS "Authorized cleanup of staging data" ON public.member_import_staging;

-- Create new, more secure policies using the security definer function

-- SELECT: Only during active processing or very limited time after completion
CREATE POLICY "Authorized users can view staging data during active processing" 
ON public.member_import_staging
FOR SELECT
USING (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND EXISTS (
    SELECT 1 
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND (
      mil.status IN ('processing', 'validating')
      OR 
      (mil.status = 'completed' AND mil.completed_at > (now() - interval '10 minutes'))
    )
  )
);

-- INSERT: Only during active processing by authorized users
CREATE POLICY "Authorized users can insert staging data"
ON public.member_import_staging
FOR INSERT
WITH CHECK (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status IN ('processing', 'validating')
    AND mil.imported_by = auth.uid()
  )
);

-- UPDATE: Only during active processing by authorized users
CREATE POLICY "Authorized users can update staging data during processing"
ON public.member_import_staging
FOR UPDATE
USING (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status IN ('processing', 'validating')
  )
);

-- DELETE: Only completed imports by authorized users (for cleanup)
CREATE POLICY "Authorized cleanup of completed staging data"
ON public.member_import_staging
FOR DELETE
USING (
  public.is_authorized_for_member_import(auth.uid(), import_log_id)
  AND EXISTS (
    SELECT 1
    FROM member_import_logs mil
    WHERE mil.id = member_import_staging.import_log_id
    AND mil.status = 'completed'
  )
);