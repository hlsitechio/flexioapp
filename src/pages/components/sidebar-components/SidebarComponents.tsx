import { Card, CardContent } from '@/components/ui/card';
import { PanelLeftOpen } from 'lucide-react';

export function SidebarComponents() {
  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <PanelLeftOpen className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Sidebar Components</h2>
      </div>
      <p className="text-muted-foreground text-sm">Components designed for the sidebar area</p>
      
      <Card className="animate-fade-in">
        <CardContent className="min-h-[300px] flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <PanelLeftOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Sidebar components will be created here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}