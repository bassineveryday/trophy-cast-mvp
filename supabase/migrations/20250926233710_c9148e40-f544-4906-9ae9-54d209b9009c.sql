-- Create tables for fishing gear and boat tracking

-- Serial number lookup tables for automatic specification detection
CREATE TABLE public.rod_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  length_feet numeric NOT NULL,
  length_inches numeric DEFAULT 0,
  power text NOT NULL, -- Ultra Light, Light, Medium Light, Medium, Medium Heavy, Heavy, Extra Heavy
  action text NOT NULL, -- Extra Fast, Fast, Moderate Fast, Moderate, Slow
  rod_type text NOT NULL, -- Spinning, Casting, Fly, Ice
  msrp numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(serial_number)
);

CREATE TABLE public.reel_specifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  serial_number text NOT NULL,
  brand text NOT NULL,
  model text NOT NULL,
  reel_type text NOT NULL, -- Spinning, Baitcasting, Fly, Spincast
  gear_ratio text NOT NULL, -- 6.2:1, 7.3:1, etc.
  line_capacity text, -- "12/145, 14/125, 17/100" format
  max_drag numeric, -- in pounds
  weight_oz numeric,
  bearings integer,
  msrp numeric,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(serial_number)
);

-- User's personal rods
CREATE TABLE public.user_rods (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nickname text, -- "Big Bass Slayer", "Finesse King"
  serial_number text,
  -- Auto-populated from serial lookup or manual entry
  brand text NOT NULL,
  model text NOT NULL,
  length_feet numeric NOT NULL,
  length_inches numeric DEFAULT 0,
  power text NOT NULL,
  action text NOT NULL,
  rod_type text NOT NULL,
  -- Personal associations
  primary_technique text, -- Linked to signature techniques
  notes text,
  purchase_date date,
  is_private boolean DEFAULT true, -- Private by default for AI coaching
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- User's personal reels  
CREATE TABLE public.user_reels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nickname text, -- "Lightning", "Old Reliable"  
  serial_number text,
  -- Auto-populated from serial lookup or manual entry
  brand text NOT NULL,
  model text NOT NULL,
  reel_type text NOT NULL,
  gear_ratio text NOT NULL,
  line_capacity text,
  max_drag numeric,
  weight_oz numeric,
  bearings integer,
  notes text,
  purchase_date date,
  is_private boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Line setups attached to reels
CREATE TABLE public.reel_line_setups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reel_id uuid NOT NULL REFERENCES public.user_reels(id) ON DELETE CASCADE,
  line_brand text NOT NULL,
  line_type text NOT NULL, -- Monofilament, Fluorocarbon, Braided
  line_weight text NOT NULL, -- 6lb, 8lb, 10lb, etc.
  leader_type text, -- Fluorocarbon, Wire, etc.
  leader_weight text, -- 12lb, 15lb, etc.
  leader_length_feet numeric,
  spool_date date, -- When line was changed
  notes text,
  is_current boolean DEFAULT true, -- Only one current setup per reel
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Rod/Reel combinations
CREATE TABLE public.user_combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nickname text NOT NULL, -- "Tournament Rig", "Deep Water Setup"
  rod_id uuid NOT NULL REFERENCES public.user_rods(id) ON DELETE CASCADE,
  reel_id uuid NOT NULL REFERENCES public.user_reels(id) ON DELETE CASCADE,
  primary_techniques text[], -- Array of techniques this combo excels at
  notes text,
  is_private boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(rod_id, reel_id) -- Prevent duplicate pairings
);

-- User's boat profile
CREATE TABLE public.user_boats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  nickname text, -- "Bass Hunter", "The Office"
  photo_url text,
  brand text NOT NULL,
  model text NOT NULL,
  year integer,
  length_feet numeric,
  beam_feet numeric,
  -- Motor information
  motor_brand text,
  motor_horsepower numeric,
  motor_type text, -- Outboard, Inboard, etc.
  -- Electronics
  fish_finder text,
  gps_unit text,
  trolling_motor text,
  -- Features
  livewell_count integer DEFAULT 0,
  rod_storage_capacity integer,
  special_features text[], -- Array of special features
  -- Tournament stats from this boat
  tournament_wins integer DEFAULT 0,
  tournament_top3 integer DEFAULT 0,
  tournament_top10 integer DEFAULT 0,
  -- Privacy (public by default for profile showcase)
  is_private boolean DEFAULT false,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Catch logging with gear tracking
