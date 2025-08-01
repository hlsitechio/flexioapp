import { DashboardTitle } from './DashboardTitle';
import { TimeDisplay } from './TimeDisplay';

interface TopNavigationProps {}

export function TopNavigation({}: TopNavigationProps) {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <DashboardTitle />
      </div>

      <div className="flex items-center space-x-6">
        <TimeDisplay />
      </div>
    </header>
  );
}