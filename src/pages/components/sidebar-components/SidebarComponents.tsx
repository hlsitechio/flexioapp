import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PanelLeftOpen } from 'lucide-react';
import { SidebarCompactCalendar } from '@/components/calendar';

export function SidebarComponents() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <PanelLeftOpen className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Sidebar Components</h2>
      </div>
      <p className="text-muted-foreground text-sm">Components designed for the sidebar area</p>
      
      {/* Compact Sidebar Tools */}
      <div className="grid gap-4">
        <SidebarCompactCalendar />
        
        {/* Additional Sidebar Tools */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Additional Sidebar Tools</CardTitle>
          </CardHeader>
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <PanelLeftOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">More sidebar components will be added here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}