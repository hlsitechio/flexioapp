import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Shield, Lock, Eye, Download, RefreshCw } from 'lucide-react';
import { securityMonitoring, cspMonitor, gdprCompliance, type SecurityDashboard as SecurityDashboardType } from '@/lib/security';

export function SecurityDashboard() {
  const [dashboard, setDashboard] = useState<SecurityDashboardType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  useEffect(() => {
    loadDashboard();
    
    // Set up periodic updates
    const interval = setInterval(loadDashboard, 30000); // Update every 30 seconds
    
    // Listen for security events
    window.addEventListener('security-event', loadDashboard);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('security-event', loadDashboard);
    };
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboardData = securityMonitoring.generateDashboard();
      setDashboard(dashboardData);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('Failed to load security dashboard:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const runSecurityAudit = async () => {
    setIsLoading(true);
    try {
      await cspMonitor.performSecurityAudit();
      await loadDashboard();
    } catch (error) {
      console.error('Security audit failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportReport = () => {
    const report = securityMonitoring.exportSecurityReport();
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
            onClick={loadDashboard}
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

      {/* Alerts */}
      {dashboard.alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Active Alerts ({dashboard.alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {dashboard.alerts.slice(0, 5).map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant={getSeverityColor(alert.type)}>
                        {alert.type.replace('_', ' ').toUpperCase()}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {alert.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                    <p className="mt-1 text-sm">{alert.message}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => securityMonitoring.acknowledgeAlert(alert.id)}
                  >
                    Acknowledge
                  </Button>
                </div>
              ))}
              {dashboard.alerts.length > 5 && (
                <p className="text-sm text-muted-foreground">
                  And {dashboard.alerts.length - 5} more alerts...
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

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
              {dashboard.recentEvents.map((event) => (
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

      {/* GDPR Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            GDPR Compliance Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {(() => {
              const consent = gdprCompliance.getConsent();
              const report = gdprCompliance.generatePrivacyReport();
              
              return (
                <>
                  <div className="flex items-center justify-between">
                    <span>Consent Status</span>
                    <Badge variant={consent ? 'default' : 'destructive'}>
                      {consent ? 'Valid' : 'Missing'}
                    </Badge>
                  </div>
                  
                  {consent && (
                    <>
                      <div className="flex items-center justify-between">
                        <span>Consent Date</span>
                        <span className="text-sm text-muted-foreground">
                          {consent.timestamp.toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Analytics Consent</span>
                        <Badge variant={consent.analytics ? 'default' : 'secondary'}>
                          {consent.analytics ? 'Granted' : 'Denied'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span>Marketing Consent</span>
                        <Badge variant={consent.marketing ? 'default' : 'secondary'}>
                          {consent.marketing ? 'Granted' : 'Denied'}
                        </Badge>
                      </div>
                    </>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span>Data Processing Records</span>
                    <span className="text-sm text-muted-foreground">
                      {report.processingRecords.length} records
                    </span>
                  </div>
                </>
              );
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}