import { DashboardLayout } from '@/components/layout';
import { DashboardWidgets } from './dashboard-widgets';
import { SidebarComponents } from './sidebar-components';

export function ComponentsPage() {
  return (
    <DashboardLayout 
      title="Components" 
      description="Manage and create widgets for your sidebar and dashboard"
    >
      <div className="p-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Content Area - Split vertically into two sections */}
          <div className="grid md:grid-cols-2 gap-8">
            {/* Dashboard Widgets Section */}
            <DashboardWidgets />

            {/* Sidebar Components Section */}
            <SidebarComponents />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}