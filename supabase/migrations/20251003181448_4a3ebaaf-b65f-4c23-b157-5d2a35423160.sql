-- Grant explicit SELECT permissions on views to authenticated users
-- This documents that these views are intentionally public leaderboards

GRANT SELECT ON public.v_aoy_standings TO authenticated;
GRANT SELECT ON public.v_aoy_best4 TO authenticated;
GRANT SELECT ON public.v_event_points TO authenticated;
GRANT SELECT ON public.v_event_rank TO authenticated;
GRANT SELECT ON public.v_rookie_of_year TO authenticated;

-- Also grant to anon for public leaderboard access if needed
GRANT SELECT ON public.v_aoy_standings TO anon;
GRANT SELECT ON public.v_rookie_of_year TO anon;

-- Add helpful comment documenting this is intentional
COMMENT ON VIEW public.v_aoy_standings IS 'Public view: Tournament standings are intentionally accessible. Only exposes non-sensitive data (names, points, ranks). Does not expose PII from tournament_members table.';
COMMENT ON VIEW public.v_rookie_of_year IS 'Public view: Rookie tournament standings are intentionally accessible. Only exposes non-sensitive data.';

-- Document that tournament_members access is protected
COMMENT ON TABLE public.tournament_members IS 'SENSITIVE: Contains PII (emails, phones, addresses). Access controlled via RLS policies. Views that reference this table only expose non-sensitive fields (member_id, member_name).';