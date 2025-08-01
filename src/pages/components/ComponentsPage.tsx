import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { LayoutDashboard, PanelLeftOpen } from 'lucide-react';

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

              {/* Content Area - Split into two sections */}
              <div className="space-y-8">
                {/* Dashboard Widgets Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <LayoutDashboard className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">Dashboard Widgets</h2>
                  </div>
                  <p className="text-muted-foreground">Components designed for the main dashboard area</p>
                  
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Dashboard Components</CardTitle>
                      <CardDescription>
                        Create and manage widgets for the main dashboard grid
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[200px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <LayoutDashboard className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Dashboard widgets will be created here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Separator className="my-8" />

                {/* Sidebar Components Section */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <PanelLeftOpen className="h-6 w-6 text-primary" />
                    <h2 className="text-2xl font-semibold text-foreground">Sidebar Components</h2>
                  </div>
                  <p className="text-muted-foreground">Components designed for the sidebar area</p>
                  
                  <Card className="animate-fade-in">
                    <CardHeader>
                      <CardTitle>Sidebar Components</CardTitle>
                      <CardDescription>
                        Create and manage components for the sidebar panel
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="min-h-[200px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        <PanelLeftOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Sidebar components will be created here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}