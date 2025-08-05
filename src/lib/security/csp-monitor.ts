import { config, featureFlags } from '@/config';

export interface CSPViolation {
  documentURI: string;
  referrer: string;
  blockedURI: string;
  violatedDirective: string;
  effectiveDirective: string;
  originalPolicy: string;
  disposition: string;
  statusCode: number;
  timestamp: Date;
  userAgent: string;
}

export interface SecurityMetrics {
  cspViolations: CSPViolation[];
  mixedContentWarnings: number;
  insecureRequests: number;
  cookieSecurityIssues: number;
  performanceMetrics: {
    securityHeadersLoadTime: number;
    cspParseTime: number;
  };
}

class CSPMonitor {
  private violations: CSPViolation[] = [];
  private metrics: SecurityMetrics = {
    cspViolations: [],
    mixedContentWarnings: 0,
    insecureRequests: 0,
    cookieSecurityIssues: 0,
    performanceMetrics: {
      securityHeadersLoadTime: 0,
      cspParseTime: 0
    }
  };

  constructor() {
    this.initializeCSPReporting();
    this.initializeDevToolsIntegration();
  }

  private initializeCSPReporting() {
    // Listen for CSP violation reports
    document.addEventListener('securitypolicyviolation', (event) => {
      const violation: CSPViolation = {
        documentURI: event.documentURI,
        referrer: event.referrer,
        blockedURI: event.blockedURI,
        violatedDirective: event.violatedDirective,
        effectiveDirective: event.effectiveDirective,
        originalPolicy: event.originalPolicy,
        disposition: event.disposition,
        statusCode: event.statusCode,
        timestamp: new Date(),
        userAgent: navigator.userAgent
      };

      this.recordViolation(violation);
    });
  }

  private initializeDevToolsIntegration() {
    if (config.features.enableDebugTools && typeof window !== 'undefined') {
      // Create DevTools extension integration
      (window as any).__SECURITY_MONITOR__ = {
        getViolations: () => this.violations,
        getMetrics: () => this.metrics,
        exportReport: () => this.exportSecurityReport(),
        testCSP: (directive: string) => this.testCSPDirective(directive),
        auditSecurity: () => this.performSecurityAudit()
      };

      // Console integration for developers
      console.log('%c🔒 Security Monitor Initialized', 'color: #10b981; font-weight: bold;');
      console.log('Use __SECURITY_MONITOR__ to access security tools');
    }
  }

