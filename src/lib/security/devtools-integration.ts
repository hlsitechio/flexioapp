import { cspMonitor, type SecurityReport, type SecurityAuditResult } from './csp-monitor';
import { gdprCompliance, type PrivacyReport } from './gdpr-compliance';
const isDevelopment = import.meta.env.DEV;
import { createLogger } from '@/lib/logger';
const slog = createLogger('security:devtools');

export interface DevToolsSecurityPanel {
  name: string;
  icon: string;
  component: () => HTMLElement;
}

export interface SecurityDevToolsAPI {
  security: {
    audit: () => Promise<SecurityAuditResult>;
    getViolations: () => any[];
    exportReport: () => SecurityReport;
    testCSP: (directive: string) => boolean;
  };
  privacy: {
    getConsent: () => any;
    getProcessingRecords: () => any[];
    generateReport: () => PrivacyReport;
    requestData: () => Promise<any>;
    deleteData: () => Promise<void>;
  };
  performance: {
    getSecurityMetrics: () => any;
    measureHeaderLoadTime: () => number;
    measureCSPParseTime: () => number;
  };
  utils: {
    validateCSP: (policy: string) => boolean;
    checkMixedContent: () => any[];
    auditCookies: () => any[];
    scanForVulnerabilities: () => Promise<any[]>;
  };
}

class DevToolsIntegration {
  private panels: DevToolsSecurityPanel[] = [];
  private isInitialized = false;

  constructor() {
    if (isDevelopment) {
      this.initialize();
    }
  }

  private initialize() {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.setupDevToolsAPI();
    this.createSecurityPanels();
    this.setupConsoleCommands();
    this.setupPerformanceMonitoring();
    this.initializeExtensionBridge();
    
    this.isInitialized = true;
    slog.info('🛠️ DevTools Security Integration Ready');
  }

  private setupDevToolsAPI() {
    const api: SecurityDevToolsAPI = {
      security: {
        audit: () => cspMonitor.performSecurityAudit(),
        getViolations: () => cspMonitor.getViolations(),
        exportReport: () => cspMonitor.exportSecurityReport(),
        testCSP: (directive: string) => cspMonitor.testCSPDirective(directive)
      },
      privacy: {
        getConsent: () => gdprCompliance.getConsent(),
        getProcessingRecords: () => gdprCompliance.getProcessingRecords(),
        generateReport: () => gdprCompliance.generatePrivacyReport(),
        requestData: () => gdprCompliance.requestUserData(),
        deleteData: () => gdprCompliance.deleteUserData()
      },
      performance: {
        getSecurityMetrics: () => cspMonitor.getMetrics(),
        measureHeaderLoadTime: () => this.measureHeaderLoadTime(),
        measureCSPParseTime: () => this.measureCSPParseTime()
      },
      utils: {
        validateCSP: (policy: string) => this.validateCSPPolicy(policy),
        checkMixedContent: () => this.checkMixedContent(),
        auditCookies: () => this.auditCookies(),
        scanForVulnerabilities: () => this.scanForVulnerabilities()
      }
    };

    (window as any).__SECURITY_DEVTOOLS__ = api;
  }

  private createSecurityPanels() {
    this.panels = [
      {
        name: 'Security Overview',
        icon: '🔒',
        component: () => this.createSecurityOverviewPanel()
      },
      {
        name: 'CSP Monitor',
        icon: '🛡️',
        component: () => this.createCSPMonitorPanel()
      },
      {
        name: 'GDPR Compliance',
        icon: '🔐',
        component: () => this.createGDPRPanel()
      },
      {
        name: 'Performance',
        icon: '⚡',
        component: () => this.createPerformancePanel()
      },
      {
        name: 'Vulnerability Scanner',
        icon: '🔍',
        component: () => this.createVulnerabilityPanel()
      }
    ];

    // Make panels available globally
    (window as any).__SECURITY_PANELS__ = this.panels;
  }

