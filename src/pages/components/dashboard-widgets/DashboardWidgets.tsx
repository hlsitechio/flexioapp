import { useState, useEffect, useRef } from 'react'; // Fixed ComponentShowcase reference error
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { LayoutDashboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '@/contexts/SettingsContext';
import { Calendar } from '@/components/calendar';
import { 
  DashboardTaskCounter, 
  DashboardQuickNote, 
  DashboardRandomQuote, 
  DashboardCountdownTimer,
  DashboardPromptsGallery,
  DashboardCodeBlock,
  ImageGallery
} from '@/components/dashboard';

// Dashboard component wrapper with hover add button
function DashboardComponentShowcase({ 
  children, 
  componentName, 
  targetSlot, 
  gridSize 
}: { 
  children: React.ReactNode; 
  componentName: string; 
  targetSlot?: string | null; 
  gridSize?: string | null; 
}) {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addComponentToSlot } = useSettings();

  const handleAddToDashboard = () => {
    if (targetSlot) {
      // Add component to the specific slot using SettingsContext
      addComponentToSlot(parseInt(targetSlot), componentName, gridSize || '4x4');
      
      toast({
        title: "Component Added",
        description: `${componentName} has been added to Slot ${parseInt(targetSlot) + 1}.`,
      });
      console.log(`Adding ${componentName} to slot ${targetSlot} in ${gridSize} grid`);
      // Navigate back to dashboard
      navigate('/');
    } else {
      toast({
        title: "Added to Dashboard",
        description: `${componentName} has been added to your dashboard.`,
      });
      console.log(`Adding ${componentName} to dashboard`);
    }
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
          title={targetSlot ? `Add ${componentName} to Slot ${parseInt(targetSlot) + 1}` : `Add ${componentName} to Dashboard`}
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

export function DashboardWidgets({ targetSlot, gridSize }: { targetSlot?: string | null; gridSize?: string | null }) {
  const [api, setApi] = useState<CarouselApi>();
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      
      if (!api) return;

      // Scroll to next/previous based on wheel direction
      if (e.deltaY > 0) {
        api.scrollNext();
      } else {
        api.scrollPrev();
      }
    };

    const carousel = carouselRef.current;
    if (carousel && api) {
      carousel.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        carousel.removeEventListener('wheel', handleWheel);
      };
    }
  }, [api]);

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <LayoutDashboard className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">
          {targetSlot ? `Select Component for Slot ${parseInt(targetSlot) + 1}` : 'Dashboard Widgets'}
        </h2>
      </div>
      <p className="text-muted-foreground text-sm">
        {targetSlot 
          ? `Choose a component to add to Slot ${parseInt(targetSlot) + 1} in your ${gridSize} dashboard grid`
          : 'Components designed for the main dashboard area'
        }
      </p>
      
      {/* Dashboard Widgets Carousel */}
      <div ref={carouselRef}>
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full max-w-6xl mx-auto"
          setApi={setApi}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Calendar" targetSlot={targetSlot} gridSize={gridSize}>
              <Calendar />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Task Counter" targetSlot={targetSlot} gridSize={gridSize}>
              <DashboardTaskCounter />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Quick Note" targetSlot={targetSlot} gridSize={gridSize}>
              <DashboardQuickNote />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Random Quote" targetSlot={targetSlot} gridSize={gridSize}>
              <DashboardRandomQuote />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Countdown Timer" targetSlot={targetSlot} gridSize={gridSize}>
              <DashboardCountdownTimer />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Image Gallery" targetSlot={targetSlot} gridSize={gridSize}>
              <ImageGallery />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Prompts Gallery" targetSlot={targetSlot} gridSize={gridSize}>
              <DashboardPromptsGallery />
            </DashboardComponentShowcase>
          </CarouselItem>
          <CarouselItem className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
            <DashboardComponentShowcase componentName="Code Snippets" targetSlot={targetSlot} gridSize={gridSize}>
              <DashboardCodeBlock />
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
    </div>
  );
}

// Export the sidebar showcase component for use in other files
export { SidebarComponentShowcase };