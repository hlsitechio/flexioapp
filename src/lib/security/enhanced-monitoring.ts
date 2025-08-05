import { cspMonitor } from './csp-monitor';
import { gdprCompliance } from './gdpr-compliance';
import { config, featureFlags } from '@/config';

export interface SecurityEvent {
  id: string;
  type: 'csp_violation' | 'xss_attempt' | 'data_breach' | 'unauthorized_access' | 'privacy_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  description: string;
  metadata: Record<string, any>;
  userAgent: string;
  ip?: string;
  userId?: string;
}

export interface SecurityAlert {
  id: string;
  eventId: string;
  type: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface SecurityDashboard {
  score: number;
  alerts: SecurityAlert[];
  recentEvents: SecurityEvent[];
  trends: {
    violationsLast24h: number;
    alertsLast7d: number;
    securityIncidents: number;
  };
  recommendations: string[];
}

class EnhancedSecurityMonitoring {
  private events: SecurityEvent[] = [];
  private alerts: SecurityAlert[] = [];
  private monitoring = false;
  private reportingEndpoint?: string;

  constructor() {
    this.initialize();
  }

  private initialize() {
    if (typeof window === 'undefined') return;

    this.setupSecurityObservers();
    this.setupThreatDetection();
    this.setupRealTimeMonitoring();
    this.exposeDevToolsInterface();
    
    console.log('%c🔍 Enhanced Security Monitoring Active', 'color: #dc2626; font-weight: bold;');
  }

  private setupSecurityObservers() {
    // CSP Violation Observer
    document.addEventListener('securitypolicyviolation', (event) => {
      this.recordEvent({
        type: 'csp_violation',
        severity: 'medium',
        description: `CSP violation: ${event.violatedDirective}`,
        metadata: {
          blockedURI: event.blockedURI,
          documentURI: event.documentURI,
          effectiveDirective: event.effectiveDirective,
          originalPolicy: event.originalPolicy
        }
      });
    });

    // Network Security Observer
    if ('serviceWorker' in navigator) {
      this.setupServiceWorkerMonitoring();
    }

    // Performance Security Observer
    this.setupPerformanceMonitoring();
  }

  private setupThreatDetection() {
    // XSS Detection
    this.setupXSSDetection();
    
    // Clickjacking Detection
    this.setupClickjackingDetection();
    
    // Data Exfiltration Detection
    this.setupDataExfiltrationDetection();
    
    // Suspicious Activity Detection
    this.setupSuspiciousActivityDetection();
  }

  private setupXSSDetection() {
    // Monitor for potential XSS attempts
    const originalWrite = document.write;
    document.write = function(content: string) {
      if (content.includes('<script') || content.includes('javascript:') || content.includes('onerror=')) {
        securityMonitoring.recordEvent({
          type: 'xss_attempt',
          severity: 'high',
          description: 'Potential XSS attempt detected in document.write',
          metadata: { content: content.substring(0, 200) }
        });
      }
      return originalWrite.call(this, content);
    };

    // Monitor DOM mutations for suspicious content
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as Element;
              const innerHTML = element.innerHTML;
              
              if (innerHTML && (innerHTML.includes('<script') || innerHTML.includes('javascript:'))) {
                this.recordEvent({
                  type: 'xss_attempt',
                  severity: 'high',
                  description: 'Suspicious script injection detected',
                  metadata: { 
                    tagName: element.tagName,
                    content: innerHTML.substring(0, 200)
                  }
                });
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private setupClickjackingDetection() {
    // Detect if page is loaded in iframe
    if (window.self !== window.top) {
      this.recordEvent({
        type: 'unauthorized_access',
        severity: 'medium',
        description: 'Page loaded in iframe - potential clickjacking attempt',
        metadata: {
          parentOrigin: document.referrer,
          frameLocation: window.location.href
        }
      });
    }
  }

  private setupDataExfiltrationDetection() {
    // Monitor large data transfers
    const originalFetch = window.fetch;
    window.fetch = async function(input: RequestInfo | URL, init?: RequestInit) {
      const url = typeof input === 'string' ? input : input.toString();
      
      // Check for suspicious data transfer patterns
      if (init?.body && typeof init.body === 'string' && init.body.length > 10000) {
        securityMonitoring.recordEvent({
          type: 'data_breach',
          severity: 'high',
          description: 'Large data transfer detected',
          metadata: {
            url,
            bodySize: init.body.length,
            method: init.method || 'GET'
          }
        });
      }
      
      return originalFetch.call(this, input, init);
    };
  }

  private setupSuspiciousActivityDetection() {
    let rapidRequestCount = 0;
    const requestWindow = 1000; // 1 second
    
    // Monitor for rapid API requests
    setInterval(() => {
      if (rapidRequestCount > 50) { // More than 50 requests per second
        this.recordEvent({
          type: 'unauthorized_access',
          severity: 'high',
          description: 'Abnormally high request rate detected',
          metadata: { requestCount: rapidRequestCount }
        });
      }
      rapidRequestCount = 0;
    }, requestWindow);

    // Increment counter on requests
    const incrementCounter = () => rapidRequestCount++;
    window.addEventListener('beforeunload', incrementCounter);
  }

  private setupServiceWorkerMonitoring() {
    navigator.serviceWorker.ready.then((registration) => {
      registration.addEventListener('message', (event) => {
        if (event.data?.type === 'SECURITY_EVENT') {
          this.recordEvent(event.data.event);
        }
      });
    });
  }

  private setupPerformanceMonitoring() {
    // Monitor for performance-based security issues
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Detect unusually slow responses that might indicate attacks
          if (entry.duration > 5000) { // 5 seconds
            this.recordEvent({
              type: 'unauthorized_access',
              severity: 'medium',
              description: 'Unusually slow response detected',
              metadata: {
                entryName: entry.name,
                duration: entry.duration,
                entryType: entry.entryType
              }
            });
          }
        });
      });
      
