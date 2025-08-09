import React from 'react';
import { cn } from '@/lib/utils';
import { Home, Kanban, StickyNote, Calendar, BookMarked, BarChart3, Settings, Search } from 'lucide-react';
import { ToolsShowcase } from './ToolsShowcase';

interface MiniDashboardPreviewProps {
  className?: string;
}

// Presentational mini dashboard preview used in the hero section
// Includes a faux sidebar + top header around our ToolsShowcase
export function MiniDashboardPreview({ className }: MiniDashboardPreviewProps) {
  const navItems = [
    { label: 'Dashboard', icon: Home, active: true },
    { label: 'Kanban', icon: Kanban },
    { label: 'Notes', icon: StickyNote },
    { label: 'Calendar', icon: Calendar },
    { label: 'Bookmarks', icon: BookMarked },
    { label: 'Analytics', icon: BarChart3 },
    { label: 'Settings', icon: Settings },
  ];

  return (
    <div
      className={cn(
        'pointer-events-none select-none rounded-lg border border-border/50 overflow-hidden bg-background shadow-lg',
        className
      )}
      aria-hidden
    >
      {/* Top Header */}
      <header className="h-12 border-b border-border/50 bg-muted/30 backdrop-blur flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <span className="ml-2 hidden sm:inline text-muted-foreground">FlexIO Dashboard</span>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted-foreground">
          <Search className="h-4 w-4" />
          <span>Search...</span>
        </div>
        <div className="w-6 h-6 rounded-full bg-primary/20" />
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:block w-56 border-r border-border/50 bg-muted/20">
          <div className="p-3">
            <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Main</div>
            <nav className="space-y-1">
              {navItems.map(({ label, icon: Icon, active }) => (
                <div
                  key={label}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                    active
                      ? 'bg-primary/10 text-foreground'
                      : 'hover:bg-muted/50 text-muted-foreground'
                  )}
                >
                  <Icon className={cn('h-4 w-4', active ? 'text-primary' : 'text-foreground/60')} />
                  <span>{label}</span>
                </div>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <ToolsShowcase />
        </main>
      </div>
    </div>
  );
}
