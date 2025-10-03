-- Create RPC function to check in an angler
CREATE OR REPLACE FUNCTION public.check_in_angler(
  p_tournament_id uuid,
  p_user_id uuid,
  p_is_checked_in boolean
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Update the checked_in status
  UPDATE public.tournament_registrations
  SET 
    checked_in = p_is_checked_in,
    checked_in_at = CASE 
      WHEN p_is_checked_in THEN NOW() 
      ELSE NULL 
    END
  WHERE tournament_id = p_tournament_id 
    AND user_id = p_user_id;
END;
$$;

-- Create RPC function to create event for today
CREATE OR REPLACE FUNCTION public.create_event_for_today(p_tournament_id uuid)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id uuid;
  v_tournament record;
BEGIN
  -- Get tournament details
  SELECT * INTO v_tournament
  FROM public.tournaments
  WHERE id = p_tournament_id;
  
  -- Generate new event_id
  v_event_id := gen_random_uuid();
  
  -- Insert into tournament_events (or create if needed)
  -- Note: This assumes a tournament_events table structure
  -- Adjust based on your actual schema
  INSERT INTO public.tournament_events (
    id,
    tournament_id,
    event_date,
    created_at
  ) VALUES (
    v_event_id,
    p_tournament_id,
    CURRENT_DATE,
    NOW()
  );
  
  RETURN v_event_id;
END;
$$;

-- Create RPC function to seed entries for event
CREATE OR REPLACE FUNCTION public.seed_entries_for_event(p_event_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert tournament entries for all checked-in registrations
  INSERT INTO public.tournament_entries (
    id,
    event_id,
    user_id,
    tournament_id,
    checked_in,
    created_at
  )
  SELECT 
    gen_random_uuid(),
    p_event_id,
    tr.user_id,
    tr.tournament_id,
    tr.checked_in,
    NOW()
  FROM public.tournament_registrations tr
  JOIN public.tournament_events te ON te.id = p_event_id
  WHERE tr.tournament_id = te.tournament_id
    AND tr.checked_in = true;
END;
$$;