import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { LayoutDashboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { DashboardMiniCalendar } from '@/components/calendar';
import { 
  DashboardTaskCounter, 
  DashboardQuickNote, 
  DashboardRandomQuote, 
  DashboardCountdownTimer 
} from '@/components/dashboard';

// Component wrapper with hover add button
function ComponentShowcase({ children, componentName }: { children: React.ReactNode; componentName: string }) {
  const handleAddComponent = (location: 'dashboard' | 'sidebar') => {
    console.log(`Adding ${componentName} to ${location}`);
    // TODO: Implement actual functionality to add to dashboard/sidebar
  };

  return (
    <div className="group relative">
      {children}
      {/* Hover overlay with add button */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg flex items-center justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              size="lg" 
              className="h-12 w-12 rounded-full shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center">
            <DropdownMenuItem onClick={() => handleAddComponent('dashboard')}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Add to Dashboard
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleAddComponent('sidebar')}>
              <LayoutDashboard className="h-4 w-4 mr-2" />
              Add to Sidebar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
            <ComponentShowcase componentName="Mini Calendar">
              <DashboardMiniCalendar />
            </ComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <ComponentShowcase componentName="Task Counter">
              <DashboardTaskCounter />
            </ComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <ComponentShowcase componentName="Quick Note">
              <DashboardQuickNote />
            </ComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <ComponentShowcase componentName="Random Quote">
              <DashboardRandomQuote />
            </ComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <ComponentShowcase componentName="Countdown Timer">
              <DashboardCountdownTimer />
            </ComponentShowcase>
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