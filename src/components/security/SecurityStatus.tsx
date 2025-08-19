import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertTriangle, Shield, ExternalLink } from 'lucide-react';

export function SecurityStatus() {
  const securityItems = [
    {
      category: 'Data Protection',
      status: 'fixed',
      items: [
        'RLS policies added for demo_requests table',
        'RLS policies added for leads table', 
        'RLS policies added for contact_submissions table',
        'RLS policies added for website_analytics table',
        'Enhanced newsletter_subscriptions protection',
        'Audit trail logging implemented'
      ]
    },
    {
      category: 'Authentication',
      status: 'partial',
      items: [
        'Email confirmation enabled',
        'Anonymous signups disabled',
        'OTP expiry needs manual configuration ⚠️',
        'Leaked password protection needs Pro plan ⚠️'
      ]
    },
    {
      category: 'Infrastructure',
      status: 'fixed',
      items: [
        'node-sass dependency removed',
        'Build errors resolved',
        'Security monitoring enhanced'
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'fixed': return 'text-green-600 bg-green-50';
      case 'partial': return 'text-yellow-600 bg-yellow-50';
      case 'warning': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'fixed': return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'partial': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default: return <Shield className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Shield className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-semibold">Security Status</h2>
      </div>

      <Alert>
        <CheckCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Major security fixes implemented!</strong> Your sensitive data tables are now properly protected with role-based access controls.
        </AlertDescription>
      </Alert>

      <div className="grid gap-4">
        {securityItems.map((category) => (
          <Card key={category.category}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{category.category}</CardTitle>
                <div className="flex items-center gap-2">
                  {getStatusIcon(category.status)}
                  <Badge variant="outline" className={getStatusColor(category.status)}>
                    {category.status === 'fixed' ? 'Secured' : 
                     category.status === 'partial' ? 'Needs Manual Config' : 'Action Required'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {category.items.map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm">
                    {item.includes('⚠️') ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                    ) : (
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    )}
                    <span className={item.includes('⚠️') ? 'text-yellow-700' : 'text-green-700'}>
                      {item.replace(' ⚠️', '')}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          <div className="space-y-2">
            <p><strong>Manual Configuration Required:</strong></p>
            <div className="space-y-1 text-sm">
              <p>• <strong>OTP Expiry:</strong> Reduce to 10 minutes in Auth settings</p>
              <p>• <strong>Leaked Password Protection:</strong> Enable in Auth settings (requires Pro plan)</p>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <ExternalLink className="h-3 w-3" />
              <span className="text-xs">Configure in your backend dashboard</span>
            </div>
          </div>
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Security Improvements Summary</CardTitle>
          <CardDescription>
            Comprehensive security enhancements implemented
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-green-600 mb-2">✅ Fixed</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Role-based data access</li>
                <li>• Build dependency issues</li>
                <li>• Audit trail logging</li>
                <li>• Newsletter data protection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-yellow-600 mb-2">⚠️ Manual Config</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• OTP expiry reduction</li>
                <li>• Leaked password protection</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-600 mb-2">🔒 Enhanced</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• RLS policies on all tables</li>
                <li>• Security event logging</li>
                <li>• Data access monitoring</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}