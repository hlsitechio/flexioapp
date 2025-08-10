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
    id: 'workspace',
    label: 'All‑in‑one workspace: dashboards, notes, calendar, projects',
    render: () => <WorkspaceSwitcherTile />,
  },
  {
    id: 'speed',
    label: 'Lightning‑fast UI optimized for everyday teams',
    render: () => <SpeedGaugeTile />,
  },
];

export function SimpleHeroDemo({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-8', className)}>
      {ITEMS.map((item) => (
        <div key={item.id} className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground/90">{item.label}</h3>
          <div className="rounded-lg overflow-hidden border border-border/50 shadow bg-background/60">
            <div className="p-4 md:p-6">
              {item.render()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SimpleHeroDemo;
