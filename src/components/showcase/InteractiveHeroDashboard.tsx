import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { BarChart3, ChevronsLeft, ChevronsRight, Rocket, Settings2, Shield, Sparkles, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as UICalendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { TopNavigationGridLayout } from '@/components/top-navigation';
import { KanbanBoard as KanbanBoardCmp } from '@/components/kanban/KanbanBoard';
import type { KanbanColumn } from '@/types/kanban';
import { DndContext, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useMountAnimation } from '@/hooks/useMountAnimation';
interface PunchlineItem { id: string; title: string; blurb: string; cta?: { label: string; to: string }; icon: React.ComponentType<React.SVGProps<SVGSVGElement>>; }

const PUNCHLINES: PunchlineItem[] = [
  { id: 'realtime', title: 'Realtime BI dashboards — no setup pain', blurb: 'Stream KPIs and charts instantly. See changes as they happen.', cta: { label: 'Try the Live Demo', to: '/landing/demo' }, icon: Zap },
  { id: 'customize', title: 'Drag‑and‑drop customization in minutes', blurb: 'Rearrange widgets, resize charts, and tailor layouts to your team.', cta: { label: 'See Features', to: '/product/features' }, icon: Settings2 },
  { id: 'workspace', title: 'All‑in‑one workspace: dashboards, notes, calendar, projects', blurb: 'One place to focus: analytics, planning, and execution together.', cta: { label: 'Explore the Workspace', to: '/landing' }, icon: BarChart3 },
  { id: 'fast', title: 'Lighting‑fast UI optimized for everyday teams', blurb: 'Open in milliseconds, navigate with zero friction, stay in flow.', cta: { label: 'Why Speed Matters', to: '/resources/documentation' }, icon: Rocket },
  { id: 'secure', title: 'Built‑in security & privacy by default', blurb: 'Auditing, account protection, and safe defaults baked in.', cta: { label: 'Security Overview', to: '/settings/security' }, icon: Shield },
  { id: 'ai', title: 'AI‑friendly content structure for better discovery', blurb: 'Clean metadata, structured data, and optimized semantics.', cta: { label: 'Our SEO Approach', to: '/resources/help-center' }, icon: Sparkles },
];

interface InteractiveHeroDashboardProps {
  className?: string;
}

export function InteractiveHeroDashboard({ className }: InteractiveHeroDashboardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>([
    {
      id: 'todo',
      title: 'To Do',
      items: [
        { id: 'k1', title: 'Wireframes', content: 'Create initial wireframes', type: 'tool' },
        { id: 'k2', title: 'API Spec', content: 'Draft endpoints', type: 'tool' },
      ],
    },
    {
      id: 'inprogress',
      title: 'In Progress',
      items: [
        { id: 'k3', title: 'UI Polish', content: 'Refine components', type: 'tool' },
      ],
    },
    {
      id: 'done',
      title: 'Done',
      items: [
        { id: 'k4', title: 'Setup', content: 'Project scaffolding', type: 'tool' },
      ],
    },
  ]);

  const tilesDefault = ['kanban', 'calendar', 'note'] as const;
  const [tiles, setTiles] = useState<string[]>([...tilesDefault]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleTilesDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = tiles.indexOf(active.id as string);
    const newIndex = tiles.indexOf(over.id as string);
    if (oldIndex === -1 || newIndex === -1) return;
    setTiles(arrayMove(tiles, oldIndex, newIndex));
  };

  function SortableTile({ id, delay = 0, children }: { id: string; delay?: number; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      animationDelay: `${delay}ms`,
    } as React.CSSProperties;
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={cn(
          'will-change-transform transition-all duration-300 ease-out animate-enter hover-scale',
          isDragging && 'z-50 scale-[1.02] ring-2 ring-primary/40 shadow-xl'
        )}
      >
        {children}
      </div>
    );
  }
  
// Sidebar items are punchlines defined above.

  const [date, setDate] = useState<Date | undefined>(new Date());
  const [note, setNote] = useState('Draft the kickoff agenda for Monday');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const mounted = useMountAnimation(100);

  // Punchline autoplay + manual control
  const [activePunch, setActivePunch] = useState<string>(PUNCHLINES[0].id);
  const intervalRef = useRef<number | null>(null);
  const pauseRef = useRef(false);

  useEffect(() => {
    const stop = () => { if (intervalRef.current) window.clearInterval(intervalRef.current); intervalRef.current = null; };
    const start = () => {
      stop();
      intervalRef.current = window.setInterval(() => {
        if (pauseRef.current) return;
        setActivePunch((prev) => {
          const idx = PUNCHLINES.findIndex((i) => i.id === prev);
          const next = (idx + 1) % PUNCHLINES.length;
          return PUNCHLINES[next].id;
        });
      }, 3500);
    };
    start();
    return stop;
  }, []);

  const currentPunch = PUNCHLINES.find((i) => i.id === activePunch)!;

  return (
    <div
      className={cn(
        'relative rounded-lg border border-border/50 overflow-hidden bg-background shadow-2xl',
        className
      )}
    >
      {/* Top Header */}
      <header className="relative z-10 h-12 border-b border-border/50 bg-muted/30 backdrop-blur flex items-center justify-between px-3 sm:px-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle sidebar"
            onClick={() => setSidebarCollapsed((v) => !v)}
            className="ml-1 h-7 w-7"
          >
            {sidebarCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </Button>
          <span className="ml-1 hidden sm:inline text-muted-foreground">FlexIO Dashboard</span>
        </div>
        <div className="hidden md:flex items-center gap-3">
          <TopNavigationGridLayout />
        </div>
        <div className="w-6 h-6 rounded-full bg-primary/20" />
      </header>

      {/* Decorative animated glows */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-pulse" />
        <div className="absolute -bottom-16 -right-24 w-56 h-56 rounded-full bg-accent/20 blur-3xl animate-[pulse_3s_cubic-bezier(0.4,0,0.6,1)_infinite_1s]" />
      </div>

      <div className="flex relative z-10">
        {/* Sidebar */}
        <aside className={cn("hidden md:block border-r border-border/50 bg-muted/20", sidebarCollapsed ? "w-14" : "w-56")}>
          <div className="p-3">
            {!sidebarCollapsed && (<div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">Main</div>)}
            <nav className="space-y-1">
              {PUNCHLINES.map((pl) => (
                <button
                  key={pl.id}
                  className={cn(
                    'w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-sm',
                    sidebarCollapsed ? 'justify-center' : 'text-left',
                    activePunch === pl.id
                      ? 'bg-primary/10 text-foreground'
                      : 'hover:bg-muted/50 text-muted-foreground'
                  )}
                  onClick={() => {
                    pauseRef.current = true;
                    setActivePunch(pl.id);
                    window.setTimeout(() => (pauseRef.current = false), 600);
                  }}
                >
                  <pl.icon className={cn('h-4 w-4', activePunch === pl.id ? 'text-primary' : 'text-foreground/60')} />
                  {!sidebarCollapsed && <span>{pl.title}</span>}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main content */}
        <main className="relative z-10 flex-1 p-3 sm:p-4 lg:p-6">
          {/* Punchline banner */}
          <div
            className="mb-4 animate-fade-in"
            onMouseEnter={() => (pauseRef.current = true)}
            onMouseLeave={() => (pauseRef.current = false)}
          >
            <div className="rounded-lg border border-border/50 bg-card/30 p-3 md:p-4 flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <currentPunch.icon className="h-5 w-5 text-primary mt-0.5" aria-hidden="true" />
                <div>
                  <div className="text-sm md:text-base font-medium">{currentPunch.title}</div>
                  <div className="text-xs md:text-sm text-muted-foreground">{currentPunch.blurb}</div>
                </div>
              </div>
              {currentPunch.cta && (
                <Button asChild size="sm" className="story-link">
                  <Link to={currentPunch.cta.to}>{currentPunch.cta.label}</Link>
                </Button>
              )}
            </div>
          </div>

          <DndContext sensors={sensors} onDragEnd={handleTilesDragEnd}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
              <SortableContext items={tiles} strategy={rectSortingStrategy}>
                {tiles.map((tile, idx) => (
                  tile === 'kanban' ? (
                    <SortableTile id="kanban" key="kanban" delay={idx * 80}>
                      {/* Kanban (interactive) */}
                      <Card className="lg:col-span-2 border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 dark:from-primary/10 dark:via-accent/10 dark:to-secondary/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Kanban Board</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <KanbanBoardCmp
                            columns={columns}
                            onColumnsChange={setColumns}
                            className="p-1"
                          />
                        </CardContent>
                      </Card>
                    </SortableTile>
                  ) : tile === 'calendar' ? (
                    <SortableTile id="calendar" key="calendar" delay={idx * 80}>
                      {/* Calendar */}
                      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-secondary/5 via-primary/5 to-accent/5 dark:from-secondary/10 dark:via-primary/10 dark:to-accent/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Calendar</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <UICalendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </CardContent>
                      </Card>
                    </SortableTile>
                  ) : (
                    <SortableTile id="note" key="note" delay={idx * 80}>
                      {/* Quick Note */}
                      <Card className="border-0 shadow-lg hover:shadow-2xl transition-shadow ring-1 ring-border/40 hover:ring-primary/40 bg-gradient-to-br from-accent/5 via-secondary/5 to-primary/5 dark:from-accent/10 dark:via-secondary/10 dark:to-primary/10">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Quick Note</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full h-28 resize-none rounded-md border border-border/50 bg-background p-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-transparent transition-shadow"
                            placeholder="Type a quick note..."
                          />
                        </CardContent>
                      </Card>
                    </SortableTile>
                  )
                ))}
              </SortableContext>
            </div>
          </DndContext>
        </main>
      </div>
    </div>
  );
}
