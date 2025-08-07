-- Add unique constraint on session_id for active_sessions table
-- This will fix the "ON CONFLICT" error in session tracking

ALTER TABLE public.active_sessions 
ADD CONSTRAINT active_sessions_session_id_unique UNIQUE (session_id);