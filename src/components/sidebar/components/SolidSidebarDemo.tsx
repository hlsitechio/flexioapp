import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SolidSidebar } from "./SolidSidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SolidSidebarDemo() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <SolidSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-background border-b border-border flex items-center px-6">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-foreground">
              Solid Sidebar Demo
            </h1>
          </header>
          
          <main className="flex-1 p-6 bg-muted/20">
            <div className="max-w-4xl mx-auto space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Solid Sidebar Component</CardTitle>
                  <CardDescription>
                    A sidebar with 0% transparency - completely opaque background
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-background rounded-lg border">
                      <h3 className="font-medium mb-2">Features:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        <li>Completely opaque background (0% transparency)</li>
                        <li>Collapsible with icon mode</li>
                        <li>Active route highlighting</li>
                        <li>Responsive design</li>
                        <li>Clean navigation structure</li>
                      </ul>
                    </div>
                    
                    <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                      <h3 className="font-medium mb-2 text-primary">Styling:</h3>
                      <ul className="list-disc list-inside space-y-1 text-sm text-primary/80">
                        <li>Uses semantic color tokens</li>
                        <li>No backdrop blur or transparency effects</li>
                        <li>Solid background with proper contrast</li>
                        <li>Consistent with design system</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}