import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { NotificationSidebar } from '@/components/sidebar/notifications';
import { ImageBanner } from '@/components/banner';
import { useSettings } from '@/contexts/SettingsContext';
import { 
  AnalyticsOverview, 
  AnalyticsChart, 
  RealtimeMetrics, 
  TrafficSources, 
  GeographicInsights,
  AnalyticsGridLayout,
  AnalyticsWidgetPalette 
} from '@/components/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { BarChart3, Activity, Globe, TrendingUp, Users, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { GridSize } from '@/components/grid-layouts';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';

interface AnalyticsWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  size: 'small' | 'medium' | 'large' | 'full';
}

export function AnalyticsPage() {
  const { editMode } = useSettings();
  const { currentProfile, updateProfile } = useWorkspaceProfile();
  const initializedRef = useRef(false);

  // Helper mapping for widget hydration/serialization
  const COMPONENT_MAP: Record<string, React.ComponentType<any>> = {
    'analytics-overview': AnalyticsOverview,
    'user-growth-chart': AnalyticsChart,
    'pageviews-chart': AnalyticsChart,
    'revenue-chart': AnalyticsChart,
    'realtime-metrics': RealtimeMetrics,
    'traffic-sources': TrafficSources,
    'geographic-insights': GeographicInsights,
  };

  type StoredWidget = { id: string; typeId: string; title: string; props?: any; size: 'small'|'medium'|'large'|'full' };

  const serializeWidgets = (widgets: AnalyticsWidget[]): StoredWidget[] =>
    widgets.map(w => ({
      id: w.id,
      typeId: w.id.split('-').slice(0, -1).join('-') || w.id,
      title: w.title,
      props: w.props,
      size: w.size,
    }));

  const hydrateWidgets = (stored: StoredWidget[]): AnalyticsWidget[] =>
    stored.map(w => ({
      id: w.id,
      title: w.title,
      component: COMPONENT_MAP[w.typeId] || AnalyticsOverview,
      props: w.props,
      size: w.size,
    }));
  
  // Grid size state for each tab
  const [overviewGridSize, setOverviewGridSize] = useState<GridSize>('3x3');
  const [trafficGridSize, setTrafficGridSize] = useState<GridSize>('2x2');
  const [realtimeGridSize, setRealtimeGridSize] = useState<GridSize>('3x3');
  const [insightsGridSize, setInsightsGridSize] = useState<GridSize>('2x2');
  
  // Default widgets for each tab
  const [overviewWidgets, setOverviewWidgets] = useState<AnalyticsWidget[]>([
    {
      id: 'analytics-overview-1',
      title: 'Analytics Overview',
      component: AnalyticsOverview,
      size: 'full'
    },
    {
      id: 'user-growth-chart-1',
      title: 'User Growth',
      component: AnalyticsChart,
      props: { title: "User Growth", type: "area", dataKey: "users", color: "#3b82f6" },
      size: 'medium'
    },
    {
      id: 'traffic-sources-1',
      title: 'Traffic Sources',
      component: TrafficSources,
      size: 'medium'
    }
  ]);

  const [trafficWidgets, setTrafficWidgets] = useState<AnalyticsWidget[]>([
    {
      id: 'pageviews-chart-1',
      title: 'Page Views Trend',
      component: AnalyticsChart,
      props: { title: "Page Views Trend", type: "line", dataKey: "pageViews", color: "#10b981" },
      size: 'medium'
    },
    {
      id: 'revenue-chart-1',
      title: 'Revenue Analytics',
      component: AnalyticsChart,
      props: { title: "Revenue Analytics", type: "area", dataKey: "revenue", color: "#f59e0b" },
      size: 'medium'
    },
    {
      id: 'traffic-sources-2',
      title: 'Traffic Sources',
      component: TrafficSources,
      size: 'medium'
    },
    {
      id: 'geographic-insights-1',
      title: 'Geographic Insights',
      component: GeographicInsights,
      size: 'medium'
    }
  ]);

  const [realtimeWidgets, setRealtimeWidgets] = useState<AnalyticsWidget[]>([
    {
      id: 'realtime-metrics-1',
      title: 'Real-time Metrics',
      component: RealtimeMetrics,
      size: 'medium'
    },
    {
      id: 'live-activity-chart-1',
      title: 'Live Activity',
      component: AnalyticsChart,
      props: { title: "Live Activity", type: "line", dataKey: "users", color: "#8b5cf6" },
      size: 'medium'
    },
    {
      id: 'analytics-overview-2',
      title: 'Analytics Overview',
      component: AnalyticsOverview,
      size: 'full'
    }
  ]);

  const [insightsWidgets, setInsightsWidgets] = useState<AnalyticsWidget[]>([
    {
      id: 'geographic-insights-2',
      title: 'Geographic Insights',
      component: GeographicInsights,
      size: 'medium'
    },
    {
      id: 'realtime-metrics-2',
      title: 'Real-time Metrics',
      component: RealtimeMetrics,
      size: 'medium'
    },
    {
      id: 'user-engagement-chart-1',
      title: 'User Engagement',
      component: AnalyticsChart,
      props: { title: "User Engagement", type: "area", dataKey: "pageViews", color: "#ef4444" },
      size: 'medium'
    },
    {
      id: 'traffic-sources-3',
      title: 'Traffic Sources',
      component: TrafficSources,
      size: 'medium'
    }
  ]);

  const handleAddWidget = (widgetType: any, tabType: string) => {
    const newWidget: AnalyticsWidget = {
      id: `${widgetType.id}-${Date.now()}`,
      title: widgetType.title,
      component: widgetType.component,
      props: widgetType.defaultProps,
      size: widgetType.size
    };

    switch (tabType) {
      case 'overview':
        setOverviewWidgets([...overviewWidgets, newWidget]);
        break;
      case 'traffic':
        setTrafficWidgets([...trafficWidgets, newWidget]);
        break;
      case 'realtime':
        setRealtimeWidgets([...realtimeWidgets, newWidget]);
        break;
      case 'insights':
        setInsightsWidgets([...insightsWidgets, newWidget]);
        break;
    }
  };

  const getAllUsedWidgetIds = () => {
    const allWidgets = [...overviewWidgets, ...trafficWidgets, ...realtimeWidgets, ...insightsWidgets];
    return allWidgets.map(w => w.id.split('-').slice(0, -1).join('-'));
  };

  return (
    <div className="min-h-screen flex w-screen bg-background overflow-x-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <ImageBanner />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                    <BarChart3 className="h-8 w-8 text-primary" />
                    Analytics & Insights
                  </h1>
                  <p className="text-muted-foreground mt-2">
                    Comprehensive analytics dashboard with real-time metrics and insights
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Widget
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Add Analytics Widget</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <AnalyticsWidgetPalette 
                          onAddWidget={(widget) => handleAddWidget(widget, 'overview')}
                          usedWidgetIds={getAllUsedWidgetIds()}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </motion.div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  <span className="hidden sm:inline">Overview</span>
                </TabsTrigger>
                <TabsTrigger value="traffic" className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span className="hidden sm:inline">Traffic</span>
                </TabsTrigger>
                <TabsTrigger value="realtime" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  <span className="hidden sm:inline">Real-time</span>
                </TabsTrigger>
                <TabsTrigger value="insights" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="hidden sm:inline">Insights</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Overview Dashboard</h2>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Widget
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Add Overview Widget</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <AnalyticsWidgetPalette 
                          onAddWidget={(widget) => handleAddWidget(widget, 'overview')}
                          usedWidgetIds={getAllUsedWidgetIds()}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <AnalyticsGridLayout 
                  widgets={overviewWidgets}
                  editMode={editMode}
                  onWidgetsChange={setOverviewWidgets}
                  gridSize={overviewGridSize}
                  onGridSizeChange={setOverviewGridSize}
                />
              </TabsContent>

              <TabsContent value="traffic" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Traffic Analytics</h2>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Widget
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Add Traffic Widget</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <AnalyticsWidgetPalette 
                          onAddWidget={(widget) => handleAddWidget(widget, 'traffic')}
                          usedWidgetIds={getAllUsedWidgetIds()}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <AnalyticsGridLayout 
                  widgets={trafficWidgets}
                  editMode={editMode}
                  onWidgetsChange={setTrafficWidgets}
                  gridSize={trafficGridSize}
                  onGridSizeChange={setTrafficGridSize}
                />
              </TabsContent>

              <TabsContent value="realtime" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Real-time Monitoring</h2>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Widget
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Add Real-time Widget</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <AnalyticsWidgetPalette 
                          onAddWidget={(widget) => handleAddWidget(widget, 'realtime')}
                          usedWidgetIds={getAllUsedWidgetIds()}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <AnalyticsGridLayout 
                  widgets={realtimeWidgets}
                  editMode={editMode}
                  onWidgetsChange={setRealtimeWidgets}
                  gridSize={realtimeGridSize}
                  onGridSizeChange={setRealtimeGridSize}
                />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">User Insights</h2>
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Widget
                      </Button>
                    </SheetTrigger>
                    <SheetContent className="w-[400px]">
                      <SheetHeader>
                        <SheetTitle>Add Insights Widget</SheetTitle>
                      </SheetHeader>
                      <div className="mt-6">
                        <AnalyticsWidgetPalette 
                          onAddWidget={(widget) => handleAddWidget(widget, 'insights')}
                          usedWidgetIds={getAllUsedWidgetIds()}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
                <AnalyticsGridLayout 
                  widgets={insightsWidgets}
                  editMode={editMode}
                  onWidgetsChange={setInsightsWidgets}
                  gridSize={insightsGridSize}
                  onGridSizeChange={setInsightsGridSize}
                />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <NotificationSidebar />
    </div>
  );
}