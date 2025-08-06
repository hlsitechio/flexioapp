-- Create messages table for user communication
CREATE TABLE public.user_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL, -- admin user ID
  recipient_id UUID NOT NULL, -- user receiving the message
  subject TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  message_type TEXT NOT NULL DEFAULT 'direct', -- direct, system, support
  priority TEXT NOT NULL DEFAULT 'normal', -- low, normal, high, urgent
  status TEXT NOT NULL DEFAULT 'sent', -- sent, delivered, read
  thread_id UUID, -- for message threading
  parent_message_id UUID, -- for replies
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_messages ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_messages
CREATE POLICY "Admins can manage all messages"
ON public.user_messages
FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own messages"
ON public.user_messages
FOR SELECT
USING (auth.uid() = recipient_id OR auth.uid() = sender_id);

CREATE POLICY "Users can reply to messages"
ON public.user_messages
FOR INSERT
WITH CHECK (auth.uid() = sender_id AND parent_message_id IS NOT NULL);

-- Create active sessions table for session monitoring
CREATE TABLE public.active_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  session_id TEXT NOT NULL,
  workspace_id UUID,
  current_route TEXT,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  user_agent TEXT,
  ip_address INET,
  device_info JSONB DEFAULT '{}',
  browser_info JSONB DEFAULT '{}',
  screen_resolution TEXT,
  dashboard_state JSONB DEFAULT '{}', -- current dashboard settings and layout
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- RLS policies for active_sessions
CREATE POLICY "Admins can view all sessions"
ON public.active_sessions
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can manage their own sessions"
ON public.active_sessions
FOR ALL
USING (auth.uid() = user_id);

-- Create triggers for updated_at
CREATE TRIGGER update_user_messages_updated_at
BEFORE UPDATE ON public.user_messages
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_active_sessions_updated_at
BEFORE UPDATE ON public.active_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for both tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.active_sessions;