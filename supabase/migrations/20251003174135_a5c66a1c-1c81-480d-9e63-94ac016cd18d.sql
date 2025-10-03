-- Add checked_in columns to tournament_registrations table
ALTER TABLE public.tournament_registrations
ADD COLUMN IF NOT EXISTS checked_in boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS checked_in_at timestamp with time zone;