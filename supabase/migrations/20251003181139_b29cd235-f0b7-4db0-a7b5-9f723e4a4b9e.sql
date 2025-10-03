-- Enable RLS on tables that don't have it
ALTER TABLE public.tournament_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournament_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aoy_standings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- tournament_members: CRITICAL - Contains sensitive PII
-- =====================================================

-- Users can view their own member data if linked via profiles.linked_member_id
CREATE POLICY "Users can view their own member data"
ON public.tournament_members
FOR SELECT
TO authenticated
USING (
  member_id IN (
    SELECT linked_member_id 
    FROM public.profiles 
    WHERE user_id = auth.uid() 
    AND linked_member_id IS NOT NULL
  )
);

-- Club officers can view members in their club
CREATE POLICY "Club officers can view club members"
ON public.tournament_members
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.user_roles ur
    WHERE ur.user_id = auth.uid()
    AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary', 'tournament_director')
    AND ur.is_active = true
  )
);

-- Platform admins can view all member data
CREATE POLICY "Platform admins can view all member data"
ON public.tournament_members
FOR SELECT
TO authenticated
USING (is_platform_admin(auth.uid()));

-- =====================================================
-- tournament_entries: Participant data
-- =====================================================

-- Users can view their own tournament entries
CREATE POLICY "Users can view their own entries"
ON public.tournament_entries
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can view entries for tournaments they're registered for
CREATE POLICY "Users can view entries for registered tournaments"
ON public.tournament_entries
FOR SELECT
TO authenticated
USING (
  tournament_id IN (
    SELECT tournament_id
    FROM public.tournament_registrations
    WHERE user_id = auth.uid()
  )
);

-- Club officers can view entries for their club's tournaments
CREATE POLICY "Club officers can view club tournament entries"
ON public.tournament_entries
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tournaments t
    JOIN public.user_roles ur ON ur.club_id = t.club_id
    WHERE t.id = tournament_entries.tournament_id
    AND ur.user_id = auth.uid()
    AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary', 'tournament_director')
    AND ur.is_active = true
  )
);

-- Club officers can manage entries for their club's tournaments
CREATE POLICY "Club officers can manage club tournament entries"
ON public.tournament_entries
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tournaments t
    JOIN public.user_roles ur ON ur.club_id = t.club_id
    WHERE t.id = tournament_entries.tournament_id
    AND ur.user_id = auth.uid()
    AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary', 'tournament_director')
    AND ur.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tournaments t
    JOIN public.user_roles ur ON ur.club_id = t.club_id
    WHERE t.id = tournament_entries.tournament_id
    AND ur.user_id = auth.uid()
    AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary', 'tournament_director')
    AND ur.is_active = true
  )
);

-- =====================================================
-- tournament_events: Event schedule data
-- =====================================================

-- All authenticated users can view tournament events
CREATE POLICY "Authenticated users can view tournament events"
ON public.tournament_events
FOR SELECT
TO authenticated
USING (true);

-- Club officers can manage events for their club's tournaments
CREATE POLICY "Club officers can manage club tournament events"
ON public.tournament_events
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.tournaments t
    JOIN public.user_roles ur ON ur.club_id = t.club_id
    WHERE t.id = tournament_events.tournament_id
    AND ur.user_id = auth.uid()
    AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary', 'tournament_director')
    AND ur.is_active = true
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.tournaments t
    JOIN public.user_roles ur ON ur.club_id = t.club_id
    WHERE t.id = tournament_events.tournament_id
    AND ur.user_id = auth.uid()
    AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary', 'tournament_director')
    AND ur.is_active = true
  )
);

-- =====================================================
-- aoy_standings: Public tournament standings
-- =====================================================

-- All authenticated users can view AOY standings (public data)
CREATE POLICY "Anyone can view AOY standings"
ON public.aoy_standings
FOR SELECT
TO authenticated
USING (true);

-- =====================================================
-- settings_audit: User settings audit log
-- =====================================================

-- Users can view their own audit logs
CREATE POLICY "Users can view their own audit logs"
ON public.settings_audit
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Platform admins can view all audit logs
CREATE POLICY "Platform admins can view all audit logs"
ON public.settings_audit
FOR SELECT
TO authenticated
USING (is_platform_admin(auth.uid()));

-- Audit logs should not be modifiable
CREATE POLICY "Audit logs cannot be modified"
ON public.settings_audit
FOR UPDATE
TO authenticated
USING (false);

CREATE POLICY "Audit logs cannot be deleted"
ON public.settings_audit
FOR DELETE
TO authenticated
USING (false);