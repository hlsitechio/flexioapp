-- Update existing user_navigation_order in user_settings to use correct component names
UPDATE user_settings 
SET user_navigation_order = '["DarkModeToggle", "Profile", "NotificationButton", "UserSettings", "UserCustomization", "SignInOut"]'::jsonb 
WHERE user_navigation_order IS NOT NULL;