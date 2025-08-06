import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageSquare, Send, Reply, Clock, AlertCircle } from 'lucide-react';
import { Label } from '@/components/ui/label';

interface User {
  id: string;
  email: string;
  profile?: {
    full_name?: string;
  };
}

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  subject: string;
  message: string;
  is_read: boolean;
  message_type: string;
  priority: string;
  status: string;
  thread_id?: string;
  parent_message_id?: string;
  created_at: string;
  updated_at: string;
  recipient?: User;
  sender?: User;
}

interface UserCommunicationProps {
  users: User[];
}

export default function UserCommunication({ users }: UserCommunicationProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [newMessage, setNewMessage] = useState({
    subject: '',
    message: '',
    priority: 'normal',
    message_type: 'direct'
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  useEffect(() => {
    loadMessages();
    setupRealtimeSubscription();
  }, []);

  const loadMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('user_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages.",
        variant: "destructive",
      });
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('user-messages')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_messages'
        },
        () => {
          loadMessages();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const sendMessage = async () => {
    if (!user || !selectedUser || !newMessage.message.trim()) {
      toast({
        title: "Error",
        description: "Please select a user and enter a message.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user.id,
          recipient_id: selectedUser,
          subject: newMessage.subject || 'Support Message',
          message: newMessage.message,
          message_type: newMessage.message_type,
          priority: newMessage.priority,
          thread_id: crypto.randomUUID()
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Message sent successfully.",
      });

      setNewMessage({
        subject: '',
        message: '',
        priority: 'normal',
        message_type: 'direct'
      });
      setSelectedUser('');
      setIsDialogOpen(false);
      loadMessages();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const sendReply = async (originalMessage: Message) => {
    if (!user || !replyMessage.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_messages')
        .insert({
          sender_id: user.id,
          recipient_id: originalMessage.sender_id,
          subject: `Re: ${originalMessage.subject}`,
          message: replyMessage,
          message_type: 'direct',
          priority: originalMessage.priority,
          thread_id: originalMessage.thread_id,
          parent_message_id: originalMessage.id
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Reply sent successfully.",
      });

      setReplyMessage('');
      setSelectedMessage(null);
      loadMessages();
    } catch (error) {
      console.error('Error sending reply:', error);
      toast({
        title: "Error",
        description: "Failed to send reply.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      const { error } = await supabase
        .from('user_messages')
        .update({ is_read: true, status: 'read' })
        .eq('id', messageId);

      if (error) throw error;
      loadMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const getPriorityBadge = (priority: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      low: 'secondary',
      normal: 'default',
      high: 'outline',
      urgent: 'destructive'
    };
    return variants[priority] || 'default';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          User Communication
        </h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send Message to User</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="recipient">Recipient</Label>
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.profile?.full_name || user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newMessage.subject}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, subject: e.target.value }))}
                  placeholder="Message subject"
                />
              </div>
              <div>
                <Label htmlFor="priority">Priority</Label>
                <Select value={newMessage.priority} onValueChange={(value) => setNewMessage(prev => ({ ...prev, priority: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={newMessage.message}
                  onChange={(e) => setNewMessage(prev => ({ ...prev, message: e.target.value }))}
                  placeholder="Type your message..."
                  rows={4}
                />
              </div>
              <Button onClick={sendMessage} disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Message'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            {messages.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No messages yet</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 border rounded-lg space-y-2 ${!message.is_read ? 'bg-muted/50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{message.subject}</span>
                          <Badge variant={getPriorityBadge(message.priority)}>
                            {message.priority}
                          </Badge>
                          {!message.is_read && (
                            <Badge variant="outline">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              Unread
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          To: {users.find(u => u.id === message.recipient_id)?.profile?.full_name || 
                               users.find(u => u.id === message.recipient_id)?.email || 'Unknown User'}
                        </p>
                        <p className="text-sm mt-2">{message.message}</p>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatDate(message.created_at)}
                        </div>
                        <div className="flex gap-2">
                          {!message.is_read && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsRead(message.id)}
                            >
                              Mark Read
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedMessage(message)}
                          >
                            <Reply className="h-3 w-3 mr-1" />
                            Reply
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Reply Dialog */}
      <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="font-medium">{selectedMessage.subject}</p>
                <p className="text-sm text-muted-foreground mt-1">{selectedMessage.message}</p>
              </div>
              <div>
                <Label htmlFor="reply">Your Reply</Label>
                <Textarea
                  id="reply"
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  rows={4}
                />
              </div>
              <Button onClick={() => sendReply(selectedMessage)} disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Reply'}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}