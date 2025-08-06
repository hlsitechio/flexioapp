
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Bookmark, Plus, ExternalLink, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BookmarkItem {
  id: number;
  title: string;
  url: string;
}

export function DashboardBookmarkManager() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
    { id: 1, title: 'GitHub', url: 'https://github.com' },
    { id: 2, title: 'Stack Overflow', url: 'https://stackoverflow.com' },
    { id: 3, title: 'MDN Docs', url: 'https://developer.mozilla.org' },
  ]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const addBookmark = () => {
    if (newTitle && newUrl) {
      const newBookmark = {
        id: Date.now(),
        title: newTitle,
        url: newUrl.startsWith('http') ? newUrl : `https://${newUrl}`,
      };
      setBookmarks([...bookmarks, newBookmark]);
      setNewTitle('');
      setNewUrl('');
      setIsAdding(false);
    }
  };

  const deleteBookmark = (id: number) => {
    setBookmarks(bookmarks.filter(bookmark => bookmark.id !== id));
  };

  const openBookmark = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Card className="h-full bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/20 dark:to-cyan-900/20 animate-fade-in">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Bookmark className="h-5 w-5 text-teal-600 dark:text-teal-400" />
          Bookmarks
          <Button
            onClick={() => setIsAdding(true)}
            size="sm"
            variant="ghost"
            className="ml-auto h-8 w-8 p-0"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {isAdding && (
            <div className="space-y-2 p-3 bg-background/50 rounded-md border border-border/50">
              <Input
                placeholder="Title"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="text-xs"
              />
              <Input
                placeholder="URL"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                className="text-xs"
              />
              <div className="flex gap-1">
                <Button onClick={addBookmark} size="sm" className="text-xs">
                  Add
                </Button>
                <Button onClick={() => setIsAdding(false)} size="sm" variant="outline" className="text-xs">
                  Cancel
                </Button>
              </div>
            </div>
          )}
          
          <div className="space-y-2 max-h-48 overflow-auto">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center gap-2 p-2 bg-background/30 rounded-md hover:bg-background/50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {bookmark.title}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {bookmark.url}
                  </p>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    onClick={() => openBookmark(bookmark.url)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    onClick={() => deleteBookmark(bookmark.id)}
                    size="sm"
                    variant="ghost"
                    className="h-6 w-6 p-0 hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {bookmarks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-sm text-muted-foreground">
                No bookmarks yet. Click the + button to add one.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
