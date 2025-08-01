import { DashboardTitle } from './DashboardTitle';
import { TimeDisplay } from './TimeDisplay';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu } from 'lucide-react';

interface TopNavigationProps {}

export function TopNavigation({}: TopNavigationProps) {
  return (
    <header className="h-16 bg-background backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-9 w-9 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground shadow-sm border border-sidebar-border">
          <Menu className="h-4 w-4" />
        </SidebarTrigger>
        <DashboardTitle />
      </div>

      <div className="flex items-center space-x-6">
        <TimeDisplay />
      </div>
    </header>
  );
}