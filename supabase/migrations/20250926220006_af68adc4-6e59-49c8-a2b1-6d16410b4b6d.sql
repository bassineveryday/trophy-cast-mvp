-- Insert some demo data for testing

-- First, let's create a demo club
INSERT INTO public.clubs (name, location, description) 
VALUES ('Demo Bass Club', 'Lake Guntersville, AL', 'Demo club for testing tournament features')
ON CONFLICT DO NOTHING;

-- Note: To test the role-based functionality, you'll need to:
-- 1. Sign up a user through the app 
-- 2. Get the user ID from the auth.users table
-- 3. Insert a role for that user in user_roles table

-- Example SQL to make a user a club officer (run this manually with actual user_id):
-- INSERT INTO public.user_roles (user_id, role, club_id) 
-- VALUES ('your-user-id-here', 'club_officer', (SELECT id FROM clubs WHERE name = 'Demo Bass Club' LIMIT 1));