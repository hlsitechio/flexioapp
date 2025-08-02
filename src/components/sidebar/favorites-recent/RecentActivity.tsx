import { useState, useEffect } from 'react';
import { Clock, Activity } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

interface RecentActivityItem {
  id: string;
  action_type: string;
  description: string;
  created_at: string;
  metadata: any;
}

interface RecentActivityProps {
  isCollapsed: boolean;
}

export function RecentActivity({ isCollapsed }: RecentActivityProps) {
  const { user } = useAuth();
  const [activities, setActivities] = useState<RecentActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchRecentActivity();
  }, [user]);

  const fetchRecentActivity = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('recent_activity')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setActivities(data || []);
    } catch (error) {
      console.error('Error fetching recent activity:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-6 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`text-xs text-muted-foreground ${isCollapsed ? 'px-1 text-center' : 'px-2'}`}>
        {isCollapsed ? '◷' : 'No recent activity'}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-1 px-1">
        <Activity className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{activities.length}</span>
      </div>
    );
  }

  return (
    <div className="space-y-1 px-2">
      {activities.map((activity) => (
        <Card key={activity.id} className="border-0 bg-muted/30">
          <CardContent className="p-2">
            <div className="flex items-start gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground leading-relaxed">
                  {activity.description}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Clock className="h-2.5 w-2.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {formatTimeAgo(activity.created_at)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}