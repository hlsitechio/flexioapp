import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface ActivityData {
  action_type: string;
  description: string;
  metadata?: Record<string, any>;
}

export function useActivityTracking() {
  const { user } = useAuth();

  const trackActivity = useCallback(async (activityData: ActivityData) => {
    if (!user) return;

    try {
      await supabase
        .from('recent_activity')
        .insert({
          user_id: user.id,
          action_type: activityData.action_type,
          description: activityData.description,
          metadata: activityData.metadata || {}
        });
    } catch (error) {
      console.error('Error tracking activity:', error);
    }
  }, [user]);

  const trackStarredItem = useCallback(async (itemId: string, itemTitle: string, itemType: string) => {
    if (!user) return;

    try {
      // Add to starred items
      await supabase
        .from('starred_items')
        .insert({
          user_id: user.id,
          item_id: itemId,
          item_title: itemTitle,
          item_type: itemType
        });

      // Track activity
      await trackActivity({
        action_type: 'star',
        description: `Starred "${itemTitle}"`,
        metadata: { item_id: itemId, item_type: itemType }
      });
    } catch (error) {
      console.error('Error starring item:', error);
    }
  }, [user, trackActivity]);

  const trackUnstarredItem = useCallback(async (itemTitle: string) => {
    if (!user) return;

    try {
      await trackActivity({
        action_type: 'unstar',
        description: `Unstarred "${itemTitle}"`
      });
    } catch (error) {
      console.error('Error tracking unstar activity:', error);
    }
  }, [user, trackActivity]);

  return {
    trackActivity,
    trackStarredItem,
    trackUnstarredItem
  };
}