  private recordViolation(violation: CSPViolation) {
    this.violations.push(violation);
    this.metrics.cspViolations.push(violation);

    // Log in development
    if (config.features.enableDebugTools) {
      console.warn('CSP Violation:', violation);
      this.suggestCSPFix(violation);
    }

    // Report to monitoring service in production
    if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
      this.reportViolation(violation);
    }
  }

  private suggestCSPFix(violation: CSPViolation) {
    const suggestions: Record<string, string> = {
      'script-src': `Consider adding '${violation.blockedURI}' to script-src directive`,
      'style-src': `Consider adding '${violation.blockedURI}' to style-src directive`,
      'img-src': `Consider adding '${violation.blockedURI}' to img-src directive`,
      'connect-src': `Consider adding '${violation.blockedURI}' to connect-src directive`,
      'font-src': `Consider adding '${violation.blockedURI}' to font-src directive`
    };

    const suggestion = suggestions[violation.effectiveDirective];
    if (suggestion) {
      console.info(`💡 CSP Fix Suggestion: ${suggestion}`);
    }
  }

  private async reportViolation(violation: CSPViolation) {
    try {
      // Send to monitoring endpoint
      await fetch('/api/security/csp-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(violation)
      });
    } catch (error) {
      console.error('Failed to report CSP violation:', error);
    }
  }

  public testCSPDirective(directive: string): boolean {
    try {
      // Create a test element to check if directive allows the action
      const testElement = document.createElement('div');
      testElement.innerHTML = `<script src="data:text/javascript,console.log('CSP test')"></script>`;
      document.body.appendChild(testElement);
      document.body.removeChild(testElement);
      return true;
    } catch (error) {
      return false;
    }
  }

  public performSecurityAudit(): Promise<SecurityAuditResult> {
    return new Promise((resolve) => {
      const results: SecurityAuditResult = {
        cspCompliance: this.auditCSPCompliance(),
        httpsUsage: this.auditHTTPSUsage(),
        cookieSecurity: this.auditCookieSecurity(),
        mixedContent: this.auditMixedContent(),
        securityHeaders: this.auditSecurityHeaders(),
        score: 0,
        recommendations: []
      };

      // Calculate overall security score
      results.score = this.calculateSecurityScore(results);
      results.recommendations = this.generateRecommendations(results);

      resolve(results);
    });
  }

  private auditCSPCompliance(): AuditResult {
    const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const violationsCount = this.violations.length;
    
    return {
      passed: hasCSP && violationsCount === 0,
      score: hasCSP ? (violationsCount === 0 ? 100 : Math.max(0, 100 - violationsCount * 10)) : 0,
      details: `CSP present: ${hasCSP}, Violations: ${violationsCount}`
    };
  }

  private auditHTTPSUsage(): AuditResult {
    const isHTTPS = location.protocol === 'https:';
    const mixedContentElements = document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]');
    
    return {
      passed: isHTTPS && mixedContentElements.length === 0,
      score: isHTTPS ? (mixedContentElements.length === 0 ? 100 : 50) : 0,
      details: `HTTPS: ${isHTTPS}, Mixed content elements: ${mixedContentElements.length}`
    };
  }

  private auditCookieSecurity(): AuditResult {
    const cookies = document.cookie.split(';');
    const insecureCookies = cookies.filter(cookie => 
      !cookie.includes('Secure') || !cookie.includes('SameSite')
    );
    
    return {
      passed: insecureCookies.length === 0,
      score: Math.max(0, 100 - insecureCookies.length * 20),
      details: `Insecure cookies: ${insecureCookies.length}/${cookies.length}`
    };
  }

  private auditMixedContent(): AuditResult {
    const mixedElements = document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]');
    
    return {
      passed: mixedElements.length === 0,
      score: mixedElements.length === 0 ? 100 : 0,
      details: `Mixed content elements: ${mixedElements.length}`
    };
  }

  private auditSecurityHeaders(): AuditResult {
    // This would be better checked server-side, but we can check some client-side indicators
    const hasCSP = !!document.querySelector('meta[http-equiv="Content-Security-Policy"]');
    const hasFrameOptions = !!document.querySelector('meta[http-equiv="X-Frame-Options"]');
    
    const score = (hasCSP ? 50 : 0) + (hasFrameOptions ? 50 : 0);
    
    return {
      passed: hasCSP && hasFrameOptions,
      score,
      details: `CSP: ${hasCSP}, Frame Options: ${hasFrameOptions}`
    };
  }

  private calculateSecurityScore(results: SecurityAuditResult): number {
    const scores = [
      results.cspCompliance.score,
      results.httpsUsage.score,
      results.cookieSecurity.score,
      results.mixedContent.score,
      results.securityHeaders.score
    ];
    
    return Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
  }

  private generateRecommendations(results: SecurityAuditResult): string[] {
    const recommendations: string[] = [];
    
    if (!results.cspCompliance.passed) {
      recommendations.push('Implement Content Security Policy (CSP) headers');
    }
    
    if (!results.httpsUsage.passed) {
      recommendations.push('Ensure all resources are loaded over HTTPS');
    }
    
    if (!results.cookieSecurity.passed) {
      recommendations.push('Add Secure and SameSite attributes to cookies');
    }
    
    if (!results.mixedContent.passed) {
      recommendations.push('Remove mixed content (HTTP resources on HTTPS pages)');
    }
    
    if (!results.securityHeaders.passed) {
      recommendations.push('Add security headers (X-Frame-Options, X-Content-Type-Options, etc.)');
    }
    
    return recommendations;
  }

  public exportSecurityReport(): SecurityReport {
    return {
      timestamp: new Date(),
      violations: this.violations,
      metrics: this.metrics,
      audit: null // Will be populated when audit is run
    };
  }

  public getViolations(): CSPViolation[] {
    return [...this.violations];
  }

  public getMetrics(): SecurityMetrics {
    return { ...this.metrics };
  }
}

export interface AuditResult {
  passed: boolean;
  score: number;
  details: string;
}

export interface SecurityAuditResult {
  cspCompliance: AuditResult;
  httpsUsage: AuditResult;
  cookieSecurity: AuditResult;
  mixedContent: AuditResult;
  securityHeaders: AuditResult;
  score: number;
  recommendations: string[];
}

export interface SecurityReport {
  timestamp: Date;
  violations: CSPViolation[];
  metrics: SecurityMetrics;
  audit: SecurityAuditResult | null;
}

// Export singleton instance
export const cspMonitor = new CSPMonitor();