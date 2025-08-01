import { DashboardTitle } from './DashboardTitle';
import { TimeDisplay } from './TimeDisplay';
import { EditModeToggle } from './EditModeToggle';

interface TopNavigationProps {
  editMode: boolean;
  setEditMode: (editMode: boolean) => void;
}

export function TopNavigation({ editMode, setEditMode }: TopNavigationProps) {
  return (
    <header className="h-16 bg-card/80 backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <DashboardTitle />
      </div>

      <div className="flex items-center space-x-6">
        <TimeDisplay />
        <EditModeToggle editMode={editMode} setEditMode={setEditMode} />
      </div>
    </header>
  );
}