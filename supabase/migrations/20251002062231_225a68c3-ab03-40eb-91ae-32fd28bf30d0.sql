-- Fix security issue: Default profiles to PRIVATE, require opt-in for public visibility

-- Drop the policy that defaults to public
DROP POLICY IF EXISTS "Authenticated users can view public profiles" ON public.profiles;

-- Create secure policy: Only show profiles that explicitly opted-in to public visibility
CREATE POLICY "Authenticated users can view public profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Only allow if user explicitly set public_profile = true
  EXISTS (
    SELECT 1 FROM public.user_preferences
    WHERE user_preferences.user_id = profiles.user_id
    AND user_preferences.public_profile = true
  )
);

-- Add helpful comment
COMMENT ON POLICY "Authenticated users can view public profiles" ON public.profiles IS 
'Profiles are private by default. Users must explicitly set public_profile=true in user_preferences to be visible to others.';