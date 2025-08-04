import { useState, useEffect } from 'react';
import { Bookmark, Plus, ExternalLink, Star, Search, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BookmarkData {
  id: string;
  title: string;
  url: string;
  description?: string;
  tags: string[];
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
}

export function DashboardBookmarkManager() {
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [filteredBookmarks, setFilteredBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    description: '',
    tags: ''
  });

  const loadBookmarks = async () => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const { data, error } = await supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setBookmarks(data || []);
      setFilteredBookmarks(data || []);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to load bookmarks",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveBookmark = async () => {
    if (!formData.title.trim() || !formData.url.trim()) {
      toast({
        title: "Error",
        description: "Title and URL are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const bookmarkData = {
        user_id: user.user.id,
        title: formData.title.trim(),
        url: formData.url.trim(),
        description: formData.description.trim() || null,
        tags: tagsArray
      };

      const { data, error } = await supabase
        .from('bookmarks')
        .insert([bookmarkData])
        .select()
        .single();

      if (error) throw error;

      setBookmarks(prev => [data, ...prev]);
      setFilteredBookmarks(prev => [data, ...prev]);
      setDialogOpen(false);
      setFormData({ title: '', url: '', description: '', tags: '' });
      toast({
        title: "Success",
        description: "Bookmark added successfully!",
      });
    } catch (error) {
      console.error('Error saving bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to save bookmark",
        variant: "destructive",
      });
    }
  };

  const toggleFavorite = async (bookmarkId: string) => {
    try {
      const bookmark = bookmarks.find(b => b.id === bookmarkId);
      if (!bookmark) return;

      const { error } = await supabase
        .from('bookmarks')
        .update({ is_favorite: !bookmark.is_favorite })
        .eq('id', bookmarkId);

      if (error) throw error;

      const updateBookmarksList = (prev: BookmarkData[]) =>
        prev.map(b => 
          b.id === bookmarkId 
            ? { ...b, is_favorite: !b.is_favorite }
            : b
        );

      setBookmarks(updateBookmarksList);
      setFilteredBookmarks(updateBookmarksList);
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const filterBookmarks = (query: string) => {
    if (!query.trim()) {
      setFilteredBookmarks(bookmarks);
      return;
    }

    const filtered = bookmarks.filter(bookmark =>
      bookmark.title.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.description?.toLowerCase().includes(query.toLowerCase()) ||
      bookmark.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );

    setFilteredBookmarks(filtered);
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  useEffect(() => {
    filterBookmarks(searchQuery);
  }, [searchQuery, bookmarks]);

  const favoriteCount = bookmarks.filter(b => b.is_favorite).length;
  const totalCount = bookmarks.length;

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center space-x-2">
          <Bookmark className="h-5 w-5 text-primary" />
          <span>Bookmark Manager</span>
          <div className="ml-auto flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {totalCount} total
            </Badge>
            {favoriteCount > 0 && (
              <Badge variant="outline" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
                {favoriteCount}
              </Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Add */}
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bookmarks..."
              className="pl-9"
            />
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add Bookmark</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Bookmark title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    value={formData.url}
                    onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                    placeholder="https://example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description (optional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description..."
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="work, tools, research"
                  />
                </div>
                <div className="flex space-x-2">
                  <Button onClick={saveBookmark} className="flex-1">
                    Add Bookmark
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Bookmarks list */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {loading ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              Loading bookmarks...
            </div>
          ) : filteredBookmarks.length === 0 ? (
            <div className="text-sm text-muted-foreground text-center py-4">
              {searchQuery ? 'No bookmarks match your search.' : 'No bookmarks yet. Add one above!'}
            </div>
          ) : (
            filteredBookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="p-3 rounded-lg border bg-muted/50 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">
                      {bookmark.title}
                    </div>
                    {bookmark.description && (
                      <div className="text-sm text-muted-foreground truncate">
                        {bookmark.description}
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground truncate">
                      {bookmark.url}
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <Button
                      onClick={() => toggleFavorite(bookmark.id)}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <Star 
                        className={`h-4 w-4 ${bookmark.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                      />
                    </Button>
                    <Button
                      onClick={() => window.open(bookmark.url, '_blank')}
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {bookmark.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {bookmark.tags.slice(0, 3).map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                    {bookmark.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs px-2 py-0">
                        +{bookmark.tags.length - 3} more
                      </Badge>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}