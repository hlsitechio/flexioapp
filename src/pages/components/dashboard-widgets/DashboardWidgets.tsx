import { useState } from 'react'; // Fixed ComponentShowcase reference error
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { LayoutDashboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DashboardMiniCalendar } from '@/components/calendar';
import { 
  DashboardTaskCounter, 
  DashboardQuickNote, 
  DashboardRandomQuote, 
  DashboardCountdownTimer 
} from '@/components/dashboard';

// Dashboard component wrapper with hover add button
function DashboardComponentShowcase({ children, componentName }: { children: React.ReactNode; componentName: string }) {
  const { toast } = useToast();

  const handleAddToDashboard = () => {
    toast({
      title: "Added to Dashboard",
      description: `${componentName} has been added to your dashboard.`,
    });
    console.log(`Adding ${componentName} to dashboard`);
    // TODO: Implement actual functionality to add to dashboard
  };

  return (
    <div className="group relative">
      {children}
      {/* Hover overlay with add button */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center z-10">
        <Button 
          onClick={handleAddToDashboard}
          size="lg" 
          className="h-12 w-12 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
          title={`Add ${componentName} to Dashboard`}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

// Sidebar component wrapper with hover add button
function SidebarComponentShowcase({ children, componentName }: { children: React.ReactNode; componentName: string }) {
  const { toast } = useToast();

  const handleAddToSidebar = () => {
    toast({
      title: "Added to Sidebar",
      description: `${componentName} has been added to your sidebar.`,
    });
    console.log(`Adding ${componentName} to sidebar`);
    // TODO: Implement actual functionality to add to sidebar
  };

  return (
    <div className="group relative">
      {children}
      {/* Hover overlay with add button */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center z-10">
        <Button 
          onClick={handleAddToSidebar}
          size="lg" 
          className="h-12 w-12 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
          title={`Add ${componentName} to Sidebar`}
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}

export function DashboardWidgets() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Dashboard Widgets</h2>
      </div>
      <p className="text-muted-foreground text-sm">Components designed for the main dashboard area</p>
      
      {/* Dashboard Widgets Carousel */}
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full max-w-6xl mx-auto"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Mini Calendar">
              <DashboardMiniCalendar />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Task Counter">
              <DashboardTaskCounter />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Quick Note">
              <DashboardQuickNote />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Random Quote">
              <DashboardRandomQuote />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Countdown Timer">
              <DashboardCountdownTimer />
            </DashboardComponentShowcase>
          </CarouselItem>
          
          {/* Placeholder for Future Widgets */}
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <Card className="animate-fade-in">
              <CardContent className="min-h-[200px] flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <LayoutDashboard className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">More widgets coming soon...</p>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}

// Export the sidebar showcase component for use in other files
export { SidebarComponentShowcase };