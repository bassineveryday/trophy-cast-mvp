-- Update RLS policies to allow users to join clubs as members
CREATE POLICY "Users can join clubs as members"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (
  auth.uid() = user_id AND 
  role = 'member' AND
  club_id IS NOT NULL
);

-- Allow users to leave clubs (delete their membership)
CREATE POLICY "Users can leave clubs"
ON public.user_roles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id AND role = 'member');

-- Allow users to view club memberships for clubs they belong to
CREATE POLICY "Users can view club memberships"
ON public.user_roles
FOR SELECT
TO authenticated
USING (
  club_id IN (
    SELECT ur.club_id 
    FROM user_roles ur 
    WHERE ur.user_id = auth.uid()
  )
);

-- Enable realtime for clubs and user_roles tables
ALTER TABLE public.clubs REPLICA IDENTITY FULL;
ALTER TABLE public.user_roles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.clubs;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_roles;

-- Create function to get club member count
CREATE OR REPLACE FUNCTION public.get_club_member_count(club_uuid uuid)
RETURNS bigint
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COUNT(*)
  FROM public.user_roles
  WHERE club_id = club_uuid
$$;

-- Create function to check if user is member of club
CREATE OR REPLACE FUNCTION public.is_club_member(user_uuid uuid, club_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = user_uuid AND club_id = club_uuid
  )
$$;