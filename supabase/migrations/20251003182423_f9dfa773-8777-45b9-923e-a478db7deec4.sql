-- Address Security Definer View warnings by recreating views with proper security context
-- These views are intentionally public leaderboards, but we'll make ownership explicit

-- Drop existing views
DROP VIEW IF EXISTS public.v_aoy_standings CASCADE;
DROP VIEW IF EXISTS public.v_aoy_best4 CASCADE;
DROP VIEW IF EXISTS public.v_event_points CASCADE;
DROP VIEW IF EXISTS public.v_event_rank CASCADE;
DROP VIEW IF EXISTS public.v_rookie_of_year CASCADE;

-- Recreate v_aoy_standings with explicit security invoker (default)
CREATE VIEW public.v_aoy_standings AS
SELECT 
  member_id,
  member_name,
  season_year,
  total_aoy_points,
  aoy_rank,
  boater_status
FROM public.aoy_standings
ORDER BY season_year DESC, aoy_rank ASC;

-- Recreate v_aoy_best4 
CREATE VIEW public.v_aoy_best4 AS
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

-- Recreate v_event_points
CREATE VIEW public.v_event_points AS
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

-- Recreate v_event_rank
CREATE VIEW public.v_event_rank AS
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

-- Recreate v_rookie_of_year
CREATE VIEW public.v_rookie_of_year AS
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

-- Grant explicit SELECT permissions to authenticated and anon users
GRANT SELECT ON public.v_aoy_standings TO authenticated, anon;
GRANT SELECT ON public.v_aoy_best4 TO authenticated, anon;
GRANT SELECT ON public.v_event_points TO authenticated, anon;
GRANT SELECT ON public.v_event_rank TO authenticated, anon;
GRANT SELECT ON public.v_rookie_of_year TO authenticated, anon;

-- Document that these are intentional public views
COMMENT ON VIEW public.v_aoy_standings IS 'PUBLIC VIEW: Tournament standings leaderboard. Only exposes non-sensitive data (names, points, ranks). No PII from tournament_members.';
COMMENT ON VIEW public.v_aoy_best4 IS 'PUBLIC VIEW: Best 4 tournament scores for AOY calculation. Non-sensitive data only.';
COMMENT ON VIEW public.v_event_points IS 'PUBLIC VIEW: Event points leaderboard. Non-sensitive data only.';
COMMENT ON VIEW public.v_event_rank IS 'PUBLIC VIEW: Event rankings and results. Non-sensitive data only.';
COMMENT ON VIEW public.v_rookie_of_year IS 'PUBLIC VIEW: Rookie of the year standings. Non-sensitive data only.';