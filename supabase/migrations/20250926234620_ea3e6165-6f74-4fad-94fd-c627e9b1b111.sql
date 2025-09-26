-- Add demo flag to profiles table
ALTER TABLE public.profiles ADD COLUMN is_demo boolean DEFAULT false;

-- Add indexes for better performance with demo data
CREATE INDEX idx_profiles_is_demo ON public.profiles(is_demo);

-- Create a simple view that can combine real and demo data for leaderboards
CREATE OR REPLACE VIEW public.enhanced_leaderboard AS
SELECT 
  p.user_id,
  p.name,
  p.club,
  p.avatar_url,
  p.home_state,
  p.city,
  p.tournaments_fished,
  p.aoy_titles,
  p.biggest_catch_weight,
  p.biggest_catch_species,
  p.biggest_catch_location,
  p.is_demo,
  COALESCE(recent_catch.total_weight, 0) as recent_total_weight,
  COALESCE(recent_catch.fish_count, 0) as recent_fish_count
FROM public.profiles p
LEFT JOIN (
  SELECT 
    user_id,
    SUM(weight) as total_weight,
    COUNT(*) as fish_count
  FROM public.catches 
  WHERE timestamp >= NOW() - INTERVAL '30 days'
  GROUP BY user_id
) recent_catch ON p.user_id = recent_catch.user_id
WHERE p.name IS NOT NULL
ORDER BY recent_total_weight DESC, p.biggest_catch_weight DESC;