import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Monitor, Eye, Clock, MapPin, Smartphone, RefreshCw } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface User {
  id: string;
  email: string;
  profile?: {
    full_name?: string;
  };
}

interface ActiveSession {
  id: string;
  user_id: string;
  session_id: string;
  workspace_id?: string;
  current_route?: string;
  last_activity: string;
  user_agent?: string;
  ip_address?: string | null;
  device_info: any;
  browser_info: any;
  screen_resolution?: string;
  dashboard_state: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface UserSessionViewProps {
  users: User[];
}

export default function UserSessionView({ users }: UserSessionViewProps) {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ActiveSession[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedSession, setSelectedSession] = useState<ActiveSession | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadActiveSessions();
    setupRealtimeSubscription();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadUserSessions(selectedUser);
    } else {
      loadActiveSessions();
    }
  }, [selectedUser]);

  const loadActiveSessions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as ActiveSession[]);
    } catch (error) {
      console.error('Error loading active sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load active sessions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUserSessions = async (userId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('active_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('last_activity', { ascending: false });

      if (error) throw error;
      setSessions((data || []) as ActiveSession[]);
    } catch (error) {
      console.error('Error loading user sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load user sessions.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('active-sessions')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'active_sessions'
        },
        () => {
          if (selectedUser) {
            loadUserSessions(selectedUser);
          } else {
            loadActiveSessions();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const getUserInfo = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user?.profile?.full_name || user?.email || `User ${userId.slice(0, 8)}`;
  };

  const formatLastActivity = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Monitor className="h-4 w-4" />;
    if (userAgent.includes('Mobile') || userAgent.includes('Android') || userAgent.includes('iPhone')) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const getBrowserInfo = (userAgent?: string) => {
    if (!userAgent) return 'Unknown';
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    return 'Unknown';
  };

  const getActivityStatus = (lastActivity: string) => {
    const diffMs = new Date().getTime() - new Date(lastActivity).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 5) return { status: 'active', color: 'bg-green-500' };
    if (diffMins < 30) return { status: 'idle', color: 'bg-yellow-500' };
    return { status: 'away', color: 'bg-gray-500' };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Monitor className="h-5 w-5" />
          User Session View
        </h3>
        <div className="flex gap-2">
          <Select value={selectedUser} onValueChange={setSelectedUser}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="All users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All users</SelectItem>
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.profile?.full_name || user.email}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => selectedUser ? loadUserSessions(selectedUser) : loadActiveSessions()} disabled={loading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Active Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sessions.filter(s => s.is_active).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Unique Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(sessions.map(s => s.user_id)).size}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.filter(s => {
                const diffMs = new Date().getTime() - new Date(s.last_activity).getTime();
                const diffMins = Math.floor(diffMs / (1000 * 60));
                return diffMins < 5;
              }).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            {sessions.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {loading ? 'Loading sessions...' : 'No active sessions found'}
              </p>
            ) : (
              <div className="space-y-4">
                {sessions.map((session) => {
                  const activityStatus = getActivityStatus(session.last_activity);
                  return (
                    <div
                      key={session.id}
                      className="p-4 border rounded-lg space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <div className={`w-2 h-2 rounded-full ${activityStatus.color}`} />
                            <span className="font-medium">{getUserInfo(session.user_id)}</span>
                            <Badge variant="outline" className="text-xs">
                              {activityStatus.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              {getDeviceIcon(session.user_agent)}
                              <span>{getBrowserInfo(session.user_agent)}</span>
                            </div>
                            {session.ip_address && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3 w-3" />
                                <span>{session.ip_address}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              <span>{formatLastActivity(session.last_activity)}</span>
                            </div>
                            {session.current_route && (
                              <div className="flex items-center gap-1">
                                <span>Route: {session.current_route}</span>
                              </div>
                            )}
                          </div>
                          {session.screen_resolution && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Resolution: {session.screen_resolution}
                            </div>
                          )}
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedSession(session)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Session Details</DialogTitle>
                            </DialogHeader>
                            {selectedSession && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">User</label>
                                    <p className="text-sm text-muted-foreground">
                                      {getUserInfo(selectedSession.user_id)}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Session ID</label>
                                    <p className="text-sm text-muted-foreground font-mono">
                                      {selectedSession.session_id}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Current Route</label>
                                    <p className="text-sm text-muted-foreground">
                                      {selectedSession.current_route || 'N/A'}
                                    </p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Last Activity</label>
                                    <p className="text-sm text-muted-foreground">
                                      {new Date(selectedSession.last_activity).toLocaleString()}
                                    </p>
                                  </div>
                                  {selectedSession.ip_address && (
                                    <div>
                                      <label className="text-sm font-medium">IP Address</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedSession.ip_address}
                                      </p>
                                    </div>
                                  )}
                                  {selectedSession.screen_resolution && (
                                    <div>
                                      <label className="text-sm font-medium">Screen Resolution</label>
                                      <p className="text-sm text-muted-foreground">
                                        {selectedSession.screen_resolution}
                                      </p>
                                    </div>
                                  )}
                                </div>
                                
                                {selectedSession.user_agent && (
                                  <div>
                                    <label className="text-sm font-medium">User Agent</label>
                                    <p className="text-xs text-muted-foreground break-all">
                                      {selectedSession.user_agent}
                                    </p>
                                  </div>
                                )}

                                {selectedSession.dashboard_state && Object.keys(selectedSession.dashboard_state).length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium">Dashboard State</label>
                                    <ScrollArea className="h-32 mt-1">
                                      <pre className="text-xs bg-muted p-2 rounded">
                                        {JSON.stringify(selectedSession.dashboard_state, null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                )}

                                {selectedSession.device_info && Object.keys(selectedSession.device_info).length > 0 && (
                                  <div>
                                    <label className="text-sm font-medium">Device Info</label>
                                    <ScrollArea className="h-24 mt-1">
                                      <pre className="text-xs bg-muted p-2 rounded">
                                        {JSON.stringify(selectedSession.device_info, null, 2)}
                                      </pre>
                                    </ScrollArea>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}