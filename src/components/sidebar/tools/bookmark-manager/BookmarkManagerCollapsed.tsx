import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface BookmarkData {
  id: string;
}

export function BookmarkManagerCollapsed() {
  const [bookmarkCount, setBookmarkCount] = useState(0);

  const loadBookmarkCount = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { count, error } = await supabase
        .from('bookmarks')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.user.id);

      if (error) throw error;

      setBookmarkCount(count || 0);
    } catch (error) {
      console.error('Error loading bookmark count:', error);
    }
  };

  useEffect(() => {
    loadBookmarkCount();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-2 rounded-lg border bg-card text-card-foreground"
    >
      <div className="flex flex-col items-center space-y-1">
        <Bookmark className="h-4 w-4 text-primary" />
        <div className="text-xs font-medium text-center">
          {bookmarkCount}
        </div>
        <div className="text-[10px] text-muted-foreground text-center">
          Saved
        </div>
      </div>
    </motion.div>
  );
}