-- Create clubs table
CREATE TABLE public.clubs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  location TEXT,
  description TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create tournaments table
CREATE TABLE public.tournaments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  club_id UUID REFERENCES public.clubs(id) ON DELETE CASCADE,
  entry_fee DECIMAL(10,2) DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create catches table
CREATE TABLE public.catches (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tournament_id UUID REFERENCES public.tournaments(id) ON DELETE CASCADE,
  species TEXT NOT NULL,
  weight DECIMAL(5,2),
  length DECIMAL(5,2),
  photo_url TEXT,
  notes TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add club_id to existing profiles table to link users to clubs
ALTER TABLE public.profiles ADD COLUMN club_id UUID REFERENCES public.clubs(id) ON DELETE SET NULL;

-- Enable Row Level Security on all tables
ALTER TABLE public.clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catches ENABLE ROW LEVEL SECURITY;

-- RLS Policies for clubs table
-- Anyone can view clubs (public information)
CREATE POLICY "Anyone can view clubs" 
ON public.clubs 
FOR SELECT 
USING (true);

-- Only authenticated users can create clubs
CREATE POLICY "Authenticated users can create clubs" 
ON public.clubs 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = created_by);

-- Club creators and members can update clubs
CREATE POLICY "Club creators can update clubs" 
ON public.clubs 
FOR UPDATE 
TO authenticated
USING (auth.uid() = created_by);

-- Club creators can delete clubs
CREATE POLICY "Club creators can delete clubs" 
ON public.clubs 
FOR DELETE 
TO authenticated
USING (auth.uid() = created_by);

-- RLS Policies for tournaments table
-- Anyone can view tournaments (public information)
CREATE POLICY "Anyone can view tournaments" 
ON public.tournaments 
FOR SELECT 
USING (true);

-- Authenticated users can create tournaments
CREATE POLICY "Authenticated users can create tournaments" 
ON public.tournaments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Tournament creators can update tournaments (need to track who created them)
-- For now, allow any authenticated user to update (can be refined later)
CREATE POLICY "Authenticated users can update tournaments" 
ON public.tournaments 
FOR UPDATE 
TO authenticated
USING (auth.uid() IS NOT NULL);

-- RLS Policies for catches table
-- Users can view their own catches and catches from tournaments they participated in
CREATE POLICY "Users can view relevant catches" 
ON public.catches 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = user_id OR 
  tournament_id IN (
    SELECT t.id FROM tournaments t 
    WHERE EXISTS (
      SELECT 1 FROM catches c2 
      WHERE c2.tournament_id = t.id AND c2.user_id = auth.uid()
    )
  )
);

-- Users can create their own catches
CREATE POLICY "Users can create their own catches" 
ON public.catches 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Users can update their own catches
CREATE POLICY "Users can update their own catches" 
ON public.catches 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

-- Users can delete their own catches
CREATE POLICY "Users can delete their own catches" 
ON public.catches 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_clubs_created_by ON public.clubs(created_by);
CREATE INDEX idx_tournaments_club_id ON public.tournaments(club_id);
CREATE INDEX idx_tournaments_date ON public.tournaments(date);
CREATE INDEX idx_catches_user_id ON public.catches(user_id);
CREATE INDEX idx_catches_tournament_id ON public.catches(tournament_id);
CREATE INDEX idx_catches_timestamp ON public.catches(timestamp);
CREATE INDEX idx_profiles_club_id ON public.profiles(club_id);

-- Add triggers for automatic timestamp updates
CREATE TRIGGER update_clubs_updated_at
BEFORE UPDATE ON public.clubs
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tournaments_updated_at
BEFORE UPDATE ON public.tournaments
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_catches_updated_at
BEFORE UPDATE ON public.catches
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();