  private setupConsoleCommands() {
    // Create helper functions for console use
    (window as any).security = {
      audit: async () => {
        const result = await cspMonitor.performSecurityAudit();
        console.table(result);
        return result;
      },
      violations: () => {
        const violations = cspMonitor.getViolations();
        console.table(violations);
        return violations;
      },
      gdpr: () => {
        const report = gdprCompliance.generatePrivacyReport();
        console.log('GDPR Compliance Report:', report);
        return report;
      },
      export: () => {
        const report = cspMonitor.exportSecurityReport();
        console.log('Security Report:', report);
        return report;
      },
      help: () => {
        console.log(`
%c🔒 Security DevTools Commands:
%csecurity.audit()%c - Run complete security audit
%csecurity.violations()%c - Show CSP violations
%csecurity.gdpr()%c - Show GDPR compliance report
%csecurity.export()%c - Export security report
%csecurity.help()%c - Show this help

%c🛠️ Advanced API:
%c__SECURITY_DEVTOOLS__%c - Full DevTools API
%c__SECURITY_PANELS__%c - UI Panel components
%c__GDPR_CONTROLS__%c - GDPR management functions
`, 
          'color: #10b981; font-weight: bold;',
          'color: #3b82f6; font-family: monospace;', 'color: #6b7280;',
          'color: #3b82f6; font-family: monospace;', 'color: #6b7280;',
          'color: #3b82f6; font-family: monospace;', 'color: #6b7280;',
          'color: #3b82f6; font-family: monospace;', 'color: #6b7280;',
          'color: #3b82f6; font-family: monospace;', 'color: #6b7280;',
          'color: #f59e0b; font-weight: bold;',
          'color: #8b5cf6; font-family: monospace;', 'color: #6b7280;',
          'color: #8b5cf6; font-family: monospace;', 'color: #6b7280;',
          'color: #8b5cf6; font-family: monospace;', 'color: #6b7280;'
        );
      }
    };

    // Show initial help
    setTimeout(() => {
      slog.info('Type security.help() for available commands');
    }, 1000);
  }

