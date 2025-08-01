import { Card, CardContent } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';
import { DashboardMiniCalendar } from '@/components/calendar';
import { 
  DashboardTaskCounter, 
  DashboardQuickNote, 
  DashboardRandomQuote, 
  DashboardCountdownTimer 
} from '@/components/dashboard';

export function DashboardWidgets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Dashboard Widgets</h2>
      </div>
      <p className="text-muted-foreground text-sm">Components designed for the main dashboard area</p>
      
      {/* Dashboard Widgets Grid */}
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-4">
        <DashboardMiniCalendar />
        <DashboardTaskCounter />
        <DashboardQuickNote />
        <DashboardRandomQuote />
        <DashboardCountdownTimer />
        
        {/* Placeholder for Future Widgets */}
        <Card className="animate-fade-in">
          <CardContent className="min-h-[200px] flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <LayoutDashboard className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">More widgets coming soon...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}