import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
// import { parseBookmarkFile } from '@/lib/bookmark-import';

export interface BookmarkData {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags?: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export interface BookmarkFormData {
  title: string;
  url: string;
  description: string;
  tags: string;
}

export function useBookmarks() {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadBookmarks = useCallback(async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBookmarks(data || []);
    } catch (err) {
      console.error('Error loading bookmarks:', err);
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const saveBookmark = useCallback(async (formData: BookmarkFormData) => {
    if (!user) return;

    try {
      const bookmarkData = {
        user_id: user.id,
        title: formData.title,
        url: formData.url,
        description: formData.description || null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()) : [],
        is_favorite: false,
      };

      const { error } = await supabase
        .from('bookmarks')
        .insert([bookmarkData]);

      if (error) throw error;
      
      // Reload bookmarks to get the latest data
      await loadBookmarks();
    } catch (err) {
      console.error('Error saving bookmark:', err);
      setError('Failed to save bookmark');
    }
  }, [user, loadBookmarks]);

  const toggleFavorite = useCallback(async (bookmarkId: string) => {
    try {
      const bookmark = bookmarks.find(b => b.id === bookmarkId);
      if (!bookmark) return;

      const { error } = await supabase
        .from('bookmarks')
        .update({ is_favorite: !bookmark.is_favorite })
        .eq('id', bookmarkId);

      if (error) throw error;

      // Update local state
      setBookmarks(prev => 
        prev.map(b => 
          b.id === bookmarkId 
            ? { ...b, is_favorite: !b.is_favorite }
            : b
        )
      );
    } catch (err) {
      console.error('Error toggling favorite:', err);
      setError('Failed to update bookmark');
    }
  }, [bookmarks]);

  const deleteBookmark = useCallback(async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      // Update local state
      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
    } catch (err) {
      console.error('Error deleting bookmark:', err);
      setError('Failed to delete bookmark');
    }
  }, []);

  const importBookmarks = useCallback(async (file: File) => {
    if (!user) return;

    try {
      setLoading(true);
      // TODO: Implement parseBookmarkFile function
      // const importedBookmarks = await parseBookmarkFile(file);
      
      // For now, just show a placeholder message
      console.log('Import functionality will be implemented later');
      setError('Import functionality coming soon');
      
      await loadBookmarks();
    } catch (err) {
      console.error('Error importing bookmarks:', err);
      setError('Failed to import bookmarks');
    } finally {
      setLoading(false);
    }
  }, [user, loadBookmarks]);

  const getBookmarkCount = useCallback(() => {
    return bookmarks.length;
  }, [bookmarks]);

  const getFavoriteCount = useCallback(() => {
    return bookmarks.filter(b => b.is_favorite).length;
  }, [bookmarks]);

  // Load bookmarks on mount
  useEffect(() => {
    loadBookmarks();
  }, [loadBookmarks]);

  return {
    bookmarks,
    loading,
    error,
    loadBookmarks,
    saveBookmark,
    toggleFavorite,
    deleteBookmark,
    importBookmarks,
    getBookmarkCount,
    getFavoriteCount,
  };
}