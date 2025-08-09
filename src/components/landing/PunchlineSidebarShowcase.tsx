import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { BarChart3, Rocket, Sparkles, Settings2, Zap, Shield } from 'lucide-react';

interface PunchlineItem {
  id: string;
  title: string;
  blurb: string;
  cta?: { label: string; to: string };
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const PUNCHLINES: PunchlineItem[] = [
  {
    id: 'realtime',
    title: 'Realtime BI dashboards — no setup pain',
    blurb: 'Stream KPIs and charts instantly. See changes as they happen.',
    cta: { label: 'Try the Live Demo', to: '/landing/demo' },
    icon: Zap,
  },
  {
    id: 'customize',
    title: 'Drag‑and‑drop customization in minutes',
    blurb: 'Rearrange widgets, resize charts, and tailor layouts to your team.',
    cta: { label: 'See Features', to: '/product/features' },
    icon: Settings2,
  },
  {
    id: 'workspace',
    title: 'All‑in‑one workspace: dashboards, notes, calendar, projects',
    blurb: 'One place to focus: analytics, planning, and execution together.',
    cta: { label: 'Explore the Workspace', to: '/landing' },
    icon: BarChart3,
  },
  {
    id: 'fast',
    title: 'Lighting‑fast UI optimized for everyday teams',
    blurb: 'Open in milliseconds, navigate with zero friction, stay in flow.',
    cta: { label: 'Why Speed Matters', to: '/resources/documentation' },
    icon: Rocket,
  },
  {
    id: 'secure',
    title: 'Built‑in security & privacy by default',
    blurb: 'Auditing, account protection, and safe defaults baked in.',
    cta: { label: 'Security Overview', to: '/settings/security' },
    icon: Shield,
  },
  {
    id: 'ai',
    title: 'AI‑friendly content structure for better discovery',
    blurb: 'Clean metadata, structured data, and optimized semantics.',
    cta: { label: 'Our SEO Approach', to: '/resources/help-center' },
    icon: Sparkles,
  },
];

function ContentPanel({ item }: { item: PunchlineItem }) {
  const Icon = item.icon;
  return (
    <article
      key={item.id}
      className="animate-fade-in rounded-xl border border-border/50 p-6 md:p-8 bg-card/30 backdrop-blur supports-[backdrop-filter]:bg-card/40"
      aria-live="polite"
    >
      <header className="flex items-start gap-3">
        <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
        <h3 className="text-xl md:text-2xl font-semibold tracking-tight">{item.title}</h3>
      </header>
      <p className="mt-3 text-muted-foreground max-w-prose">{item.blurb}</p>
      {item.cta && (
        <div className="mt-5">
          <Button asChild size="sm" className="story-link">
            <Link to={item.cta.to}>{item.cta.label}</Link>
          </Button>
        </div>
      )}
    </article>
  );
}

export default function PunchlineSidebarShowcase(): JSX.Element {
  const items = useMemo(() => PUNCHLINES, []);
  const [active, setActive] = useState<string>(items[0].id);
  const intervalRef = useRef<number | null>(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    const stop = () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
    const start = () => {
      stop();
      intervalRef.current = window.setInterval(() => {
        if (pauseRef.current) return;
        setActive((prev) => {
          const idx = items.findIndex((i) => i.id === prev);
          const next = (idx + 1) % items.length;
          return items[next].id;
        });
      }, 3500);
    };
    start();
    return stop;
  }, [items]);

  const current = items.find((i) => i.id === active)!;

  return (
    <section aria-labelledby="punchline-title" className="py-12 md:py-16">
      <div className="max-w-[1200px] mx-auto px-6 md:px-8">
        <SidebarProvider>
          <div className="flex items-center justify-between mb-4">
            <h2 id="punchline-title" className="text-2xl md:text-3xl font-bold tracking-tight">
              What you get — at a glance
            </h2>
            <SidebarTrigger className="hidden md:flex" />
          </div>

          <div className="flex w-full min-h-[280px]">
            <Sidebar variant="inset" collapsible="icon">
              <SidebarContent>
                <SidebarGroup>
                  <SidebarGroupLabel>Highlights</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {items.map((pl) => (
                        <SidebarMenuItem key={pl.id}>
                          <SidebarMenuButton
                            className="hover-scale"
                            isActive={active === pl.id}
                            onClick={() => {
                              pauseRef.current = true;
                              setActive(pl.id);
                              window.setTimeout(() => (pauseRef.current = false), 500);
                            }}
                          >
                            <pl.icon className="mr-2 h-4 w-4" aria-hidden="true" />
                            <span>{pl.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </SidebarContent>
            </Sidebar>

            <SidebarInset
              onMouseEnter={() => (pauseRef.current = true)}
              onMouseLeave={() => (pauseRef.current = false)}
              className="!min-h-[280px] md:!min-h-[320px]"
            >
              <ContentPanel item={current} />
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </section>
  );
}
