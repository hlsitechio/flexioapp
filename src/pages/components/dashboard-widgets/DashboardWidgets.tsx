import { useState, useEffect, useRef } from 'react'; // Fixed ComponentShowcase reference error
import { Card, CardContent } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from '@/components/ui/carousel';
import { LayoutDashboard, Plus, Clock, Calculator, CalendarDays, NotebookPen, MessageSquareQuote, Timer, Target, Image, Sparkles, Code, Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  DashboardHabitTracker,
  DashboardQuickCalculator,
  DashboardBookmarkManager,
  DashboardDateDisplay,
  ImageGallery
} from '@/components/dashboard';

// Component categories
const componentCategories = [
  {
    id: 'all',
    name: 'All Components',
    icon: LayoutDashboard,
    count: 12
  },
  {
    id: 'productivity',
    name: 'Productivity',
    icon: Target,
    count: 6,
    components: ['Task Counter', 'Quick Note', 'Habit Tracker', 'Bookmark Manager', 'Quick Calculator', 'Countdown Timer']
  },
  {
    id: 'time',
    name: 'Time & Calendar',
    icon: CalendarDays,
    count: 2,
    components: ['Calendar', 'Date Display']
  },
  {
    id: 'content',
    name: 'Content & Media',
    icon: Image,
    count: 3,
    components: ['Image Gallery', 'Random Quote', 'Code Snippets']
  },
  {
    id: 'creative',
    name: 'Creative & Fun',
    icon: Sparkles,
    count: 1,
    components: ['Prompts Gallery']
  }
];

// All available components with their metadata
const allComponents = [
  { name: 'Calendar', category: 'time', icon: CalendarDays },
  { name: 'Task Counter', category: 'productivity', icon: Target },
  { name: 'Quick Note', category: 'productivity', icon: NotebookPen },
  { name: 'Random Quote', category: 'content', icon: MessageSquareQuote },
  { name: 'Countdown Timer', category: 'productivity', icon: Timer },
  { name: 'Image Gallery', category: 'content', icon: Image },
  { name: 'Prompts Gallery', category: 'creative', icon: Sparkles },
  { name: 'Code Snippets', category: 'content', icon: Code },
  { name: 'Habit Tracker', category: 'productivity', icon: Target },
  { name: 'Quick Calculator', category: 'productivity', icon: Calculator },
  { name: 'Bookmark Manager', category: 'productivity', icon: Bookmark },
  { name: 'Date Display', category: 'time', icon: Clock }
];

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
        duration: 3000, // Auto-dismiss after 3 seconds
      });
      console.log(`Adding ${componentName} to slot ${targetSlot} in ${gridSize} grid`);
      // Navigate back to dashboard
      navigate('/');
    } else {
      toast({
        title: "Added to Dashboard",
        description: `${componentName} has been added to your dashboard.`,
        duration: 3000, // Auto-dismiss after 3 seconds
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
  const [selectedCategory, setSelectedCategory] = useState('all');
  const carouselRef = useRef<HTMLDivElement>(null);

  // Filter components based on selected category
  const filteredComponents = selectedCategory === 'all' 
    ? allComponents 
    : allComponents.filter(component => component.category === selectedCategory);

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
      
      {/* Component Categories Menu */}
      <div className="bg-card border border-border rounded-lg p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">Component Categories</h3>
        <div className="flex flex-wrap gap-2">
          {componentCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={`h-9 px-3 text-xs font-medium transition-all duration-200 ${
                  selectedCategory === category.id 
                    ? 'bg-primary text-primary-foreground shadow-md' 
                    : 'bg-background hover:bg-muted border-border'
                }`}
              >
                <IconComponent className="h-3.5 w-3.5 mr-1.5" />
                {category.name}
                <Badge 
                  variant="secondary" 
                  className={`ml-2 h-5 px-1.5 text-xs ${
                    selectedCategory === category.id 
                      ? 'bg-primary-foreground/20 text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {category.count}
                </Badge>
              </Button>
            );
          })}
        </div>
      </div>
      
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
            {filteredComponents.map((component) => (
              <CarouselItem key={component.name} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <DashboardComponentShowcase componentName={component.name} targetSlot={targetSlot} gridSize={gridSize}>
                  {component.name === 'Calendar' && <Calendar />}
                  {component.name === 'Task Counter' && <DashboardTaskCounter />}
                  {component.name === 'Quick Note' && <DashboardQuickNote />}
                  {component.name === 'Random Quote' && <DashboardRandomQuote />}
                  {component.name === 'Countdown Timer' && <DashboardCountdownTimer />}
                  {component.name === 'Image Gallery' && <ImageGallery />}
                  {component.name === 'Prompts Gallery' && <DashboardPromptsGallery />}
                  {component.name === 'Code Snippets' && <DashboardCodeBlock />}
                  {component.name === 'Habit Tracker' && <DashboardHabitTracker />}
                  {component.name === 'Quick Calculator' && <DashboardQuickCalculator />}
                  {component.name === 'Bookmark Manager' && <DashboardBookmarkManager />}
                  {component.name === 'Date Display' && <DashboardDateDisplay />}
                </DashboardComponentShowcase>
              </CarouselItem>
            ))}
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