CREATE TABLE public.catch_gear_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  catch_id uuid NOT NULL REFERENCES public.catches(id) ON DELETE CASCADE,
  combo_id uuid REFERENCES public.user_combos(id),
  rod_id uuid REFERENCES public.user_rods(id),
  reel_id uuid REFERENCES public.user_reels(id),
  lure_brand text,
  lure_model text,
  lure_color text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.rod_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_rods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reel_line_setups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_combos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_boats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catch_gear_usage ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Specification tables are publicly readable (for serial lookups)
CREATE POLICY "Anyone can view rod specifications" ON public.rod_specifications
FOR SELECT USING (true);

CREATE POLICY "Anyone can view reel specifications" ON public.reel_specifications  
FOR SELECT USING (true);

-- User gear tables - users manage their own gear
CREATE POLICY "Users can manage their own rods" ON public.user_rods
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public rods" ON public.user_rods
FOR SELECT USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own reels" ON public.user_reels
FOR ALL USING (auth.uid() = user_id)  
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public reels" ON public.user_reels
FOR SELECT USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can manage line setups for their reels" ON public.reel_line_setups
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.user_reels ur 
  WHERE ur.id = reel_line_setups.reel_id AND ur.user_id = auth.uid()
));

CREATE POLICY "Users can manage their own combos" ON public.user_combos
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public combos" ON public.user_combos  
FOR SELECT USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can manage their own boats" ON public.user_boats
FOR ALL USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view public boats" ON public.user_boats
FOR SELECT USING (NOT is_private OR auth.uid() = user_id);

CREATE POLICY "Users can manage gear usage for their catches" ON public.catch_gear_usage
FOR ALL USING (EXISTS (
  SELECT 1 FROM public.catches c 
  WHERE c.id = catch_gear_usage.catch_id AND c.user_id = auth.uid()
));

-- Indexes for performance
CREATE INDEX idx_user_rods_user_id ON public.user_rods(user_id);
CREATE INDEX idx_user_reels_user_id ON public.user_reels(user_id);
CREATE INDEX idx_user_combos_user_id ON public.user_combos(user_id);
CREATE INDEX idx_user_boats_user_id ON public.user_boats(user_id);
CREATE INDEX idx_rod_specs_serial ON public.rod_specifications(serial_number);
CREATE INDEX idx_reel_specs_serial ON public.reel_specifications(serial_number);

-- Triggers for updated_at
CREATE TRIGGER update_user_rods_updated_at
BEFORE UPDATE ON public.user_rods
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_reels_updated_at  
BEFORE UPDATE ON public.user_reels
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_boats_updated_at
BEFORE UPDATE ON public.user_boats  
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_rod_specifications_updated_at
BEFORE UPDATE ON public.rod_specifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_reel_specifications_updated_at
BEFORE UPDATE ON public.reel_specifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample rod/reel specifications for demonstration
INSERT INTO public.rod_specifications (serial_number, brand, model, length_feet, length_inches, power, action, rod_type) VALUES
('SC-LGS70MHF', 'St. Croix', 'Legend Glass', 7, 0, 'Medium Heavy', 'Fast', 'Casting'),
('SC-LTS70MF', 'St. Croix', 'Legend Tournament', 7, 0, 'Medium', 'Fast', 'Spinning'),
('SH-CRX70MH', 'Shimano', 'Curado X', 7, 0, 'Medium Heavy', 'Fast', 'Casting'),
('DAI-TDX701MHF', 'Daiwa', 'Tatula XT', 7, 1, 'Medium Heavy', 'Fast', 'Casting');

INSERT INTO public.reel_specifications (serial_number, brand, model, reel_type, gear_ratio, line_capacity, max_drag, weight_oz, bearings) VALUES  
('SH-CU200K', 'Shimano', 'Curado K', 'Baitcasting', '6.2:1', '12/145, 14/125, 17/100', 11, 7.6, 8),
('SH-SLX150', 'Shimano', 'SLX', 'Baitcasting', '6.3:1', '12/165, 14/135, 16/120', 11, 7.2, 4),
('DAI-TT100HS', 'Daiwa', 'Tatula 100', 'Baitcasting', '7.3:1', '14/110, 16/90, 20/65', 13.2, 7.9, 7),
('LEW-BB1SHL', 'Lews', 'BB1 Speed Spool', 'Baitcasting', '6.4:1', '12/145, 14/125, 17/100', 10, 6.8, 9);