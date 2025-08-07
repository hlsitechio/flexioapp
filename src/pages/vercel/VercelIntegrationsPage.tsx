import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { 
  Zap, 
  Database, 
  Activity, 
  CheckCircle, 
  XCircle,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { VercelAnalyticsDashboard, VercelBlobManager, VercelPerformanceMonitor } from '@/components/vercel';
import { useVercelIntegrations } from '@/hooks/useVercelIntegrations';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { TopNavigation } from '@/components/top-navigation/TopNavigation';
import { NotificationSidebar } from '@/components/sidebar/notifications/NotificationSidebar';

export function VercelIntegrationsPage() {
  const { status, metrics, loading, refreshMetrics } = useVercelIntegrations();
  const [activeTab, setActiveTab] = useState('overview');

  const integrationCards = [
    {
      id: 'analytics',
      title: 'Vercel Analytics',
      description: 'Real-time web analytics and performance insights',
      icon: Zap,
      enabled: status.analytics,
      metrics: [
        { label: 'Page Views', value: metrics.analytics.pageViews.toLocaleString() },
        { label: 'Unique Visitors', value: metrics.analytics.uniqueVisitors.toLocaleString() },
        { label: 'Bounce Rate', value: `${metrics.analytics.bounceRate}%` },
      ],
    },
    {
      id: 'blob',
      title: 'Vercel Blob Storage',
      description: 'File storage and asset management',
      icon: Database,
      enabled: status.blob,
      metrics: [
        { label: 'Total Files', value: metrics.storage.totalFiles.toString() },
        { label: 'Storage Used', value: `${(metrics.storage.totalSize / 1024 / 1024).toFixed(1)} MB` },
        { label: 'Status', value: status.blob ? 'Connected' : 'Not Available' },
      ],
    },
    {
      id: 'kv',
      title: 'Vercel KV (Redis)',
      description: 'Caching and session management',
      icon: Activity,
      enabled: status.kv,
      metrics: [
        { label: 'Response Time', value: `${metrics.performance.responseTime}ms` },
        { label: 'Error Rate', value: `${metrics.performance.errorRate}%` },
        { label: 'Throughput', value: `${metrics.performance.throughput}/min` },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNavigation />
        
        <main className="flex-1 overflow-auto">
          <div className="container max-w-7xl mx-auto p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">Vercel Integrations</h1>
                <p className="text-muted-foreground">
                  Comprehensive Vercel platform integration dashboard
                </p>
              </div>
              
              <Button
                variant="outline"
                onClick={refreshMetrics}
                disabled={loading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="storage">Storage</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid gap-6 md:grid-cols-3">
                  {integrationCards.map((integration, index) => (
                    <motion.div
                      key={integration.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <CardTitle className="text-base font-medium flex items-center gap-2">
                            <integration.icon className="h-5 w-5" />
                            {integration.title}
                          </CardTitle>
                          <Badge 
                            variant={integration.enabled ? "default" : "secondary"}
                            className="flex items-center gap-1"
                          >
                            {integration.enabled ? (
                              <CheckCircle className="h-3 w-3" />
                            ) : (
                              <XCircle className="h-3 w-3" />
                            )}
                            {integration.enabled ? 'Active' : 'Inactive'}
                          </Badge>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-muted-foreground mb-4">
                            {integration.description}
                          </p>
                          <div className="space-y-2">
                            {integration.metrics.map((metric, metricIndex) => (
                              <div key={metricIndex} className="flex justify-between text-sm">
                                <span className="text-muted-foreground">{metric.label}</span>
                                <span className="font-medium">{metric.value}</span>
                              </div>
                            ))}
                          </div>
                          
                          {integration.enabled && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-4"
                              onClick={() => setActiveTab(integration.id)}
                            >
                              View Details
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => setActiveTab('analytics')}
                        disabled={!status.analytics}
                      >
                        <Zap className="mr-2 h-4 w-4" />
                        View Analytics
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => setActiveTab('storage')}
                        disabled={!status.blob}
                      >
                        <Database className="mr-2 h-4 w-4" />
                        Manage Files
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={() => setActiveTab('performance')}
                      >
                        <Activity className="mr-2 h-4 w-4" />
                        Performance
                      </Button>
                      
                      <Button
                        variant="outline"
                        className="justify-start"
                        onClick={refreshMetrics}
                        disabled={loading}
                      >
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Refresh Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                {status.analytics ? (
                  <VercelAnalyticsDashboard />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Vercel Analytics Not Available</h3>
                        <p className="text-muted-foreground">
                          Vercel Analytics integration is not currently active.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="storage">
                {status.blob ? (
                  <VercelBlobManager />
                ) : (
                  <Card>
                    <CardContent className="pt-6">
                      <div className="text-center">
                        <XCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Vercel Blob Storage Not Available</h3>
                        <p className="text-muted-foreground">
                          Vercel Blob storage integration is not currently active.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="performance">
                <VercelPerformanceMonitor />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
      
      <NotificationSidebar />
    </div>
  );
}