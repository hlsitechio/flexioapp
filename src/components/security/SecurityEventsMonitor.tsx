import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertTriangle, CheckCircle, Clock, Shield } from 'lucide-react';
import { toast } from 'sonner';

interface SecurityEvent {
  id: string;
  event_type: string;
  user_id: string | null;
  ip_address: unknown;
  user_agent: string | null;
  severity: string;
  metadata: any;
  resolved: boolean;
  resolved_at: string | null;
  resolved_by: string | null;
  created_at: string;
}

export function SecurityEventsMonitor() {
  const [events, setEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingEvents, setResolvingEvents] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchSecurityEvents();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('security_events')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'security_events'
      }, (payload) => {
        fetchSecurityEvents();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchSecurityEvents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast.error('Failed to fetch security events');
    } finally {
      setLoading(false);
    }
  };

  const resolveEvent = async (eventId: string) => {
    try {
      setResolvingEvents(prev => new Set(prev).add(eventId));
      
      const { error } = await supabase
        .from('security_events')
        .update({
          resolved: true,
          resolved_at: new Date().toISOString(),
          resolved_by: (await supabase.auth.getUser()).data.user?.id
        })
        .eq('id', eventId);

      if (error) throw error;
      
      toast.success('Security event resolved');
      fetchSecurityEvents();
    } catch (error) {
      console.error('Error resolving security event:', error);
      toast.error('Failed to resolve security event');
    } finally {
      setResolvingEvents(prev => {
        const next = new Set(prev);
        next.delete(eventId);
        return next;
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'account_locked':
      case 'suspicious_login':
        return <Shield className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const unresolvedEvents = events.filter(event => !event.resolved);
  const resolvedEvents = events.filter(event => event.resolved);

  return (
    <div className="space-y-6">
      {/* Unresolved Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Active Security Alerts</CardTitle>
              {unresolvedEvents.length > 0 && (
                <Badge variant="destructive">{unresolvedEvents.length}</Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {unresolvedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-success" />
              <p>No active security alerts</p>
            </div>
          ) : (
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unresolvedEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.event_type)}
                          <span>{event.event_type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {String(event.ip_address) || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {new Date(event.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => resolveEvent(event.id)}
                          disabled={resolvingEvents.has(event.id)}
                        >
                          {resolvingEvents.has(event.id) ? (
                            <Clock className="h-4 w-4 animate-spin" />
                          ) : (
                            'Resolve'
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Resolved Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            <CardTitle>Resolved Security Events</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {resolvedEvents.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No resolved events yet
            </div>
          ) : (
            <ScrollArea className="h-64">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Event</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Resolved Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resolvedEvents.map((event) => (
                    <TableRow key={event.id} className="opacity-60">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getEventIcon(event.event_type)}
                          <span>{event.event_type.replace('_', ' ')}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {String(event.ip_address) || 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getSeverityColor(event.severity)}>
                          {event.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {event.resolved_at ? new Date(event.resolved_at).toLocaleString() : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}