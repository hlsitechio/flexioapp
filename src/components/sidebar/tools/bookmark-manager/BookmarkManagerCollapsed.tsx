import { Bookmark } from 'lucide-react';
import { useBookmarks } from '@/hooks/useBookmarks';
import { ToolContainer } from '@/components/shared/ToolContainer';

export function BookmarkManagerCollapsed() {
  const { getBookmarkCount } = useBookmarks();

  const collapsedContent = (
    <div className="flex flex-col items-center space-y-1">
      <Bookmark className="h-4 w-4 text-primary" />
      <div className="text-xs font-medium text-center">
        {getBookmarkCount()}
      </div>
      <div className="text-[10px] text-muted-foreground text-center">
        Saved
      </div>
    </div>
  );

  return (
    <ToolContainer
      title="Bookmarks"
      icon={Bookmark}
      collapsedContent={collapsedContent}
    >
      {/* This should not render in collapsed mode */}
      <div>Bookmarks</div>
    </ToolContainer>
  );
}