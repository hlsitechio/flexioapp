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
  GeographicInsights 
} from '@/components/analytics';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, Activity, Globe, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export function AnalyticsPage() {
  const { editMode } = useSettings();

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
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-primary" />
                Analytics & Insights
              </h1>
              <p className="text-muted-foreground mt-2">
                Comprehensive analytics dashboard with real-time metrics and insights
              </p>
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
                <AnalyticsOverview />
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <AnalyticsChart 
                    title="User Growth" 
                    type="area"
                    dataKey="users" 
                    color="#3b82f6" 
                  />
                  <TrafficSources />
                </div>
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