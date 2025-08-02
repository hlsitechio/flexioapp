-- Enable realtime for user_settings table
ALTER TABLE user_settings REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE user_settings;