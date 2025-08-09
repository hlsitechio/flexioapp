import { Button } from '@/components/ui/button';
import { LazyImage } from '@/components/ui/lazy-image';
import { Link } from 'react-router-dom';
import heroImg from '@/assets/hero-dashboard-hero.jpg';
import { BarChart3, Sparkles, Settings2 } from 'lucide-react';

export function UltraClearHero(): JSX.Element {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative py-16 md:py-24 bg-gradient-to-b from-background to-muted/20"
    >
      <div className="max-w-[1200px] mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div>
          <h1
            id="hero-title"
            className="text-3xl md:text-5xl font-bold tracking-tight leading-tight"
          >
            Realtime BI dashboards you can customize in minutes
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted-foreground">
            All‑in‑one analytics workspace — dashboards, calendar, notes, and projects
            in a single, fast app.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/landing/demo">Try Live Demo</Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/product/pricing">See Pricing</Link>
            </Button>
          </div>

          <ul className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4" aria-label="Key benefits">
            <li className="flex items-start gap-2">
              <BarChart3 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm">Realtime charts & KPIs</span>
            </li>
            <li className="flex items-start gap-2">
              <Settings2 className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm">Drag‑and‑drop customization</span>
            </li>
            <li className="flex items-start gap-2">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              <span className="text-sm">Works out‑of‑the‑box</span>
            </li>
          </ul>
        </div>

        <div className="relative">
          <div className="aspect-video rounded-lg overflow-hidden border border-border/50 shadow">
            <LazyImage
              src={heroImg}
              alt="FlexIO realtime dashboard preview with charts, calendar, and widgets"
              className="w-full h-full object-cover"
              width={1200}
              height={675}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default UltraClearHero;
