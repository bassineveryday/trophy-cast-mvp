-- Explicitly set views to SECURITY INVOKER to prevent security definer warnings
-- This makes views use the querying user's permissions, not the view creator's

-- Drop and recreate with explicit SECURITY INVOKER clause
DROP VIEW IF EXISTS public.v_aoy_standings CASCADE;
CREATE VIEW public.v_aoy_standings 
WITH (security_invoker = true) AS
SELECT 
  member_id,
  member_name,
  season_year,
  total_aoy_points,
  aoy_rank,
  boater_status
FROM public.aoy_standings
ORDER BY season_year DESC, aoy_rank ASC;

DROP VIEW IF EXISTS public.v_aoy_best4 CASCADE;
CREATE VIEW public.v_aoy_best4 
WITH (security_invoker = true) AS
SELECT 
  tr.member_id,
  tr.member_name,
  tr.season,
  SUM(tr.aoy_points) as total_points
FROM (
  SELECT 
    member_id,
    member_name,
    season,
    aoy_points,
    ROW_NUMBER() OVER (PARTITION BY member_id, season ORDER BY aoy_points DESC) as rn
  FROM public.tournament_results
  WHERE aoy_points IS NOT NULL
) tr
WHERE tr.rn <= 4
GROUP BY tr.member_id, tr.member_name, tr.season
ORDER BY tr.season DESC, total_points DESC;

DROP VIEW IF EXISTS public.v_event_points CASCADE;
CREATE VIEW public.v_event_points 
WITH (security_invoker = true) AS
SELECT 
  event_id,
  member_id,
  member_name,
  aoy_points,
  place,
  season
FROM public.tournament_results
WHERE aoy_points IS NOT NULL
ORDER BY season DESC, event_id, aoy_points DESC;

DROP VIEW IF EXISTS public.v_event_rank CASCADE;
CREATE VIEW public.v_event_rank 
WITH (security_invoker = true) AS
SELECT 
  event_id,
  member_id,
  member_name,
  place,
  total_weight,
  big_bass_lbs,
  season
FROM public.tournament_results
WHERE place IS NOT NULL
ORDER BY season DESC, event_id, place;

DROP VIEW IF EXISTS public.v_rookie_of_year CASCADE;
CREATE VIEW public.v_rookie_of_year 
WITH (security_invoker = true) AS
SELECT 
  tm.member_id,
  tm.member_name,
  COALESCE(SUM(tr.aoy_points), 0) as total_points,
  COUNT(DISTINCT tr.event_id) as events_fished,
  tr.season
FROM public.tournament_members tm
LEFT JOIN public.tournament_results tr ON tm.member_id = tr.member_id
WHERE tm.is_rookie = true
GROUP BY tm.member_id, tm.member_name, tr.season
ORDER BY tr.season DESC, total_points DESC;

-- Grant permissions
GRANT SELECT ON public.v_aoy_standings TO authenticated, anon;
GRANT SELECT ON public.v_aoy_best4 TO authenticated, anon;
GRANT SELECT ON public.v_event_points TO authenticated, anon;
GRANT SELECT ON public.v_event_rank TO authenticated, anon;
GRANT SELECT ON public.v_rookie_of_year TO authenticated, anon;

COMMENT ON VIEW public.v_aoy_standings IS 'SECURITY INVOKER: Public tournament standings. Uses querying user permissions.';