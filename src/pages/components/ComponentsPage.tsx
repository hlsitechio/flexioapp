import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';

export function ComponentsPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Components</h1>
                <p className="text-muted-foreground">Manage and create widgets for your sidebar and dashboard</p>
              </div>

              {/* Content Area - Ready for widgets */}
              <div className="grid gap-6">
                <div className="text-center py-12 text-muted-foreground">
                  <p>Widget components will be created here</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}