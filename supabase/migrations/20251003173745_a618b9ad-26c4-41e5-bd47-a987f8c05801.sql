-- Create RPC function to register user for tournament
CREATE OR REPLACE FUNCTION public.register_for_tournament(p_tournament_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert registration record
  INSERT INTO public.tournament_registrations (tournament_id, user_id, status)
  VALUES (p_tournament_id, auth.uid(), 'registered')
  ON CONFLICT (tournament_id, user_id) DO NOTHING;
END;
$$;