-- Add missing profile fields for extended angler profile
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS city text,
ADD COLUMN IF NOT EXISTS tournaments_fished integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS aoy_titles integer DEFAULT 0,
ADD COLUMN IF NOT EXISTS biggest_catch_weight numeric,
ADD COLUMN IF NOT EXISTS biggest_catch_species text,
ADD COLUMN IF NOT EXISTS biggest_catch_location text,
ADD COLUMN IF NOT EXISTS favorite_water text,
ADD COLUMN IF NOT EXISTS home_state text;

-- Create storage bucket for profile avatars
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);