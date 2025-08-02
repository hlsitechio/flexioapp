-- Add hide_dividers column to user_settings table
ALTER TABLE user_settings ADD COLUMN hide_dividers BOOLEAN DEFAULT false;