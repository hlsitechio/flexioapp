import React from 'react';
import { cn } from '@/lib/utils';
import { RealtimeKPITile, CustomizeControlsTile, WorkspaceSwitcherTile, SpeedGaugeTile, SecurityStatusTile, AIInsightsTile } from '@/components/showcase/tiles';

interface Item {
  id: string;
  label: string;
  render: () => React.ReactNode;
}

const ITEMS: Item[] = [
  {
    id: 'realtime',
    label: 'Realtime BI dashboards — no setup pain',
    render: () => <RealtimeKPITile />,
  },
  {
    id: 'customize',
    label: 'Drag‑and‑drop customization in minutes',
    render: () => <CustomizeControlsTile />,
  },
  {
    id: 'workspace',
    label: 'All‑in‑one workspace: dashboards, notes, calendar, projects',
    render: () => <WorkspaceSwitcherTile />,
  },
  {
    id: 'speed',
    label: 'Lighting‑fast UI optimized for everyday teams',
    render: () => <SpeedGaugeTile />,
  },
  {
    id: 'security',
    label: 'Built‑in security & privacy by default',
    render: () => <SecurityStatusTile />,
  },
  {
    id: 'ai',
    label: 'AI‑friendly content structure for better discovery',
    render: () => <AIInsightsTile />,
  },
];

export function SimpleHeroDemo({ className }: { className?: string }) {
  const [active, setActive] = React.useState<string>('realtime');
  const Current = React.useMemo(() => ITEMS.find((i) => i.id === active)?.render ?? (() => null), [active]);

  return (
    <div className={cn('grid grid-cols-1 md:grid-cols-[260px,1fr] h-full', className)}>
      <aside className="border-r border-border/50 bg-background/60">
        <nav aria-label="Hero feature list" className="p-2 md:p-3">
          <div className="text-[11px] uppercase tracking-wider text-foreground/70 px-2 py-1 font-medium">Main</div>
          <ul className="space-y-1">
            {ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={cn(
                    'w-full text-left px-3 py-2.5 rounded-md text-[15px] md:text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-0',
                    active === item.id
                      ? 'bg-primary/15 text-foreground ring-1 ring-primary/40'
                      : 'text-foreground/80 hover:text-foreground hover:bg-muted/70'
                  )}
                  onClick={() => setActive(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
                  aria-selected={active === item.id}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <section className="p-3 md:p-4">
        <div className="aspect-video rounded-lg overflow-hidden border border-border/50 shadow bg-background/60">
          <div className="h-full p-3 md:p-4">
            <Current />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SimpleHeroDemo;
