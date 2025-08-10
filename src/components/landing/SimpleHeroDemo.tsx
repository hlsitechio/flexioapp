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
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground px-2 py-1">Main</div>
          <ul className="space-y-1">
            {ITEMS.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  className={cn(
                    'w-full text-left px-2.5 py-2 rounded-md text-sm transition-colors',
                    active === item.id
                      ? 'bg-primary/10 text-foreground ring-1 ring-primary/30'
                      : 'hover:bg-muted/60 text-muted-foreground'
                  )}
                  onClick={() => setActive(item.id)}
                  aria-current={active === item.id ? 'true' : undefined}
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
