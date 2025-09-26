-- Create some sample data for testing club functionality
-- This will help users test the club dashboard features

-- Insert a test role for the first user that signs up (they can modify this manually)
-- First, let's see if there are any users
DO $$
DECLARE
    first_user_id uuid;
    demo_club_id uuid;
BEGIN
    -- Get the demo club ID
    SELECT id INTO demo_club_id FROM public.clubs WHERE name = 'Demo Bass Club' LIMIT 1;
    
    IF demo_club_id IS NOT NULL THEN
        -- Get first user if any exist
        SELECT id INTO first_user_id FROM auth.users LIMIT 1;
        
        IF first_user_id IS NOT NULL THEN
            -- Make the first user a club officer of the demo club
            INSERT INTO public.user_roles (user_id, role, club_id) 
            VALUES (first_user_id, 'club_officer', demo_club_id)
            ON CONFLICT (user_id, club_id) DO UPDATE SET role = 'club_officer';
        END IF;
    END IF;
END $$;

-- Insert a few more demo clubs for variety
INSERT INTO public.clubs (name, location, description) VALUES
('Alabama Bass Masters', 'Wheeler Lake, AL', 'Competitive bass fishing club with weekly tournaments'),
('Tennessee Valley Anglers', 'Guntersville, AL', 'Family-friendly fishing club for all skill levels'),
('Deep South Bass Club', 'Lake Martin, AL', 'Premier bass fishing organization in Alabama')
ON CONFLICT DO NOTHING;