-- Add unwind_mode_enabled column to user_preferences table
ALTER TABLE user_preferences 
ADD COLUMN unwind_mode_enabled boolean DEFAULT false;