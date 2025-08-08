import { createLogger } from '@/lib/logger';
const slog = createLogger('security:index');
// Enhanced Security Suite - 2025 Edition
slog.info('🔍 Loading security index.ts...');
// Re-export original security utilities first
export * from '../security';

slog.info('✅ Original security utilities exported');

// Export enhanced modules
export * from './csp-monitor';
export * from './gdpr-compliance';
export * from './devtools-integration';
export * from './enhanced-monitoring';
export * from './unified-logger';

slog.info('✅ Enhanced security modules exported');

import { createLogger } from '@/lib/logger';
import { cspMonitor } from './csp-monitor';
import { gdprCompliance } from './gdpr-compliance';
import { devToolsIntegration } from './devtools-integration';
import { securityMonitoring } from './enhanced-monitoring';
import { securityLogger, securityLog } from './unified-logger';
import { isPublicPath } from '@/lib/routes/publicPaths';

const isDevelopment = import.meta.env.DEV;
const slog = createLogger('security:index');

slog.info('📦 Security instances imported:', { cspMonitor, gdprCompliance, devToolsIntegration, securityMonitoring });

/**
 * Initialize the complete security suite with Chrome DevTools integration
 */
export function initializeSecuritySuite() {
  try {
    // Check if we're on a public page - minimal security for performance
    const isPublicPage = typeof window !== 'undefined' && isPublicPath(window.location.pathname);
    
    const isProduction = import.meta.env.PROD;
    
    // Skip heavy security monitoring on public pages in production
    if (isPublicPage && isProduction) {
      slog.info('🔒 Minimal Security (Public Page)');
      return; // Exit early - no security monitoring needed
    }
    
    if (isProduction) {
      slog.info('🔒 Production Security Suite Active');
    } else {
      slog.info('🔒 Development Security Suite Active');
    }
    
    // Skip the rest of initialization for public pages
    if (isPublicPage) return;
    securityMonitoring.startMonitoring();
    
    // Initialize DevTools integration only in development
    if (!isProduction) {
      slog.info('🛠️ DevTools Security Integration Active');
    }
    
    // Set up global error handling for security events
    window.addEventListener('error', (event) => {
      securityMonitoring.recordEvent({
        type: 'unauthorized_access',
        severity: 'medium',
        description: `JavaScript error: ${event.message}`,
        metadata: {
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
          stack: event.error?.stack
        }
      });
    });

    // Set up unhandled promise rejection monitoring
    window.addEventListener('unhandledrejection', (event) => {
      securityMonitoring.recordEvent({
        type: 'unauthorized_access',
        severity: 'low',
        description: `Unhandled promise rejection: ${event.reason}`,
        metadata: {
          reason: event.reason?.toString(),
          stack: event.reason?.stack
        }
      });
    });

    // Set up security header validation
    validateSecurityHeaders();
    
    // Set up periodic security checks
    if (typeof window !== 'undefined') {
      setInterval(() => {
        performPeriodicSecurityCheck();
      }, 5 * 60 * 1000); // Every 5 minutes
    }
    
    slog.info('✅ Security Suite Initialized Successfully');
    
    // Log available tools for developers
    if (isDevelopment) {
      setTimeout(() => {
        slog.info('Security DevTools Available: type security.help() for more commands');
      }, 2000);
    }
    
  } catch (error) {
    slog.error('Failed to initialize security suite:', error);
    
    // Record the initialization failure
    securityMonitoring.recordEvent({
      type: 'unauthorized_access',
      severity: 'high',
      description: 'Security suite initialization failed',
      metadata: {
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      }
    });
  }
}

/**
 * Validate that security headers are properly configured
 */
function validateSecurityHeaders() {
  // In production, headers are set via vercel.json/server config, not meta tags
  const isProduction = window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1';
  
  if (isProduction) {
    // In production, assume headers are properly configured via server
    slog.debug('Security headers configured via server (production)');
    return;
  }
  
  // In development, check for meta tags as fallback
  const securityHeaders = [
    'Content-Security-Policy',
    'X-Content-Type-Options',
    'Referrer-Policy'
  ];

  // Note: X-Frame-Options and other headers are set via HTTP headers in production
  securityHeaders.forEach(header => {
    const metaTag = document.querySelector(`meta[http-equiv="${header}"]`);
    if (!metaTag) {
      securityMonitoring.recordEvent({
        type: 'unauthorized_access',
        severity: 'low',
        description: `Security header not found in meta tags (dev environment): ${header}`,
        metadata: { 
          header,
          note: 'Headers are configured via server in production'
        }
      });
    }
  });
}

/**
 * Perform periodic security checks
 */
function performPeriodicSecurityCheck() {
  try {
    // Check for new CSP violations
    const violations = cspMonitor.getViolations();
    const recentViolations = violations.filter(v => 
      Date.now() - v.timestamp.getTime() < 5 * 60 * 1000 // Last 5 minutes
    );
    
    if (recentViolations.length > 5) {
      securityMonitoring.recordEvent({
        type: 'csp_violation',
        severity: 'high',
        description: `High rate of CSP violations: ${recentViolations.length} in 5 minutes`,
        metadata: { violationCount: recentViolations.length }
      });
    }
    
    // Check GDPR consent expiry
    const consent = gdprCompliance.getConsent();
    if (consent) {
      const consentAge = Date.now() - consent.timestamp.getTime();
      const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
      
      if (consentAge > sixMonths) {
        securityMonitoring.recordEvent({
          type: 'privacy_violation',
          severity: 'medium',
          description: 'GDPR consent is older than 6 months',
          metadata: { consentAge: Math.round(consentAge / (24 * 60 * 60 * 1000)) }
        });
      }
    }
    
    // Check for suspicious DOM modifications
    const scripts = document.querySelectorAll('script');
    const suspiciousScripts = Array.from(scripts).filter(script => {
      const src = script.src;
      const content = script.textContent || '';
      
      return (
        (src && !src.startsWith(window.location.origin) && !src.startsWith('https://')) ||
        content.includes('eval(') ||
        content.includes('document.write(')
      );
    });
    
    if (suspiciousScripts.length > 0) {
      securityMonitoring.recordEvent({
        type: 'xss_attempt',
        severity: 'high',
        description: `Suspicious scripts detected: ${suspiciousScripts.length}`,
        metadata: { 
          scriptCount: suspiciousScripts.length,
          sources: suspiciousScripts.map(s => s.src || 'inline').slice(0, 5)
        }
      });
    }
    
  } catch (error) {
    console.error('Periodic security check failed:', error);
  }
}

/**
 * Get comprehensive security status
 */
export function getSecurityStatus() {
  return {
    csp: {
      violations: cspMonitor.getViolations().length,
      lastViolation: cspMonitor.getViolations().slice(-1)[0]?.timestamp || null
    },
    gdpr: {
      hasConsent: !!gdprCompliance.getConsent(),
      consentDate: gdprCompliance.getConsent()?.timestamp || null
    },
    monitoring: {
      events: securityMonitoring.getEvents().length,
      alerts: securityMonitoring.getAlerts().filter(a => !a.acknowledged).length,
      dashboard: securityMonitoring.generateDashboard()
    },
    devtools: {
      enabled: isDevelopment,
      panels: devToolsIntegration.getPanels().length
    }
  };
}

/**
 * Export all instances for direct access
 */
export {
  cspMonitor,
  gdprCompliance,
  devToolsIntegration,
  securityMonitoring,
  securityLogger,
  securityLog
};