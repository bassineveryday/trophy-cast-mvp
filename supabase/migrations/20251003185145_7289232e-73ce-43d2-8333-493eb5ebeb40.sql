-- Ensure profile exists for bassin@bassineveryday.com
-- Insert profile if it doesn't exist
INSERT INTO public.profiles (
  user_id,
  name,
  club,
  avatar_url,
  signature_techniques,
  created_at,
  updated_at
)
VALUES (
  'cb52d69a-cd9b-4575-8138-2929a2af14e4',
  'Bassin Everyday',
  NULL,
  NULL,
  '{}',
  now(),
  now()
)
ON CONFLICT (user_id) DO UPDATE
SET
  updated_at = now();

-- Verify linked_member_id is nullable (it already is, but this is for documentation)
-- No action needed as column is already nullable