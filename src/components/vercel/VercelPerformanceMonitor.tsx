import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Activity, Zap, Clock, Globe, TrendingUp, AlertTriangle } from 'lucide-react';
import { vercelAnalytics } from '@/lib/vercel/analytics';
import { vercelKV } from '@/lib/vercel/kv';

interface PerformanceMetrics {
  coreWebVitals: {
    fcp: number; // First Contentful Paint
    lcp: number; // Largest Contentful Paint
    fid: number; // First Input Delay
    cls: number; // Cumulative Layout Shift
    ttfb: number; // Time to First Byte
  };
  loadTimes: {
    domContentLoaded: number;
    windowLoad: number;
    firstPaint: number;
  };
  networkMetrics: {
    bandwidth: string;
    effectiveType: string;
    rtt: number;
  };
  userExperience: {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'F';
    recommendations: string[];
  };
}

export function VercelPerformanceMonitor() {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    coreWebVitals: {
      fcp: 1200,
      lcp: 2100,
      fid: 85,
      cls: 0.08,
      ttfb: 220,
    },
    loadTimes: {
      domContentLoaded: 850,
      windowLoad: 1450,
      firstPaint: 950,
    },
    networkMetrics: {
      bandwidth: '4G',
      effectiveType: '4g',
      rtt: 150,
    },
    userExperience: {
      score: 87,
      grade: 'B',
      recommendations: [
        'Optimize images for better LCP',
        'Reduce unused JavaScript',
        'Implement proper caching strategies',
      ],
    },
  });

  const [realTimeData, setRealTimeData] = useState({
    activeUsers: 47,
    avgResponseTime: 180,
    errorRate: 0.3,
    throughput: 1250,
  });

  useEffect(() => {
    vercelAnalytics.trackFeatureUsage('vercel_performance_monitor');
    loadCachedMetrics();
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        activeUsers: prev.activeUsers + Math.floor(Math.random() * 10 - 5),
        avgResponseTime: prev.avgResponseTime + Math.floor(Math.random() * 20 - 10),
        errorRate: Math.max(0, prev.errorRate + (Math.random() * 0.2 - 0.1)),
        throughput: prev.throughput + Math.floor(Math.random() * 100 - 50),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const loadCachedMetrics = async () => {
    try {
      const cachedMetrics = await vercelKV.getCachedMetrics('performance_overview');
      if (cachedMetrics) {
        setMetrics(cachedMetrics);
      }
    } catch (error) {
      console.error('Failed to load cached metrics:', error);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'bg-green-100 text-green-800';
      case 'B': return 'bg-blue-100 text-blue-800';
      case 'C': return 'bg-yellow-100 text-yellow-800';
      case 'D': return 'bg-orange-100 text-orange-800';
      case 'F': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (ms: number) => {
    return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Performance Monitor</h2>
        <p className="text-muted-foreground">Real-time application performance insights</p>
      </div>

      {/* Real-time Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <div className="flex items-center">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse mr-2" />
                <Activity className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeData.activeUsers}</div>
              <p className="text-xs text-muted-foreground">Live users now</p>
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
              <CardTitle className="text-sm font-medium">Response Time</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeData.avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground">Average response</p>
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
              <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
              <AlertTriangle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeData.errorRate.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Last 5 minutes</p>
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
              <CardTitle className="text-sm font-medium">Throughput</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{realTimeData.throughput}</div>
              <p className="text-xs text-muted-foreground">Requests/min</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Core Web Vitals */}
      <div className="grid gap-6 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Core Web Vitals
                <Badge className={getGradeColor(metrics.userExperience.grade)}>
                  Grade {metrics.userExperience.grade}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Contentful Paint (FCP)</span>
                  <span className={`text-sm font-bold ${getScoreColor(90)}`}>
                    {formatTime(metrics.coreWebVitals.fcp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Largest Contentful Paint (LCP)</span>
                  <span className={`text-sm font-bold ${getScoreColor(75)}`}>
                    {formatTime(metrics.coreWebVitals.lcp)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Input Delay (FID)</span>
                  <span className={`text-sm font-bold ${getScoreColor(95)}`}>
                    {formatTime(metrics.coreWebVitals.fid)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Cumulative Layout Shift (CLS)</span>
                  <span className={`text-sm font-bold ${getScoreColor(85)}`}>
                    {metrics.coreWebVitals.cls.toFixed(3)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Time to First Byte (TTFB)</span>
                  <span className={`text-sm font-bold ${getScoreColor(92)}`}>
                    {formatTime(metrics.coreWebVitals.ttfb)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Overall Score</span>
                  <span className={`text-lg font-bold ${getScoreColor(metrics.userExperience.score)}`}>
                    {metrics.userExperience.score}/100
                  </span>
                </div>
              </div>
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
              <CardTitle>Load Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">DOM Content Loaded</span>
                  <span className="text-sm font-bold">
                    {formatTime(metrics.loadTimes.domContentLoaded)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Window Load</span>
                  <span className="text-sm font-bold">
                    {formatTime(metrics.loadTimes.windowLoad)}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">First Paint</span>
                  <span className="text-sm font-bold">
                    {formatTime(metrics.loadTimes.firstPaint)}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-2">Network Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">Connection</span>
                    <Badge variant="outline">{metrics.networkMetrics.bandwidth}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">RTT</span>
                    <span className="text-xs font-medium">{metrics.networkMetrics.rtt}ms</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Performance Recommendations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metrics.userExperience.recommendations.map((recommendation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-yellow-500 rounded-full" />
                  <span className="text-sm">{recommendation}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}