import { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface StarredItem {
  id: string;
  item_id: string;
  item_title: string;
  item_type: string;
  starred_at: string;
}

interface StarredTasksProps {
  isCollapsed: boolean;
}

export function StarredTasks({ isCollapsed }: StarredTasksProps) {
  const { user } = useAuth();
  const [starredItems, setStarredItems] = useState<StarredItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchStarredItems();
  }, [user]);

  const fetchStarredItems = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('starred_items')
        .select('*')
        .eq('user_id', user.id)
        .order('starred_at', { ascending: false })
        .limit(5);

      if (error) throw error;
      setStarredItems(data || []);
    } catch (error) {
      console.error('Error fetching starred items:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeStarredItem = async (id: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('starred_items')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);

      if (error) throw error;
      setStarredItems(items => items.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error removing starred item:', error);
    }
  };

  if (loading) {
    return (
      <div className={`space-y-2 ${isCollapsed ? 'px-1' : 'px-2'}`}>
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-8 bg-muted/50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  if (starredItems.length === 0) {
    return (
      <div className={`text-xs text-muted-foreground ${isCollapsed ? 'px-1 text-center' : 'px-2'}`}>
        {isCollapsed ? '★' : 'No starred tasks yet'}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="flex flex-col items-center space-y-1 px-1">
        <Star className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium">{starredItems.length}</span>
      </div>
    );
  }

  return (
    <div className="space-y-2 px-2">
      {starredItems.map((item) => (
        <Card key={item.id} className="border-0 bg-muted/30">
          <CardContent className="p-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {item.item_title}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {item.item_type}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 opacity-60 hover:opacity-100"
                onClick={() => removeStarredItem(item.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}