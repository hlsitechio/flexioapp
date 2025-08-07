import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, Users, Globe, Download, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';
import { vercelAnalytics } from '@/lib/vercel/analytics';
import { vercelBlob } from '@/lib/vercel/blob';
import { toast } from 'sonner';

interface AnalyticsData {
  pageViews: number;
  uniqueVisitors: number;
  bounceRate: number;
  avgSessionDuration: string;
  topPages: Array<{ path: string; views: number; change: number }>;
  topCountries: Array<{ country: string; visitors: number; percentage: number }>;
  realtimeVisitors: number;
}

export function VercelAnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    pageViews: 12543,
    uniqueVisitors: 8921,
    bounceRate: 32.4,
    avgSessionDuration: '3m 24s',
    topPages: [
      { path: '/', views: 4521, change: 12.3 },
      { path: '/dashboard', views: 3102, change: -5.2 },
      { path: '/analytics', views: 1876, change: 28.1 },
      { path: '/settings', views: 1544, change: 8.7 },
    ],
    topCountries: [
      { country: 'United States', visitors: 3245, percentage: 36.4 },
      { country: 'United Kingdom', visitors: 1876, percentage: 21.0 },
      { country: 'Germany', visitors: 1234, percentage: 13.8 },
      { country: 'Canada', visitors: 987, percentage: 11.1 },
    ],
    realtimeVisitors: 47,
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    vercelAnalytics.trackFeatureUsage('vercel_analytics_dashboard');
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    vercelAnalytics.trackUserAction('refresh', 'analytics_dashboard');
    
    // Simulate data refresh
    setTimeout(() => {
      setIsLoading(false);
      toast.success('Analytics data refreshed');
    }, 1000);
  };

  const handleExport = async () => {
    try {
      vercelAnalytics.trackUserAction('export', 'analytics_dashboard');
      
      const exportData = {
        timestamp: new Date().toISOString(),
        analytics: data,
      };

      const blob = await vercelBlob.generateExport(exportData, 'analytics-report', 'json');
      
      // Create download link
      const link = document.createElement('a');
      link.href = blob.url;
      link.download = `analytics-report-${new Date().toISOString().split('T')[0]}.json`;
      link.click();

      toast.success('Analytics report exported successfully');
    } catch (error) {
      toast.error('Failed to export analytics report');
      vercelAnalytics.trackError(error as Error, { action: 'export_analytics' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Vercel Analytics</h2>
          <p className="text-muted-foreground">Real-time insights into your application performance</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.pageViews.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +12.3%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.uniqueVisitors.toLocaleString()}</div>
              <Badge variant="secondary" className="mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +8.7%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Bounce Rate</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.bounceRate}%</div>
              <Badge variant="secondary" className="mt-1">
                -2.1%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Session</CardTitle>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <span className="text-xs font-medium">{data.realtimeVisitors} live</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{data.avgSessionDuration}</div>
              <Badge variant="secondary" className="mt-1">
                <TrendingUp className="mr-1 h-3 w-3" />
                +15.2%
              </Badge>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Top Pages and Countries */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.topPages.map((page, index) => (
                <div key={page.path} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">{index + 1}</div>
                    <div>
                      <div className="text-sm font-medium">{page.path}</div>
                      <div className="text-xs text-muted-foreground">
                        {page.views.toLocaleString()} views
                      </div>
                    </div>
                  </div>
                  <Badge 
                    variant={page.change > 0 ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {page.change > 0 ? '+' : ''}{page.change}%
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.topCountries.map((country, index) => (
                <div key={country.country} className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-medium">{index + 1}</div>
                    <div>
                      <div className="text-sm font-medium">{country.country}</div>
                      <div className="text-xs text-muted-foreground">
                        {country.visitors.toLocaleString()} visitors
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{country.percentage}%</div>
                    <div className="w-16 bg-secondary rounded-full h-1 mt-1">
                      <div 
                        className="bg-primary h-1 rounded-full transition-all duration-500"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}