import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { DashboardWidgets } from './dashboard-widgets';
import { SidebarComponents } from './sidebar-components';

export function ComponentsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigation />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Components</h1>
                <p className="text-muted-foreground">Manage and create widgets for your sidebar and dashboard</p>
              </div>

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