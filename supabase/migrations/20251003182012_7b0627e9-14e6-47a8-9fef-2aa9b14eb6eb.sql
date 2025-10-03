-- Fix infinite recursion in user_platform_roles RLS policy
-- Create security definer function to check super admin status

CREATE OR REPLACE FUNCTION public.is_super_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_platform_roles
    WHERE user_id = _user_id
      AND platform_role = 'super_admin'
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- Drop existing RLS policies that may cause recursion
DROP POLICY IF EXISTS "Platform admins can manage platform roles" ON public.user_platform_roles;
DROP POLICY IF EXISTS "Users can view their own platform roles" ON public.user_platform_roles;

-- Create new non-recursive policy using the security definer function
CREATE POLICY "Super admins can manage platform roles"
ON public.user_platform_roles
FOR ALL
TO authenticated
USING (public.is_super_admin(auth.uid()))
WITH CHECK (public.is_super_admin(auth.uid()));

-- Allow users to view their own platform roles
CREATE POLICY "Users can view their own platform roles"
ON public.user_platform_roles
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

COMMENT ON FUNCTION public.is_super_admin IS 'Security definer function to check if user is super admin. Prevents infinite recursion in RLS policies.';