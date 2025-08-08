import { sanitizeHtml, sanitizeText } from '../security';
import { createLogger } from '@/lib/logger';
const slog = createLogger('security:gdpr');

export interface GDPRConsent {
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  necessary: boolean;
  timestamp: Date;
  version: string;
  userAgent: string;
  ipHash?: string;
}

export interface DataProcessingRecord {
  id: string;
  userId?: string;
  dataType: string;
  purpose: string;
  legalBasis: string;
  retentionPeriod: string;
  timestamp: Date;
  consentGiven: boolean;
}

export interface PrivacySettings {
  dataRetention: number; // days
  anonymizeAfter: number; // days
  allowAnalytics: boolean;
  allowMarketing: boolean;
  allowProfiling: boolean;
  rightToBeforgotten: boolean;
}

class GDPRCompliance {
  private consent: GDPRConsent | null = null;
  private processingRecords: DataProcessingRecord[] = [];
  private readonly CONSENT_VERSION = '2025.1';
  private readonly STORAGE_KEY = 'gdpr_consent';

  constructor() {
    this.initializeGDPR();
  }

  private initializeGDPR() {
    this.loadStoredConsent();
    this.setupConsentBanner();
    this.setupDataProtectionControls();
  }

  private loadStoredConsent() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Check if consent is still valid (not older than 12 months)
        const consentDate = new Date(parsed.timestamp);
        const isValid = Date.now() - consentDate.getTime() < 365 * 24 * 60 * 60 * 1000;
        
