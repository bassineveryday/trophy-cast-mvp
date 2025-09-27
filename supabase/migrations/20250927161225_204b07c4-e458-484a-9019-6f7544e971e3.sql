-- Fix infinite recursion in user_roles RLS policies by recreating them properly
-- First drop ALL existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view club roles where they are members" ON public.user_roles; 
DROP POLICY IF EXISTS "Admins and officers can view club roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can join clubs as members" ON public.user_roles;
DROP POLICY IF EXISTS "Users can leave clubs" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view club memberships" ON public.user_roles;
DROP POLICY IF EXISTS "Platform admins can manage all user roles" ON public.user_roles;
DROP POLICY IF EXISTS "Club officers can manage club roles" ON public.user_roles;

-- Create safe, non-recursive policies
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
USING (auth.uid() = user_id);

-- Use direct subquery instead of EXISTS to avoid recursion
CREATE POLICY "Users can view roles in their clubs"
ON public.user_roles 
FOR SELECT 
USING (
  club_id IN (
    SELECT DISTINCT club_id 
    FROM public.user_roles base_roles
    WHERE base_roles.user_id = auth.uid()
  )
);

-- Create platform admin function without recursion
CREATE OR REPLACE FUNCTION public.is_platform_admin(_user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_platform_roles
    WHERE user_id = _user_id
      AND platform_role IN ('super_admin', 'platform_admin')
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > NOW())
  )
$$;

-- Admin policies using the safe function
CREATE POLICY "Platform admins can manage all roles" 
ON public.user_roles 
FOR ALL
USING (public.is_platform_admin(auth.uid()))
WITH CHECK (public.is_platform_admin(auth.uid()));

-- Club officer policies using existing safe function
CREATE POLICY "Club officers can manage their club roles"
ON public.user_roles
FOR ALL
USING (public.is_club_officer(auth.uid(), club_id))
WITH CHECK (public.is_club_officer(auth.uid(), club_id));

-- User self-management policies
CREATE POLICY "Users can join clubs as members" 
ON public.user_roles 
FOR INSERT 
WITH CHECK (
  auth.uid() = user_id 
  AND role = 'member'::app_role 
  AND club_id IS NOT NULL
);

CREATE POLICY "Users can leave clubs as members" 
ON public.user_roles 
FOR DELETE 
USING (
  auth.uid() = user_id 
  AND role = 'member'::app_role
);