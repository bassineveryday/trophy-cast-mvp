-- Create lane-isolated views that filter by is_demo using get_user_is_demo()
-- These views ensure AOY data respects the user's demo lane

-- v_aoy_standings_demo: Lane-isolated AOY standings
-- Note: aoy_standings table doesn't have is_demo, so we join to tournament_results to filter
CREATE VIEW public.v_aoy_standings_demo
WITH (security_invoker = true) AS
SELECT DISTINCT
  a.member_id,
  a.member_name,
  a.season_year,
  a.total_aoy_points,
  a.aoy_rank,
  a.boater_status
FROM public.aoy_standings a
WHERE EXISTS (
  SELECT 1 
  FROM public.tournament_results tr
  WHERE tr.member_id = a.member_id
    AND tr.season = a.season_year
    AND tr.is_demo = get_user_is_demo()
)
ORDER BY a.season_year DESC, a.aoy_rank ASC;

-- v_event_points_demo: Lane-isolated event points
CREATE VIEW public.v_event_points_demo
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
  AND is_demo = get_user_is_demo()
ORDER BY season DESC, event_id, aoy_points DESC;