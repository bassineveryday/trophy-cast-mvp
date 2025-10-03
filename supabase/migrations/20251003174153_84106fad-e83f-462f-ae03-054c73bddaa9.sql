-- Update tournament_events structure to support new functionality
ALTER TABLE public.tournament_events
ADD COLUMN IF NOT EXISTS id uuid DEFAULT gen_random_uuid(),
ADD COLUMN IF NOT EXISTS tournament_id uuid,
ADD COLUMN IF NOT EXISTS created_at timestamp with time zone DEFAULT now();

-- Update tournament_entries structure to support new functionality
ALTER TABLE public.tournament_entries
ADD COLUMN IF NOT EXISTS tournament_id uuid,
ADD COLUMN IF NOT EXISTS user_id uuid;