-- Add signature techniques fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS signature_techniques text[] DEFAULT '{}';

-- Add a comment to explain the format
COMMENT ON COLUMN public.profiles.signature_techniques IS 'Array of technique names ordered by preference (max 3)';