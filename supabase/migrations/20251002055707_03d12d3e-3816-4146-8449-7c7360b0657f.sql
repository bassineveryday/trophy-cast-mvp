-- Drop existing conflicting policies
DROP POLICY IF EXISTS "Users can view roles in their clubs" ON user_roles;
DROP POLICY IF EXISTS "Club officers can manage roles" ON user_roles;

-- Create new tables for Phase 1
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  date TIMESTAMPTZ NOT NULL,
  location TEXT,
  host_club_id UUID REFERENCES clubs,
  rules TEXT,
  status TEXT DEFAULT 'upcoming',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID REFERENCES tournaments ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  status TEXT DEFAULT 'registered',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id)
);

CREATE TABLE IF NOT EXISTS club_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  club_id UUID REFERENCES clubs ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);

CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  message TEXT NOT NULL,
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS missions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  description TEXT,
  progress INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  ai_coach_enabled BOOLEAN DEFAULT true,
  share_catch_patterns BOOLEAN DEFAULT false,
  coaching_intensity TEXT DEFAULT 'moderate',
  public_profile BOOLEAN DEFAULT true,
  show_catches_in_feed BOOLEAN DEFAULT true,
  allow_location_sharing BOOLEAN DEFAULT false,
  display_in_leaderboards BOOLEAN DEFAULT true,
  contribute_conservation_data BOOLEAN DEFAULT true,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on new tables
DO $$ 
BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
  ALTER TABLE tournament_registrations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
  ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
  ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
  ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
  ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

-- RLS Policies
DROP POLICY IF EXISTS "Public profiles viewable" ON profiles;
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Tournaments viewable by all" ON tournaments;
CREATE POLICY "Tournaments viewable by all" ON tournaments FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can view all registrations" ON tournament_registrations;
CREATE POLICY "Users can view all registrations" ON tournament_registrations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can register themselves" ON tournament_registrations;
CREATE POLICY "Users can register themselves" ON tournament_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Club members viewable by all" ON club_members;
CREATE POLICY "Club members viewable by all" ON club_members FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can join clubs" ON club_members;
CREATE POLICY "Users can join clubs" ON club_members FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Messages viewable by all" ON messages;
CREATE POLICY "Messages viewable by all" ON messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages" ON messages FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own AI conversations" ON ai_conversations;
CREATE POLICY "Users can view own AI conversations" ON ai_conversations FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own AI conversations" ON ai_conversations;
CREATE POLICY "Users can insert own AI conversations" ON ai_conversations FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own missions" ON missions;
CREATE POLICY "Users can view own missions" ON missions FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own missions" ON missions;
CREATE POLICY "Users can insert own missions" ON missions FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own missions" ON missions;
CREATE POLICY "Users can update own missions" ON missions FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
CREATE POLICY "Users can view own preferences" ON user_preferences FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;
CREATE POLICY "Users can update own preferences" ON user_preferences FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
CREATE POLICY "Users can insert own preferences" ON user_preferences FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Fix user_roles recursion by using club_members instead
CREATE POLICY "Users can view roles in their clubs v2" ON user_roles 
FOR SELECT 
USING (
  user_id = auth.uid()
  OR club_id IN (
    SELECT club_id FROM club_members WHERE user_id = auth.uid()
  )
);

CREATE POLICY "Club officers can manage roles v2" ON user_roles 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM club_members cm
    WHERE cm.club_id = user_roles.club_id
    AND cm.user_id = auth.uid()
    AND cm.role IN ('president', 'vice_president', 'secretary', 'club_admin')
  )
);