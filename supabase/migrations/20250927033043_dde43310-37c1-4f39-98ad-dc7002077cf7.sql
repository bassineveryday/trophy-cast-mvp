-- Environmental Intelligence Tables for TrophyCast

-- Water bodies/locations table for environmental tracking
CREATE TABLE public.water_bodies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  water_type TEXT DEFAULT 'lake', -- lake, river, reservoir, etc.
  average_depth DECIMAL(5, 2),
  max_depth DECIMAL(5, 2),
  surface_area DECIMAL(10, 2), -- in acres
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Environmental conditions table
CREATE TABLE public.environmental_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  water_body_id UUID REFERENCES public.water_bodies(id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- Weather data
  air_temperature DECIMAL(5, 2), -- Fahrenheit
  water_temperature DECIMAL(5, 2), -- Fahrenheit
  barometric_pressure DECIMAL(6, 2), -- inHg
  humidity INTEGER, -- percentage
  wind_speed DECIMAL(5, 2), -- mph
  wind_direction INTEGER, -- degrees
  cloud_cover INTEGER, -- percentage
  precipitation DECIMAL(5, 2), -- inches
  weather_condition TEXT, -- clear, cloudy, rainy, etc.
  
  -- Moon/sun data for solunar
  moon_phase DECIMAL(3, 2), -- 0-1 (0 = new moon, 0.5 = full moon)
  moon_overhead_time TIMESTAMPTZ,
  moon_underfoot_time TIMESTAMPTZ,
  sunrise_time TIMESTAMPTZ,
  sunset_time TIMESTAMPTZ,
  solunar_rating INTEGER, -- 1-5 scale
  
  -- Water conditions
  water_clarity TEXT, -- clear, stained, muddy
  water_level TEXT, -- low, normal, high, flood
  current_flow TEXT, -- still, slow, moderate, fast
  surface_temperature_source TEXT DEFAULT 'estimated', -- estimated, measured, reported
  
  -- Data source tracking
  data_source TEXT DEFAULT 'api', -- api, user_report, sensor
  user_id UUID, -- if user reported
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- User environmental reports table (crowd-sourced data)
CREATE TABLE public.user_environmental_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  water_body_id UUID REFERENCES public.water_bodies(id) ON DELETE CASCADE,
  reported_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  
  -- User observations
  water_temperature DECIMAL(5, 2),
  water_clarity TEXT,
  water_level TEXT,
  current_flow TEXT,
  weather_notes TEXT,
  fishing_conditions TEXT, -- excellent, good, fair, poor
  
  -- Verification
  verified BOOLEAN DEFAULT false,
  verified_by UUID,
  verified_at TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Environmental factor correlations with catches
CREATE TABLE public.catch_environmental_correlation (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  catch_id UUID REFERENCES public.catches(id) ON DELETE CASCADE,
  environmental_condition_id UUID REFERENCES public.environmental_conditions(id) ON DELETE CASCADE,
  
  -- Calculated correlation scores (updated by analytics)
  temperature_score DECIMAL(3, 2), -- how optimal was temperature
  pressure_score DECIMAL(3, 2), -- how optimal was pressure
  solunar_score DECIMAL(3, 2), -- how optimal was solunar timing
  weather_score DECIMAL(3, 2), -- overall weather favorability
  overall_score DECIMAL(3, 2), -- combined environmental score
  
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Solunar forecast table (pre-calculated optimal times)
CREATE TABLE public.solunar_forecasts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  water_body_id UUID REFERENCES public.water_bodies(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  
  -- Major periods (strongest activity)
  major_period_1_start TIME,
  major_period_1_end TIME,
  major_period_2_start TIME,
  major_period_2_end TIME,
  
  -- Minor periods (moderate activity)
  minor_period_1_start TIME,
  minor_period_1_end TIME,
  minor_period_2_start TIME,
  minor_period_2_end TIME,
  
  -- Overall ratings
  overall_rating INTEGER, -- 1-5 scale
  sunrise TIME,
  sunset TIME,
  moon_phase DECIMAL(3, 2),
  moon_rise TIME,
  moon_set TIME,
  
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(water_body_id, date)
);

-- Environmental alerts table
CREATE TABLE public.environmental_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  water_body_id UUID REFERENCES public.water_bodies(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL, -- weather_warning, optimal_conditions, temperature_change
  severity TEXT DEFAULT 'info', -- info, warning, alert, critical
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  active_from TIMESTAMPTZ NOT NULL DEFAULT now(),
  active_until TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_environmental_conditions_water_body ON public.environmental_conditions(water_body_id);
CREATE INDEX idx_environmental_conditions_recorded_at ON public.environmental_conditions(recorded_at);
CREATE INDEX idx_user_environmental_reports_water_body ON public.user_environmental_reports(water_body_id);
CREATE INDEX idx_user_environmental_reports_user ON public.user_environmental_reports(user_id);
CREATE INDEX idx_solunar_forecasts_date ON public.solunar_forecasts(date);
CREATE INDEX idx_environmental_alerts_active ON public.environmental_alerts(active_from, active_until);

-- Enable RLS
ALTER TABLE public.water_bodies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_environmental_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.catch_environmental_correlation ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.solunar_forecasts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.environmental_alerts ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Water bodies - readable by everyone
CREATE POLICY "Water bodies are publicly readable" ON public.water_bodies
  FOR SELECT USING (true);

-- Environmental conditions - readable by everyone
CREATE POLICY "Environmental conditions are publicly readable" ON public.environmental_conditions
  FOR SELECT USING (true);

-- User environmental reports - users can create their own, everyone can read
CREATE POLICY "Users can create their own environmental reports" ON public.user_environmental_reports
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own environmental reports" ON public.user_environmental_reports
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Environmental reports are publicly readable" ON public.user_environmental_reports
  FOR SELECT USING (true);

-- Catch correlations - tied to user's catches
CREATE POLICY "Users can view catch correlations for their catches" ON public.catch_environmental_correlation
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.catches c 
      WHERE c.id = catch_environmental_correlation.catch_id 
      AND c.user_id = auth.uid()
    )
  );

-- Solunar forecasts - readable by everyone
CREATE POLICY "Solunar forecasts are publicly readable" ON public.solunar_forecasts
  FOR SELECT USING (true);

-- Environmental alerts - readable by everyone
CREATE POLICY "Environmental alerts are publicly readable" ON public.environmental_alerts
  FOR SELECT USING (true);

-- Sample water bodies data for Alabama lakes
INSERT INTO public.water_bodies (name, state, latitude, longitude, water_type, average_depth, max_depth, surface_area) VALUES
  ('Lake Guntersville', 'Alabama', 34.3581, -86.2442, 'reservoir', 15.0, 45.0, 69000),
  ('Wheeler Lake', 'Alabama', 34.8526, -87.0842, 'reservoir', 12.0, 35.0, 67100),
  ('Pickwick Lake', 'Alabama', 34.9176, -88.2434, 'reservoir', 18.0, 55.0, 43100),
  ('Wilson Lake', 'Alabama', 34.8234, -87.6234, 'reservoir', 14.0, 42.0, 15500),
  ('Smith Lake', 'Alabama', 34.0234, -87.1234, 'lake', 25.0, 80.0, 21200);

-- Update trigger for environmental conditions
CREATE OR REPLACE FUNCTION update_water_body_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_water_bodies_updated_at
  BEFORE UPDATE ON public.water_bodies
  FOR EACH ROW
  EXECUTE FUNCTION update_water_body_updated_at();