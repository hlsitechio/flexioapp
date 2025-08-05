import { integrationsConfig } from '../../../config/integrations';
import { supabase } from '@/integrations/supabase/client';

// Lead data interface
export interface LeadData {
  email: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
  jobTitle?: string;
  industry?: string;
  companySize?: string;
  source: string;
  campaign?: string;
  utmData?: {
    source?: string;
    medium?: string;
    campaign?: string;
    term?: string;
    content?: string;
  };
  pageUrl?: string;
  referrer?: string;
  userAgent?: string;
  ipAddress?: string;
}

// Base CRM provider interface
export interface CRMProvider {
  initialize(): boolean;
  createLead(leadData: LeadData): Promise<{ success: boolean; id?: string; error?: string }>;
  updateLead(id: string, data: Partial<LeadData>): Promise<{ success: boolean; error?: string }>;
  getLead(id: string): Promise<{ success: boolean; data?: any; error?: string }>;
}

// HubSpot CRM Provider
class HubSpotProvider implements CRMProvider {
  private apiKey: string;
  private portalId: string;

  constructor() {
    this.apiKey = integrationsConfig.crm.hubspot.apiKey;
    this.portalId = integrationsConfig.crm.hubspot.portalId;
  }

  initialize(): boolean {
    return !!(this.apiKey && this.portalId);
  }

  async createLead(leadData: LeadData): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'HubSpot not configured' };
    }

    try {
      const properties = {
        email: leadData.email,
        firstname: leadData.firstName,
        lastname: leadData.lastName,
        company: leadData.company,
        phone: leadData.phone,
        jobtitle: leadData.jobTitle,
        industry: leadData.industry,
        company_size: leadData.companySize,
        lead_source: leadData.source,
        utm_source: leadData.utmData?.source,
        utm_medium: leadData.utmData?.medium,
        utm_campaign: leadData.utmData?.campaign,
      };

      // Filter out undefined values
      const filteredProperties = Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => value !== undefined)
      );

      const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: filteredProperties,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `HubSpot API error: ${error}` };
      }

      const result = await response.json();
      return { success: true, id: result.id };
    } catch (error) {
      return { success: false, error: `HubSpot error: ${error}` };
    }
  }

  async updateLead(id: string, data: Partial<LeadData>): Promise<{ success: boolean; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'HubSpot not configured' };
    }

    try {
      const properties = {
        email: data.email,
        firstname: data.firstName,
        lastname: data.lastName,
        company: data.company,
        phone: data.phone,
        jobtitle: data.jobTitle,
        industry: data.industry,
        company_size: data.companySize,
      };

      const filteredProperties = Object.fromEntries(
        Object.entries(properties).filter(([_, value]) => value !== undefined)
      );

      const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          properties: filteredProperties,
        }),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `HubSpot API error: ${error}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `HubSpot error: ${error}` };
    }
  }

  async getLead(id: string): Promise<{ success: boolean; data?: any; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'HubSpot not configured' };
    }

    try {
      const response = await fetch(`https://api.hubapi.com/crm/v3/objects/contacts/${id}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `HubSpot API error: ${error}` };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: `HubSpot error: ${error}` };
    }
  }
}

// CRM Manager
export class CRMManager {
  private static instance: CRMManager;
  private providers: Map<string, CRMProvider> = new Map();

  static getInstance(): CRMManager {
    if (!CRMManager.instance) {
      CRMManager.instance = new CRMManager();
    }
    return CRMManager.instance;
  }

  initialize() {
    // Initialize available providers
    if (integrationsConfig.crm.hubspot.enabled) {
      this.providers.set('hubspot', new HubSpotProvider());
    }

    console.log(`CRM Manager initialized with ${this.providers.size} providers`);
  }

  // Create lead in both our database and external CRM
  async createLead(leadData: LeadData): Promise<{ success: boolean; id?: string; error?: string }> {
    try {
      // First, store in our database
      const { data: dbLead, error: dbError } = await supabase
        .from('leads')
        .insert({
          email: leadData.email,
          first_name: leadData.firstName,
          last_name: leadData.lastName,
          company: leadData.company,
          phone: leadData.phone,
          job_title: leadData.jobTitle,
          industry: leadData.industry,
          company_size: leadData.companySize,
          source: leadData.source,
          campaign: leadData.campaign,
          utm_source: leadData.utmData?.source,
          utm_medium: leadData.utmData?.medium,
          utm_campaign: leadData.utmData?.campaign,
          utm_term: leadData.utmData?.term,
          utm_content: leadData.utmData?.content,
          page_url: leadData.pageUrl,
          referrer: leadData.referrer,
          user_agent: leadData.userAgent,
          ip_address: leadData.ipAddress,
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error creating lead:', dbError);
        return { success: false, error: 'Failed to store lead in database' };
      }

      // Then sync to external CRM systems
      const crmResults = await Promise.allSettled(
        Array.from(this.providers.entries()).map(async ([name, provider]) => {
          const result = await provider.createLead(leadData);
          return { name, result };
        })
      );

      // Log CRM sync results
      crmResults.forEach((result) => {
        if (result.status === 'fulfilled') {
          const { name, result: crmResult } = result.value;
          if (!crmResult.success) {
            console.warn(`CRM ${name} sync failed:`, crmResult.error);
          }
        }
      });

      return { success: true, id: dbLead.id };
    } catch (error) {
      console.error('Error creating lead:', error);
      return { success: false, error: 'Unexpected error creating lead' };
    }
  }

  // Get available CRM providers
  getProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  // Get specific provider
  getProvider(name: string): CRMProvider | undefined {
    return this.providers.get(name);
  }
}

// Export singleton instance
export const crmManager = CRMManager.getInstance();