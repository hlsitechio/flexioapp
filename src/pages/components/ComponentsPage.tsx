import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { DashboardWidgets } from './dashboard-widgets';
import { SidebarComponents } from './sidebar-components';
import { useSettings } from '@/contexts/SettingsContext';

export function ComponentsPage() {
  const { editMode } = useSettings();
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Content Area - Horizontal Layout */}
            <div className="space-y-8">
              {/* Dashboard Widgets Section */}
              <DashboardWidgets />

              {/* Sidebar Components Section */}
              <SidebarComponents />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}