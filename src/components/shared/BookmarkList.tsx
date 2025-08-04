import { useState } from 'react';
import { Star, ExternalLink, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BookmarkData } from '@/hooks/useBookmarks';

interface BookmarkListProps {
  bookmarks: BookmarkData[];
  onToggleFavorite: (id: string) => void;
  loading?: boolean;
  emptyMessage?: string;
}

export function BookmarkList({ 
  bookmarks, 
  onToggleFavorite, 
  loading = false,
  emptyMessage = "No bookmarks saved yet."
}: BookmarkListProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBookmarks = bookmarks.filter(bookmark =>
    bookmark.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    bookmark.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="p-3 border rounded-lg animate-pulse">
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <Input
        placeholder="Search bookmarks..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />

      {/* Bookmark List */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredBookmarks.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {searchQuery ? 'No bookmarks found matching your search.' : emptyMessage}
          </p>
        ) : (
          filteredBookmarks.map((bookmark) => (
            <div
              key={bookmark.id}
              className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm truncate">{bookmark.title}</h4>
                  <p className="text-xs text-muted-foreground truncate mt-1">
                    {bookmark.url}
                  </p>
                  {bookmark.description && (
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                      {bookmark.description}
                    </p>
                  )}
                  {bookmark.tags && bookmark.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      {bookmark.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-block bg-muted px-2 py-0.5 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {bookmark.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{bookmark.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-1 ml-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onToggleFavorite(bookmark.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        bookmark.is_favorite
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-muted-foreground'
                      }`}
                    />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(bookmark.url, '_blank')}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}