        if (isValid && parsed.version === this.CONSENT_VERSION) {
          this.consent = {
            ...parsed,
            timestamp: consentDate
          };
        } else {
          // Consent expired or version changed, need new consent
          localStorage.removeItem(this.STORAGE_KEY);
        }
      }
    } catch (error) {
      slog.error('Error loading GDPR consent:', error);
    }
  }

  private setupConsentBanner() {
    if (!this.consent && typeof window !== 'undefined') {
      this.showConsentBanner();
    }
  }

  private setupDataProtectionControls() {
    if (typeof window !== 'undefined') {
      // Add global GDPR controls
      (window as any).__GDPR_CONTROLS__ = {
        requestData: () => this.requestUserData(),
        deleteData: () => this.deleteUserData(),
        updateConsent: (consent: Partial<GDPRConsent>) => this.updateConsent(consent),
        downloadData: () => this.downloadUserData(),
        getProcessingRecords: () => this.getProcessingRecords()
      };
    }
  }

  private showConsentBanner() {
    const banner = document.createElement('div');
    banner.className = 'fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 shadow-lg z-50';
    banner.innerHTML = `
      <div class="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div class="text-sm text-muted-foreground">
          <p>We use cookies and similar technologies to improve your experience. 
          By clicking "Accept All", you consent to our use of cookies for analytics and marketing.</p>
        </div>
        <div class="flex gap-2">
          <button id="gdpr-manage" class="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent">
            Manage Preferences
          </button>
          <button id="gdpr-accept-necessary" class="px-4 py-2 text-sm border border-border rounded-md hover:bg-accent">
            Necessary Only
          </button>
          <button id="gdpr-accept-all" class="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
            Accept All
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(banner);

    // Add event listeners
    document.getElementById('gdpr-accept-all')?.addEventListener('click', () => {
      this.recordConsent({
        analytics: true,
        marketing: true,
        functional: true,
        necessary: true
      });
      banner.remove();
    });

    document.getElementById('gdpr-accept-necessary')?.addEventListener('click', () => {
      this.recordConsent({
        analytics: false,
        marketing: false,
        functional: false,
        necessary: true
      });
      banner.remove();
    });

    document.getElementById('gdpr-manage')?.addEventListener('click', () => {
      this.showConsentModal();
    });
  }

  private showConsentModal() {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    modal.innerHTML = `
      <div class="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 max-h-96 overflow-y-auto">
        <h3 class="text-lg font-semibold mb-4">Privacy Preferences</h3>
        <form id="gdpr-form">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div>
                <label class="font-medium">Necessary Cookies</label>
                <p class="text-sm text-muted-foreground">Required for basic website functionality</p>
              </div>
              <input type="checkbox" checked disabled class="rounded">
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="font-medium">Functional Cookies</label>
                <p class="text-sm text-muted-foreground">Remember your preferences and settings</p>
              </div>
              <input type="checkbox" id="functional" class="rounded">
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="font-medium">Analytics Cookies</label>
                <p class="text-sm text-muted-foreground">Help us understand how you use our website</p>
              </div>
              <input type="checkbox" id="analytics" class="rounded">
            </div>
            <div class="flex items-center justify-between">
              <div>
                <label class="font-medium">Marketing Cookies</label>
                <p class="text-sm text-muted-foreground">Used to show you relevant advertisements</p>
              </div>
              <input type="checkbox" id="marketing" class="rounded">
            </div>
          </div>
          <div class="flex gap-2 mt-6">
            <button type="button" id="gdpr-cancel" class="flex-1 px-4 py-2 border border-border rounded-md hover:bg-accent">
              Cancel
            </button>
            <button type="submit" class="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    `;

    document.body.appendChild(modal);

    // Handle form submission
    document.getElementById('gdpr-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const functional = Boolean((document.getElementById('functional') as HTMLInputElement)?.checked);
      const analytics = Boolean((document.getElementById('analytics') as HTMLInputElement)?.checked);
      const marketing = Boolean((document.getElementById('marketing') as HTMLInputElement)?.checked);

      this.recordConsent({
        analytics,
        marketing,
        functional,
        necessary: true
      });
      modal.remove();
    });

    document.getElementById('gdpr-cancel')?.addEventListener('click', () => {
      modal.remove();
    });

    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  public recordConsent(preferences: Omit<GDPRConsent, 'timestamp' | 'version' | 'userAgent'>) {
    this.consent = {
      ...preferences,
      timestamp: new Date(),
      version: this.CONSENT_VERSION,
      userAgent: navigator.userAgent
    };

    // Store consent
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.consent));

    // Record processing
    this.recordProcessing({
      dataType: 'consent_preferences',
      purpose: 'GDPR compliance',
      legalBasis: 'consent',
      retentionPeriod: '12 months',
      consentGiven: true
    });

    // Dispatch event for other parts of the app
    window.dispatchEvent(new CustomEvent('gdpr-consent-updated', { 
      detail: this.consent 
    }));
  }

  public recordProcessing(record: Omit<DataProcessingRecord, 'id' | 'timestamp' | 'userId'>) {
    const processingRecord: DataProcessingRecord = {
      id: crypto.randomUUID(),
      userId: this.getCurrentUserId(),
      timestamp: new Date(),
      ...record
    };

    this.processingRecords.push(processingRecord);

    // In a real app, this would be sent to a secure backend
    slog.info('Data processing recorded:', processingRecord);
  }

  private getCurrentUserId(): string | undefined {
    // This would get the current user ID from your auth system
    return undefined;
  }

  public hasConsent(type: keyof Omit<GDPRConsent, 'timestamp' | 'version' | 'userAgent'>): boolean {
    return Boolean(this.consent?.[type]) || false;
  }

  public getConsent(): GDPRConsent | null {
    return this.consent;
  }

  public updateConsent(updates: Partial<GDPRConsent>) {
    if (this.consent) {
      this.consent = {
        ...this.consent,
        ...updates,
        timestamp: new Date(),
        version: this.CONSENT_VERSION
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.consent));
    }
  }

  public revokeConsent() {
    this.consent = null;
    localStorage.removeItem(this.STORAGE_KEY);
    
    // Clear any stored data based on previous consent
    this.clearUserData();
    
    window.dispatchEvent(new CustomEvent('gdpr-consent-revoked'));
  }

  public async requestUserData(): Promise<any> {
    // This would compile all user data from various sources
    const userData = {
      consent: this.consent,
      processingRecords: this.processingRecords,
      // Add other user data here
    };

    return userData;
  }

  public async downloadUserData(): Promise<void> {
    const data = await this.requestUserData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `user-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  public async deleteUserData(): Promise<void> {
    // Clear all stored data
    this.clearUserData();
    
    // In a real app, this would also send a deletion request to the backend
    slog.info('User data deletion requested');
    
    // Record the deletion request
    this.recordProcessing({
      dataType: 'user_data_deletion',
      purpose: 'right_to_be_forgotten',
      legalBasis: 'consent_withdrawal',
      retentionPeriod: '30 days (audit log)',
      consentGiven: false
    });
  }

  private clearUserData() {
    // Clear localStorage items related to user data
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.includes('user') || key.includes('settings') || key.includes('preferences'))) {
        keysToRemove.push(key);
      }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }

  public getProcessingRecords(): DataProcessingRecord[] {
    return [...this.processingRecords];
  }

  public sanitizeUserInput(input: string, allowHtml: boolean = false): string {
    return allowHtml ? sanitizeHtml(input) : sanitizeText(input);
  }

  public generatePrivacyReport(): PrivacyReport {
    return {
      timestamp: new Date(),
      consent: this.consent,
      processingRecords: this.processingRecords,
      dataRetentionPolicy: {
        userPreferences: '12 months',
        analyticsData: '26 months',
        securityLogs: '12 months',
        errorLogs: '30 days'
      },
      complianceStatus: {
        hasValidConsent: !!this.consent,
        consentUpToDate: this.consent ? 
          Date.now() - this.consent.timestamp.getTime() < 365 * 24 * 60 * 60 * 1000 : false,
        dataMinimization: true,
        purposeLimitation: true,
        storageMinimization: true
      }
    };
  }
}

export interface PrivacyReport {
  timestamp: Date;
  consent: GDPRConsent | null;
  processingRecords: DataProcessingRecord[];
  dataRetentionPolicy: Record<string, string>;
  complianceStatus: {
    hasValidConsent: boolean;
    consentUpToDate: boolean;
    dataMinimization: boolean;
    purposeLimitation: boolean;
    storageMinimization: boolean;
  };
}

// Export singleton instance
export const gdprCompliance = new GDPRCompliance();