  private setupPerformanceMonitoring() {
    // Monitor security-related performance metrics
    if (typeof PerformanceObserver !== 'undefined') {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.name.includes('security') || entry.name.includes('csp')) {
            slog.debug(`Security Performance: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });

      observer.observe({ entryTypes: ['measure', 'navigation'] });
    }
  }

  private initializeExtensionBridge() {
    // Create a bridge for browser extension integration
    const extensionBridge = {
      id: 'security-devtools-bridge',
      version: '2025.1',
      api: (window as any).__SECURITY_DEVTOOLS__,
      panels: this.panels,
      events: new EventTarget()
    };

    (window as any).__EXTENSION_BRIDGE__ = extensionBridge;

    // Listen for extension messages
    window.addEventListener('message', (event) => {
      if (event.data?.type === 'SECURITY_DEVTOOLS_QUERY') {
        this.handleExtensionQuery(event);
      }
    });
  }

  private handleExtensionQuery(event: MessageEvent) {
    const { query, id } = event.data;
    let response;

    switch (query) {
      case 'GET_SECURITY_STATUS':
        response = {
          violations: cspMonitor.getViolations().length,
          consent: !!gdprCompliance.getConsent(),
          score: 0 // Will be calculated
        };
        break;
      case 'GET_VIOLATIONS':
        response = cspMonitor.getViolations();
        break;
      case 'RUN_AUDIT':
        cspMonitor.performSecurityAudit().then(result => {
          window.postMessage({
            type: 'SECURITY_DEVTOOLS_RESPONSE',
            id,
            data: result
          }, '*');
        });
        return;
      default:
        response = { error: 'Unknown query' };
    }

    window.postMessage({
      type: 'SECURITY_DEVTOOLS_RESPONSE',
      id,
      data: response
    }, '*');
  }

  private createSecurityOverviewPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'security-overview-panel';
    panel.innerHTML = `
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Security Overview</h3>
        <div id="security-score" class="mb-4">
          <div class="text-2xl font-bold text-green-600">Loading...</div>
          <div class="text-sm text-gray-600">Overall Security Score</div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div class="stat-item">
            <div class="text-xl font-semibold" id="violations-count">-</div>
            <div class="text-sm text-gray-600">CSP Violations</div>
          </div>
          <div class="stat-item">
            <div class="text-xl font-semibold" id="consent-status">-</div>
            <div class="text-sm text-gray-600">GDPR Consent</div>
          </div>
        </div>
        <button id="run-audit" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Run Security Audit
        </button>
      </div>
    `;

    // Update panel with live data
    this.updateSecurityOverview(panel);

    return panel;
  }

  private createCSPMonitorPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'csp-monitor-panel';
    panel.innerHTML = `
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">CSP Monitor</h3>
        <div id="csp-violations" class="space-y-2 max-h-64 overflow-y-auto">
          <!-- Violations will be populated here -->
        </div>
        <div class="mt-4">
          <input type="text" id="csp-test" placeholder="Test CSP directive..." 
                 class="w-full px-3 py-2 border rounded">
          <button id="test-csp" class="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
            Test Directive
          </button>
        </div>
      </div>
    `;

    this.updateCSPMonitor(panel);
    return panel;
  }

  private createGDPRPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'gdpr-panel';
    panel.innerHTML = `
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">GDPR Compliance</h3>
        <div id="gdpr-status" class="mb-4">
          <!-- Status will be populated here -->
        </div>
        <div class="space-y-2">
          <button id="download-data" class="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Download My Data
          </button>
          <button id="delete-data" class="w-full px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            Delete My Data
          </button>
          <button id="manage-consent" class="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
            Manage Consent
          </button>
        </div>
      </div>
    `;

    this.updateGDPRPanel(panel);
    return panel;
  }

  private createPerformancePanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'performance-panel';
    panel.innerHTML = `
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Security Performance</h3>
        <div id="performance-metrics" class="space-y-2">
          <!-- Metrics will be populated here -->
        </div>
      </div>
    `;

    this.updatePerformancePanel(panel);
    return panel;
  }

  private createVulnerabilityPanel(): HTMLElement {
    const panel = document.createElement('div');
    panel.className = 'vulnerability-panel';
    panel.innerHTML = `
      <div class="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Vulnerability Scanner</h3>
        <button id="scan-vulnerabilities" class="w-full px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700">
          Scan for Vulnerabilities
        </button>
        <div id="vulnerability-results" class="mt-4 space-y-2">
          <!-- Results will be populated here -->
        </div>
      </div>
    `;

    this.setupVulnerabilityScanner(panel);
    return panel;
  }

  private updateSecurityOverview(panel: HTMLElement) {
    // Update with real data
    const violationsCount = cspMonitor.getViolations().length;
    const hasConsent = !!gdprCompliance.getConsent();

    panel.querySelector('#violations-count')!.textContent = violationsCount.toString();
    panel.querySelector('#consent-status')!.textContent = hasConsent ? 'Valid' : 'Missing';

    // Run audit to get score
    cspMonitor.performSecurityAudit().then(result => {
      panel.querySelector('#security-score .text-2xl')!.textContent = `${result.score}%`;
    });
  }

  private updateCSPMonitor(panel: HTMLElement) {
    const violations = cspMonitor.getViolations();
    const container = panel.querySelector('#csp-violations')!;
    
    if (violations.length === 0) {
      container.innerHTML = '<div class="text-green-600">No CSP violations detected</div>';
    } else {
      container.innerHTML = violations.map(v => `
        <div class="p-2 bg-red-50 border-l-4 border-red-400 text-sm">
          <div class="font-semibold">${v.violatedDirective}</div>
          <div class="text-gray-600">${v.blockedURI}</div>
        </div>
      `).join('');
    }
  }

  private updateGDPRPanel(panel: HTMLElement) {
    const consent = gdprCompliance.getConsent();
    const statusContainer = panel.querySelector('#gdpr-status')!;
    
    if (consent) {
      statusContainer.innerHTML = `
        <div class="text-green-600 font-semibold">✓ Consent Recorded</div>
        <div class="text-sm text-gray-600">Version: ${consent.version}</div>
        <div class="text-sm text-gray-600">Date: ${consent.timestamp.toLocaleDateString()}</div>
      `;
    } else {
      statusContainer.innerHTML = `
        <div class="text-red-600 font-semibold">✗ No Consent</div>
        <div class="text-sm text-gray-600">User has not provided consent</div>
      `;
    }
  }

  private updatePerformancePanel(panel: HTMLElement) {
    const metrics = cspMonitor.getMetrics();
    const container = panel.querySelector('#performance-metrics')!;
    
    container.innerHTML = `
      <div class="flex justify-between">
        <span>CSP Violations:</span>
        <span>${metrics.cspViolations.length}</span>
      </div>
      <div class="flex justify-between">
        <span>Mixed Content Warnings:</span>
        <span>${metrics.mixedContentWarnings}</span>
      </div>
      <div class="flex justify-between">
        <span>Insecure Requests:</span>
        <span>${metrics.insecureRequests}</span>
      </div>
    `;
  }

  private setupVulnerabilityScanner(panel: HTMLElement) {
    const button = panel.querySelector('#scan-vulnerabilities');
    const results = panel.querySelector('#vulnerability-results');
    
    button?.addEventListener('click', async () => {
      button.textContent = 'Scanning...';
      (button as HTMLButtonElement).disabled = true;
      
      const vulnerabilities = await this.scanForVulnerabilities();
      
      if (vulnerabilities.length === 0) {
        results!.innerHTML = '<div class="text-green-600">No vulnerabilities detected</div>';
      } else {
        results!.innerHTML = vulnerabilities.map(v => `
          <div class="p-2 border-l-4 ${v.severity === 'high' ? 'border-red-400 bg-red-50' : 
                                        v.severity === 'medium' ? 'border-yellow-400 bg-yellow-50' : 
                                        'border-blue-400 bg-blue-50'} text-sm">
            <div class="font-semibold">${v.type}</div>
            <div class="text-gray-600">${v.description}</div>
          </div>
        `).join('');
      }
      
      button.textContent = 'Scan for Vulnerabilities';
      (button as HTMLButtonElement).disabled = false;
    });
  }

  // Utility methods
  private measureHeaderLoadTime(): number {
    const perfEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
    if (perfEntries.length > 0) {
      return perfEntries[0].loadEventEnd - perfEntries[0].loadEventStart;
    }
    return 0;
  }

  private measureCSPParseTime(): number {
    // This would measure CSP parsing time in a real implementation
    return Math.random() * 10; // Placeholder
  }

  private validateCSPPolicy(policy: string): boolean {
    try {
      // Basic CSP policy validation
      const directives = policy.split(';').map(d => d.trim());
      const validDirectives = [
        'default-src', 'script-src', 'style-src', 'img-src', 'connect-src',
        'font-src', 'object-src', 'media-src', 'frame-src', 'sandbox',
        'report-uri', 'report-to', 'upgrade-insecure-requests'
      ];
      
      return directives.every(directive => {
        const [name] = directive.split(' ');
        return validDirectives.includes(name) || name === '';
      });
    } catch {
      return false;
    }
  }

  private checkMixedContent(): any[] {
    const mixedElements = Array.from(document.querySelectorAll('img[src^="http:"], script[src^="http:"], link[href^="http:"]'));
    return mixedElements.map(el => ({
      tag: el.tagName.toLowerCase(),
      src: el.getAttribute('src') || el.getAttribute('href'),
      element: el
    }));
  }

  private auditCookies(): any[] {
    return document.cookie.split(';').map(cookie => {
      const [name, ...valueParts] = cookie.split('=');
      const value = valueParts.join('=');
      
      return {
        name: name.trim(),
        secure: cookie.includes('Secure'),
        httpOnly: cookie.includes('HttpOnly'),
        sameSite: cookie.includes('SameSite'),
        issues: [
          !cookie.includes('Secure') ? 'Missing Secure flag' : null,
          !cookie.includes('SameSite') ? 'Missing SameSite attribute' : null
        ].filter(Boolean)
      };
    });
  }

  private async scanForVulnerabilities(): Promise<any[]> {
    const vulnerabilities = [];

    // Check for common vulnerabilities
    if (location.protocol !== 'https:') {
      vulnerabilities.push({
        type: 'Insecure Protocol',
        severity: 'high',
        description: 'Site not served over HTTPS'
      });
    }

    const mixedContent = this.checkMixedContent();
    if (mixedContent.length > 0) {
      vulnerabilities.push({
        type: 'Mixed Content',
        severity: 'medium',
        description: `${mixedContent.length} resources loaded over HTTP`
      });
    }

    const cookieIssues = this.auditCookies().filter(c => c.issues.length > 0);
    if (cookieIssues.length > 0) {
      vulnerabilities.push({
        type: 'Insecure Cookies',
        severity: 'medium',
        description: `${cookieIssues.length} cookies missing security attributes`
      });
    }

    return vulnerabilities;
  }

  public getPanels(): DevToolsSecurityPanel[] {
    return [...this.panels];
  }

  public getAPI(): SecurityDevToolsAPI {
    return (window as any).__SECURITY_DEVTOOLS__;
  }
}

// Export singleton instance
export const devToolsIntegration = new DevToolsIntegration();