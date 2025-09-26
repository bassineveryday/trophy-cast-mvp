-- Create user roles system
CREATE TYPE public.app_role AS ENUM ('admin', 'club_officer', 'member');

CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'member',
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE (user_id, club_id) -- One role per user per club
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role, _club_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
      AND (_club_id IS NULL OR club_id = _club_id)
  )
$$;

-- Create function to check if user is club officer or admin
CREATE OR REPLACE FUNCTION public.is_club_officer(_user_id uuid, _club_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role IN ('admin', 'club_officer')
      AND (_club_id IS NULL OR club_id = _club_id)
  )
$$;

-- RLS policies for user_roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins and officers can view club roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  public.is_club_officer(auth.uid(), club_id) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Update tournaments policies to allow officers to create/manage tournaments
DROP POLICY IF EXISTS "Authenticated users can create tournaments" ON public.tournaments;
DROP POLICY IF EXISTS "Authenticated users can update tournaments" ON public.tournaments;

-- Only club officers and admins can create tournaments
CREATE POLICY "Club officers can create tournaments"
ON public.tournaments
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_club_officer(auth.uid(), club_id) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Only club officers and admins can update tournaments
CREATE POLICY "Club officers can update tournaments"
ON public.tournaments
FOR UPDATE
TO authenticated
USING (
  public.is_club_officer(auth.uid(), club_id) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Only club officers and admins can delete tournaments
CREATE POLICY "Club officers can delete tournaments"
ON public.tournaments
FOR DELETE
TO authenticated
USING (
  public.is_club_officer(auth.uid(), club_id) OR
  public.has_role(auth.uid(), 'admin'::app_role)
);

-- Add created_by field to tournaments to track who created them
ALTER TABLE public.tournaments ADD COLUMN created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX idx_user_roles_club_id ON public.user_roles(club_id);
CREATE INDEX idx_tournaments_created_by ON public.tournaments(created_by);
CREATE INDEX idx_tournaments_status ON public.tournaments(status);