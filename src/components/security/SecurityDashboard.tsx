import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Shield, Lock, Eye, Download, RefreshCw, Activity, Users, FileText } from 'lucide-react';
import { AdminAuditLog } from './AdminAuditLog';
import { SecurityEventsMonitor } from './SecurityEventsMonitor';
import { AccountLockoutStatus } from './AccountLockoutStatus';

// Import security modules directly to avoid export issues
const getSecurityModules = async () => {
  const { securityMonitoring } = await import('@/lib/security/enhanced-monitoring');
  const { cspMonitor } = await import('@/lib/security/csp-monitor');
  const { gdprCompliance } = await import('@/lib/security/gdpr-compliance');
  return { securityMonitoring, cspMonitor, gdprCompliance };
};

type SecurityDashboardType = {
  score: number;
  alerts: any[];
  recentEvents: any[];
  trends: {
    violationsLast24h: number;
    alertsLast7d: number;
    securityIncidents: number;
  };
  recommendations: string[];
};

export function SecurityDashboard() {
  const [dashboard, setDashboard] = useState<SecurityDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [securityModules, setSecurityModules] = useState<any>(null);

  useEffect(() => {
    initializeModules();
  }, []);

  const initializeModules = async () => {
    try {
      const modules = await getSecurityModules();
      setSecurityModules(modules);
      loadDashboard(modules);
      
      // Set up periodic updates
      const interval = setInterval(() => loadDashboard(modules), 30000);
      
      // Listen for security events
      window.addEventListener('security-event', () => loadDashboard(modules));
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('security-event', () => loadDashboard(modules));
      };
    } catch (error) {
      console.error('Failed to initialize security modules:', error);
      setIsLoading(false);
    }
  };

  const loadDashboard = async (modules = securityModules) => {
    if (!modules) return;
    
    try {
      const dashboardData = modules.securityMonitoring.generateDashboard();
      setDashboard(dashboardData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load security dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runSecurityAudit = async () => {
    if (!securityModules) return;
    
    setIsLoading(true);
    try {
      await securityModules.cspMonitor.performSecurityAudit();
      await loadDashboard();
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    if (!securityModules) return;
    
    const report = securityModules.securityMonitoring.exportSecurityReport();
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'outline';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading && !dashboard) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading security dashboard...</span>
      </div>
    );
  }

  if (!dashboard) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-muted-foreground">Failed to load security dashboard.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Security Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => loadDashboard()}
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={runSecurityAudit}
            disabled={isLoading}
          >
            <Eye className="h-4 w-4 mr-2" />
            Run Audit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportReport}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Security Events
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Audit Log
          </TabsTrigger>
          <TabsTrigger value="lockouts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Account Lockouts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">

      {/* Security Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(dashboard.score)}`}>
              {dashboard.score}%
            </div>
            <div className="flex-1">
              <Progress value={dashboard.score} className="h-3" />
              <p className="text-sm text-muted-foreground mt-2">
                {dashboard.score >= 90 ? 'Excellent security posture' :
                 dashboard.score >= 70 ? 'Good security with room for improvement' :
                 'Security needs immediate attention'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">CSP Violations</CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.trends.violationsLast24h}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Security Alerts</CardTitle>
            <CardDescription>Last 7 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.trends.alertsLast7d}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Critical Incidents</CardTitle>
            <CardDescription>Total detected</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboard.trends.securityIncidents}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Events */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Events</CardTitle>
        </CardHeader>
        <CardContent>
          {dashboard.recentEvents.length === 0 ? (
            <p className="text-muted-foreground">No recent security events.</p>
          ) : (
            <div className="space-y-3">
              {dashboard.recentEvents.map((event: any) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(event.severity)}>
                        {event.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {event.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {event.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recommendations */}
      {dashboard.recommendations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Security Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {dashboard.recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                  <span className="text-sm">{recommendation}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
        </TabsContent>

        <TabsContent value="events">
          <SecurityEventsMonitor />
        </TabsContent>

        <TabsContent value="audit">
          <AdminAuditLog />
        </TabsContent>

        <TabsContent value="lockouts">
          <AccountLockoutStatus />
        </TabsContent>
      </Tabs>
    </div>
  );
}