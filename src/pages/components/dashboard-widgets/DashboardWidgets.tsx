import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
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
            <DashboardMiniCalendar />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardTaskCounter />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardQuickNote />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardRandomQuote />
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardCountdownTimer />
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