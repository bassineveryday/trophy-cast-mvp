-- Fix security issue: Restrict profile visibility to authenticated users only
-- and respect user privacy preferences

-- Drop the insecure "Public profiles viewable" policy that allows unauthenticated access
DROP POLICY IF EXISTS "Public profiles viewable" ON public.profiles;

-- Create new secure policy: Allow users to view their own profile
CREATE POLICY "Users can view their own profile secure"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Create new secure policy: Allow authenticated users to view public profiles
-- Respects user_preferences.public_profile setting (defaults to true if not set)
CREATE POLICY "Authenticated users can view public profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (
  -- Allow if the profile is marked as public in user_preferences
  -- or if no preference is set (default to public for backward compatibility)
  EXISTS (
    SELECT 1 FROM public.user_preferences
    WHERE user_preferences.user_id = profiles.user_id
    AND user_preferences.public_profile = true
  )
  OR NOT EXISTS (
    SELECT 1 FROM public.user_preferences
    WHERE user_preferences.user_id = profiles.user_id
  )
);

-- Note: Existing INSERT and UPDATE policies remain unchanged and secure:
-- - Users can only insert/update their own profile (checked via auth.uid())
-- - No changes needed to those policies