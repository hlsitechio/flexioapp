import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { PageTitleBar } from '@/components/ui/page-title-bar';
import { DashboardWidgets } from './dashboard-widgets';
import { SidebarComponents } from './sidebar-components';

export function ComponentsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <PageTitleBar 
            title="Components" 
            description="Manage and create widgets for your sidebar and dashboard"
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Content Area - Split vertically into two sections */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Dashboard Widgets Section */}
                <DashboardWidgets />

                {/* Sidebar Components Section */}
                <SidebarComponents />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}