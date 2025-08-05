import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { WorkspaceProfileManager } from '@/components/workspace/WorkspaceProfileManager';
import { useSettings } from '@/contexts/SettingsContext';

export function WorkspaceProfilesPage() {
  const { editMode } = useSettings();
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Workspace Profiles</h1>
              <p className="text-muted-foreground">
                Manage your dashboard configurations and switch between different workspace profiles.
              </p>
            </div>
            
            <WorkspaceProfileManager />
          </div>
        </main>
      </div>
    </div>
  );
}