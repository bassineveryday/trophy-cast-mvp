-- Add club_id to v_aoy_standings_demo view
-- Drop and recreate with club_id included

DROP VIEW IF EXISTS public.v_aoy_standings_demo CASCADE;

CREATE VIEW public.v_aoy_standings_demo
WITH (security_invoker = true) AS
SELECT DISTINCT
  a.member_id,
  a.member_name,
  a.season_year,
  a.total_aoy_points,
  a.aoy_rank,
  a.boater_status,
  tm.club_id
FROM public.aoy_standings a
LEFT JOIN (
  -- Get club_id from tournament_results via tournament_members
  SELECT DISTINCT 
    tr.member_id,
    tr.season,
    COALESCE(t.club_id, p.club_id) as club_id
  FROM public.tournament_results tr
  LEFT JOIN public.tournaments t ON tr.event_id = t.event_id
  LEFT JOIN public.profiles p ON tr.member_id = p.linked_member_id
  WHERE tr.is_demo = get_user_is_demo()
) tm ON a.member_id = tm.member_id AND a.season_year = tm.season
WHERE EXISTS (
  SELECT 1 
  FROM public.tournament_results tr
  WHERE tr.member_id = a.member_id
    AND tr.season = a.season_year
    AND tr.is_demo = get_user_is_demo()
)
ORDER BY a.season_year DESC, a.aoy_rank ASC;