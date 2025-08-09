import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Card } from '@/components/ui/card';
import { LazyImage } from '@/components/ui/lazy-image';
import analyticsImg from '@/assets/analytics-dashboard.jpg';
import calendarImg from '@/assets/calendar-interface.jpg';
import notesImg from '@/assets/notes-interface.jpg';
import projectImg from '@/assets/project-management.jpg';

interface FeatureItem {
  title: string;
  description: string;
  image: string;
  alt: string;
}

const items: FeatureItem[] = [
  {
    title: 'Realtime Analytics',
    description: 'Live charts and KPIs that update instantly',
    image: analyticsImg,
    alt: 'Realtime analytics dashboard widgets with charts and KPIs',
  },
  {
    title: 'Calendar & Scheduling',
    description: 'Plan with mini and full calendar views',
    image: calendarImg,
    alt: 'Calendar and scheduling widgets preview',
  },
  {
    title: 'Notes & Snippets',
    description: 'Capture ideas and code with ease',
    image: notesImg,
    alt: 'Notes interface and code snippets preview',
  },
  {
    title: 'Projects & Kanban',
    description: 'Organize work with boards and tasks',
    image: projectImg,
    alt: 'Project management kanban board preview',
  },
];

export function FeaturePeekCarousel(): JSX.Element {
  return (
    <section aria-labelledby="feature-peek-title" className="py-16">
      <div className="max-w-[1400px] mx-auto px-6 md:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 id="feature-peek-title" className="text-2xl md:text-3xl font-bold tracking-tight">
              Peek the features
            </h2>
            <p className="text-muted-foreground">
              Quick glance at what you can build into your workspace
            </p>
          </div>
        </div>
        <div className="relative">
          <Carousel className="w-full" opts={{ align: 'start' }}>
            <CarouselContent>
              {items.map((it, idx) => (
                <CarouselItem key={idx} className="md:basis-1/2 lg:basis-1/3">
                  <Card className="overflow-hidden border border-border/50 hover-scale">
                    <div className="aspect-video relative overflow-hidden">
                      <LazyImage
                        src={it.image}
                        alt={it.alt}
                        className="w-full h-full object-cover"
                        width={800}
                        height={450}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-background/70 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="text-sm font-semibold">{it.title}</div>
                        <div className="text-xs text-muted-foreground">{it.description}</div>
                      </div>
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>
    </section>
  );
}
