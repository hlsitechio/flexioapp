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
import { useState } from 'react';

interface AnalyticsWidget {
  id: string;
  title: string;
  component: React.ComponentType<any>;
  props?: any;
  size: 'small' | 'medium' | 'large' | 'full';
}

export function AnalyticsPage() {
  const { editMode } = useSettings();
  
  const [widgets, setWidgets] = useState<AnalyticsWidget[]>([
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

  const handleAddWidget = (widgetType: any) => {
    const newWidget: AnalyticsWidget = {
      id: `${widgetType.id}-${Date.now()}`,
      title: widgetType.title,
      component: widgetType.component,
      props: widgetType.defaultProps,
      size: widgetType.size
    };
    setWidgets([...widgets, newWidget]);
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
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
                          onAddWidget={handleAddWidget}
                          usedWidgetIds={widgets.map(w => w.id.split('-').slice(0, -1).join('-'))}
                        />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </motion.div>

            <Tabs defaultValue="dashboard" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 lg:w-[400px]">
                <TabsTrigger value="dashboard" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span className="hidden sm:inline">Dashboard</span>
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

              <TabsContent value="dashboard" className="space-y-6">
                <AnalyticsGridLayout 
                  widgets={widgets}
                  editMode={editMode}
                  onWidgetsChange={setWidgets}
                />
              </TabsContent>

              <TabsContent value="traffic" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AnalyticsChart 
                    title="Page Views Trend" 
                    type="line"
                    dataKey="pageViews" 
                    color="#10b981" 
                  />
                  <AnalyticsChart 
                    title="Revenue Analytics" 
                    type="area"
                    dataKey="revenue" 
                    color="#f59e0b" 
                  />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TrafficSources />
                  <GeographicInsights />
                </div>
              </TabsContent>

              <TabsContent value="realtime" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <RealtimeMetrics />
                  <AnalyticsChart 
                    title="Live Activity" 
                    type="line"
                    dataKey="users" 
                    color="#8b5cf6" 
                  />
                </div>
                
                <AnalyticsOverview />
              </TabsContent>

              <TabsContent value="insights" className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GeographicInsights />
                  <RealtimeMetrics />
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <AnalyticsChart 
                    title="User Engagement" 
                    type="area"
                    dataKey="pageViews" 
                    color="#ef4444" 
                  />
                  <TrafficSources />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <NotificationSidebar />
    </div>
  );
}