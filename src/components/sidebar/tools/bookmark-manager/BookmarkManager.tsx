import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSidebar } from '@/components/ui/sidebar';
import { Bookmark, Plus, ExternalLink, Star, Trash2, Edit, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { BookmarkImporter } from '@/lib/bookmark-import';

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

export function BookmarkManager() {
  const { state } = useSidebar();
  const { toast } = useToast();
  const isCollapsed = state === 'collapsed';
  const [bookmarks, setBookmarks] = useState<BookmarkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [importDialogOpen, setImportDialogOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<BookmarkData | null>(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
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

      if (editingBookmark) {
        const { data, error } = await supabase
          .from('bookmarks')
          .update(bookmarkData)
          .eq('id', editingBookmark.id)
          .select()
          .single();

        if (error) throw error;

        setBookmarks(prev => prev.map(b => b.id === editingBookmark.id ? data : b));
        toast({
          title: "Success",
          description: "Bookmark updated successfully!",
        });
      } else {
        const { data, error } = await supabase
          .from('bookmarks')
          .insert([bookmarkData])
          .select()
          .single();

        if (error) throw error;

        setBookmarks(prev => [data, ...prev]);
        toast({
          title: "Success",
          description: "Bookmark added successfully!",
        });
      }

      setDialogOpen(false);
      setEditingBookmark(null);
      setFormData({ title: '', url: '', description: '', tags: '' });
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

      setBookmarks(prev => prev.map(b => 
        b.id === bookmarkId 
          ? { ...b, is_favorite: !b.is_favorite }
          : b
      ));
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    }
  };

  const deleteBookmark = async (bookmarkId: string) => {
    try {
      const { error } = await supabase
        .from('bookmarks')
        .delete()
        .eq('id', bookmarkId);

      if (error) throw error;

      setBookmarks(prev => prev.filter(b => b.id !== bookmarkId));
      toast({
        title: "Success",
        description: "Bookmark deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting bookmark:', error);
      toast({
        title: "Error",
        description: "Failed to delete bookmark",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (bookmark: BookmarkData) => {
    setEditingBookmark(bookmark);
    setFormData({
      title: bookmark.title,
      url: bookmark.url,
      description: bookmark.description || '',
      tags: bookmark.tags.join(', ')
    });
    setDialogOpen(true);
  };

  const openAddDialog = () => {
    setEditingBookmark(null);
    setFormData({ title: '', url: '', description: '', tags: '' });
    setDialogOpen(true);
  };

  const handleFileImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.html') && !file.name.endsWith('.htm')) {
      toast({
        title: "Error",
        description: "Please select an HTML file",
        variant: "destructive",
      });
      return;
    }

    setImporting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return;

      const htmlContent = await file.text();
      const importedBookmarks = BookmarkImporter.parseHtmlFile(htmlContent);

      if (importedBookmarks.length === 0) {
        toast({
          title: "No bookmarks found",
          description: "The file doesn't contain any valid bookmarks",
          variant: "destructive",
        });
        return;
      }

      const bookmarksToInsert = await BookmarkImporter.processBookmarksForImport(
        importedBookmarks,
        user.user.id
      );

      const { data, error } = await supabase
        .from('bookmarks')
        .insert(bookmarksToInsert)
        .select();

      if (error) throw error;

      setBookmarks(prev => [...(data || []), ...prev]);
      setImportDialogOpen(false);
      
      toast({
        title: "Success",
        description: `Imported ${importedBookmarks.length} bookmarks successfully!`,
      });
    } catch (error) {
      console.error('Error importing bookmarks:', error);
      toast({
        title: "Error",
        description: "Failed to import bookmarks",
        variant: "destructive",
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  useEffect(() => {
    loadBookmarks();
  }, []);

  if (isCollapsed) {
    const favoriteCount = bookmarks.filter(b => b.is_favorite).length;
    
    return (
      <div className="space-y-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-2 rounded-lg border bg-card text-card-foreground"
        >
          <div className="flex flex-col items-center space-y-1">
            <Bookmark className="h-4 w-4 text-primary" />
            <div className="text-xs font-medium text-center">
              {bookmarks.length}
            </div>
            <div className="text-[10px] text-muted-foreground text-center">
              Saved
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence>
        <motion.h3
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider px-2 flex items-center space-x-1"
        >
          <Bookmark className="h-3 w-3" />
          <span>Bookmarks</span>
        </motion.h3>
      </AnimatePresence>
      
      <div className="space-y-2">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2, delay: 0.25 }}
            className="px-2 space-y-3"
          >
            {/* Add bookmark and import buttons */}
            <div className="flex space-x-2">
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={openAddDialog}
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </DialogTrigger>
              </Dialog>
              <Dialog open={importDialogOpen} onOpenChange={setImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 h-7 text-xs"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Import
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Bookmarks</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="text-sm text-muted-foreground">
                      Import bookmarks from HTML files exported from Chrome, Firefox, or Edge.
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bookmark-file-sidebar">Select HTML File</Label>
                      <Input
                        id="bookmark-file-sidebar"
                        type="file"
                        ref={fileInputRef}
                        accept=".html,.htm"
                        onChange={handleFileImport}
                        disabled={importing}
                      />
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <strong>Supported browsers:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1">
                        <li>Chrome: Settings → Bookmarks → Export</li>
                        <li>Firefox: Bookmarks → Import/Export</li>
                        <li>Edge: Settings → Favorites → Export</li>
                      </ul>
                    </div>
                    {importing && (
                      <div className="text-sm text-muted-foreground text-center py-2">
                        Importing bookmarks...
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingBookmark ? 'Edit Bookmark' : 'Add Bookmark'}
                  </DialogTitle>
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
                      {editingBookmark ? 'Update' : 'Add'} Bookmark
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

            {/* Bookmarks list */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {loading ? (
                <div className="text-xs text-muted-foreground text-center py-2">
                  Loading bookmarks...
                </div>
              ) : bookmarks.length === 0 ? (
                <div className="text-xs text-muted-foreground text-center py-2">
                  No bookmarks yet. Add one above!
                </div>
              ) : (
                bookmarks.map((bookmark) => (
                  <motion.div
                    key={bookmark.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="p-2 rounded-md bg-muted/50 space-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">
                          {bookmark.title}
                        </div>
                        {bookmark.description && (
                          <div className="text-[10px] text-muted-foreground truncate">
                            {bookmark.description}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-1 ml-1">
                        <Button
                          onClick={() => toggleFavorite(bookmark.id)}
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                        >
                          <Star 
                            className={`h-3 w-3 ${bookmark.is_favorite ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`} 
                          />
                        </Button>
                        <Button
                          onClick={() => window.open(bookmark.url, '_blank')}
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => openEditDialog(bookmark)}
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          onClick={() => deleteBookmark(bookmark.id)}
                          size="sm"
                          variant="ghost"
                          className="h-5 w-5 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    {bookmark.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {bookmark.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-[9px] px-1 py-0">
                            {tag}
                          </Badge>
                        ))}
                        {bookmark.tags.length > 2 && (
                          <Badge variant="outline" className="text-[9px] px-1 py-0">
                            +{bookmark.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}