      observer.observe({ entryTypes: ['navigation', 'resource'] });
    }
  }

  private setupRealTimeMonitoring() {
    // Real-time threat intelligence
    this.monitoring = true;
    this.monitorSecurityFeeds();
  }

  private async monitorSecurityFeeds() {
    if (!this.monitoring) return;

    try {
      // In a real implementation, this would connect to threat intelligence feeds
      // For now, we'll simulate with periodic checks
      setTimeout(() => {
        this.checkForKnownThreats();
        this.monitorSecurityFeeds();
      }, 30000); // Check every 30 seconds
    } catch (error) {
      console.error('Security feed monitoring error:', error);
    }
  }

  private checkForKnownThreats() {
    // Check current page against known threat patterns
    const currentUrl = window.location.href;
    const suspiciousPatterns = [
      /eval\(/,
      /document\.write\(/,
      /innerHTML\s*=.*<script/,
      /javascript:/
    ];

    const pageContent = document.documentElement.outerHTML;
    
    suspiciousPatterns.forEach((pattern, index) => {
      if (pattern.test(pageContent)) {
        this.recordEvent({
          type: 'xss_attempt',
          severity: 'high',
          description: `Known threat pattern detected: Pattern ${index + 1}`,
          metadata: { pattern: pattern.toString(), url: currentUrl }
        });
      }
    });
  }

  private exposeDevToolsInterface() {
    if (config.features.enableDebugTools) {
      (window as any).__SECURITY_MONITORING__ = {
        getEvents: () => this.events,
        getAlerts: () => this.alerts,
        getDashboard: () => this.generateDashboard(),
        acknowledgeAlert: (id: string) => this.acknowledgeAlert(id),
        exportReport: () => this.exportSecurityReport(),
        startMonitoring: () => this.startMonitoring(),
        stopMonitoring: () => this.stopMonitoring()
      };
    }
  }

  public recordEvent(eventData: Omit<SecurityEvent, 'id' | 'timestamp' | 'userAgent'>) {
    const event: SecurityEvent = {
      id: crypto.randomUUID(),
      timestamp: new Date(),
      userAgent: navigator.userAgent,
      ...eventData
    };

    this.events.push(event);
    
    // Create alert for high/critical severity events
    if (event.severity === 'high' || event.severity === 'critical') {
      this.createAlert(event);
    }

    // Log to console in development
    if (config.features.enableDebugTools) {
      console.warn(`🚨 Security Event [${event.severity.toUpperCase()}]:`, event);
    }

    // Report to monitoring service
    if (this.reportingEndpoint) {
      this.reportEvent(event);
    }

    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('security-event', { detail: event }));
  }

  private createAlert(event: SecurityEvent) {
    const alert: SecurityAlert = {
      id: crypto.randomUUID(),
      eventId: event.id,
      type: event.type,
      message: `${event.type.replace('_', ' ').toUpperCase()}: ${event.description}`,
      timestamp: new Date(),
      acknowledged: false
    };

    this.alerts.push(alert);
    
    // Show browser notification for critical events
    if (event.severity === 'critical' && 'Notification' in window) {
      this.showNotification(alert);
    }
  }

  private async showNotification(alert: SecurityAlert) {
    if (Notification.permission === 'granted') {
      new Notification('Security Alert', {
        body: alert.message,
        icon: '/favicon.ico',
        tag: 'security-alert'
      });
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        this.showNotification(alert);
      }
    }
  }

  private async reportEvent(event: SecurityEvent) {
    if (!this.reportingEndpoint) return;

    try {
      await fetch(this.reportingEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event)
      });
    } catch (error) {
      console.error('Failed to report security event:', error);
    }
  }

  public acknowledgeAlert(alertId: string) {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.acknowledged = true;
      alert.resolvedAt = new Date();
    }
  }

  public generateDashboard(): SecurityDashboard {
    const now = Date.now();
    const last24h = now - (24 * 60 * 60 * 1000);
    const last7d = now - (7 * 24 * 60 * 60 * 1000);

    const recentEvents = this.events.filter(e => e.timestamp.getTime() > last24h);
    const recentAlerts = this.alerts.filter(a => a.timestamp.getTime() > last7d);
    const criticalEvents = this.events.filter(e => e.severity === 'critical' || e.severity === 'high');

    // Calculate security score
    const score = this.calculateSecurityScore();

    return {
      score,
      alerts: this.alerts.filter(a => !a.acknowledged),
      recentEvents: recentEvents.slice(0, 10),
      trends: {
        violationsLast24h: recentEvents.filter(e => e.type === 'csp_violation').length,
        alertsLast7d: recentAlerts.length,
        securityIncidents: criticalEvents.length
      },
      recommendations: this.generateRecommendations()
    };
  }

  private calculateSecurityScore(): number {
    let score = 100;
    
    // Deduct points for various issues
    const criticalEvents = this.events.filter(e => e.severity === 'critical').length;
    const highEvents = this.events.filter(e => e.severity === 'high').length;
    const mediumEvents = this.events.filter(e => e.severity === 'medium').length;
    
    score -= criticalEvents * 20;
    score -= highEvents * 10;
    score -= mediumEvents * 5;
    
    // Bonus for good practices
    if (gdprCompliance.getConsent()) score += 5;
    if (cspMonitor.getViolations().length === 0) score += 10;
    if (location.protocol === 'https:') score += 5;
    
    return Math.max(0, Math.min(100, score));
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    
    const criticalEvents = this.events.filter(e => e.severity === 'critical').length;
    const cspViolations = this.events.filter(e => e.type === 'csp_violation').length;
    const xssAttempts = this.events.filter(e => e.type === 'xss_attempt').length;
    
    if (criticalEvents > 0) {
      recommendations.push('Address critical security events immediately');
    }
    
    if (cspViolations > 5) {
      recommendations.push('Review and update Content Security Policy');
    }
    
    if (xssAttempts > 0) {
      recommendations.push('Implement additional XSS protection measures');
    }
    
    if (!gdprCompliance.getConsent()) {
      recommendations.push('Ensure GDPR compliance with proper consent management');
    }
    
    if (location.protocol !== 'https:') {
      recommendations.push('Enable HTTPS for all traffic');
    }
    
    return recommendations;
  }

  public exportSecurityReport(): any {
    return {
      timestamp: new Date(),
      dashboard: this.generateDashboard(),
      allEvents: this.events,
      allAlerts: this.alerts,
      configuration: {
        monitoring: this.monitoring,
        reportingEndpoint: this.reportingEndpoint
      }
    };
  }

  public startMonitoring() {
    this.monitoring = true;
    this.monitorSecurityFeeds();
    console.log('Security monitoring started');
  }

  public stopMonitoring() {
    this.monitoring = false;
    console.log('Security monitoring stopped');
  }

  public setReportingEndpoint(endpoint: string) {
    this.reportingEndpoint = endpoint;
  }

  public getEvents(): SecurityEvent[] {
    return [...this.events];
  }

  public getAlerts(): SecurityAlert[] {
    return [...this.alerts];
  }
}

// Export singleton instance
export const securityMonitoring = new EnhancedSecurityMonitoring();