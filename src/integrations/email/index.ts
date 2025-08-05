import { integrationsConfig } from '../../../config/integrations';

// Email data interfaces
export interface EmailData {
  to: string | string[];
  from?: string;
  subject: string;
  text?: string;
  html?: string;
  templateId?: string;
  templateData?: Record<string, any>;
  tags?: string[];
  category?: string;
}

export interface NewsletterSubscriber {
  email: string;
  firstName?: string;
  lastName?: string;
  tags?: string[];
  interests?: string[];
  source?: string;
}

// Base email provider interface
export interface EmailProvider {
  initialize(): boolean;
  sendEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }>;
  sendTemplateEmail(templateId: string, to: string, data: Record<string, any>): Promise<{ success: boolean; error?: string }>;
}

// Newsletter provider interface
export interface NewsletterProvider {
  initialize(): boolean;
  subscribe(subscriber: NewsletterSubscriber): Promise<{ success: boolean; error?: string }>;
  unsubscribe(email: string): Promise<{ success: boolean; error?: string }>;
  updateSubscriber(email: string, data: Partial<NewsletterSubscriber>): Promise<{ success: boolean; error?: string }>;
}

// SendGrid Email Provider
class SendGridProvider implements EmailProvider {
  private apiKey: string;
  private fromEmail: string;
  private fromName: string;

  constructor() {
    this.apiKey = integrationsConfig.email.sendgrid.apiKey;
    this.fromEmail = integrationsConfig.email.sendgrid.fromEmail;
    this.fromName = integrationsConfig.email.sendgrid.fromName;
  }

  initialize(): boolean {
    return !!(this.apiKey && this.fromEmail);
  }

  async sendEmail(emailData: EmailData): Promise<{ success: boolean; id?: string; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'SendGrid not configured' };
    }

    try {
      const payload = {
        personalizations: [
          {
            to: Array.isArray(emailData.to) 
              ? emailData.to.map(email => ({ email }))
              : [{ email: emailData.to }],
            subject: emailData.subject,
            ...(emailData.templateData && { dynamic_template_data: emailData.templateData }),
          }
        ],
        from: {
          email: emailData.from || this.fromEmail,
          name: this.fromName,
        },
        ...(emailData.templateId && { template_id: emailData.templateId }),
        ...(emailData.html && { content: [{ type: 'text/html', value: emailData.html }] }),
        ...(emailData.text && !emailData.html && { content: [{ type: 'text/plain', value: emailData.text }] }),
        ...(emailData.tags && { categories: emailData.tags }),
      };

      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `SendGrid API error: ${error}` };
      }

      const messageId = response.headers.get('x-message-id');
      return { success: true, id: messageId || undefined };
    } catch (error) {
      return { success: false, error: `SendGrid error: ${error}` };
    }
  }

  async sendTemplateEmail(templateId: string, to: string, data: Record<string, any>): Promise<{ success: boolean; error?: string }> {
    return this.sendEmail({
      to,
      subject: '', // Subject comes from template
      templateId,
      templateData: data,
    });
  }
}

// Mailchimp Newsletter Provider
class MailchimpProvider implements NewsletterProvider {
  private apiKey: string;
  private serverPrefix: string;
  private listId: string;

  constructor() {
    this.apiKey = integrationsConfig.email.mailchimp.apiKey;
    this.serverPrefix = integrationsConfig.email.mailchimp.serverPrefix;
    this.listId = integrationsConfig.email.mailchimp.listId;
  }

  initialize(): boolean {
    return !!(this.apiKey && this.serverPrefix && this.listId);
  }

  async subscribe(subscriber: NewsletterSubscriber): Promise<{ success: boolean; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'Mailchimp not configured' };
    }

    try {
      const payload = {
        email_address: subscriber.email,
        status: 'subscribed',
        merge_fields: {
          FNAME: subscriber.firstName || '',
          LNAME: subscriber.lastName || '',
        },
        tags: subscriber.tags || [],
        interests: subscriber.interests ? 
          subscriber.interests.reduce((acc, interest) => ({ ...acc, [interest]: true }), {}) : {},
      };

      const response = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Mailchimp API error: ${error}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Mailchimp error: ${error}` };
    }
  }

  async unsubscribe(email: string): Promise<{ success: boolean; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'Mailchimp not configured' };
    }

    try {
      // Hash the email for Mailchimp API
      const crypto = await import('crypto');
      const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

      const response = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members/${emailHash}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: 'unsubscribed',
          }),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Mailchimp API error: ${error}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Mailchimp error: ${error}` };
    }
  }

  async updateSubscriber(email: string, data: Partial<NewsletterSubscriber>): Promise<{ success: boolean; error?: string }> {
    if (!this.initialize()) {
      return { success: false, error: 'Mailchimp not configured' };
    }

    try {
      const crypto = await import('crypto');
      const emailHash = crypto.createHash('md5').update(email.toLowerCase()).digest('hex');

      const payload = {
        merge_fields: {
          ...(data.firstName && { FNAME: data.firstName }),
          ...(data.lastName && { LNAME: data.lastName }),
        },
        ...(data.tags && { tags: data.tags }),
      };

      const response = await fetch(
        `https://${this.serverPrefix}.api.mailchimp.com/3.0/lists/${this.listId}/members/${emailHash}`,
        {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const error = await response.text();
        return { success: false, error: `Mailchimp API error: ${error}` };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: `Mailchimp error: ${error}` };
    }
  }
}

// Email Marketing Manager
export class EmailManager {
  private static instance: EmailManager;
  private emailProviders: Map<string, EmailProvider> = new Map();
  private newsletterProviders: Map<string, NewsletterProvider> = new Map();

  static getInstance(): EmailManager {
    if (!EmailManager.instance) {
      EmailManager.instance = new EmailManager();
    }
    return EmailManager.instance;
  }

  initialize() {
    // Initialize email providers
    if (integrationsConfig.email.sendgrid.enabled) {
      this.emailProviders.set('sendgrid', new SendGridProvider());
    }

    // Initialize newsletter providers
    if (integrationsConfig.email.mailchimp.enabled) {
      this.newsletterProviders.set('mailchimp', new MailchimpProvider());
    }

    console.log(`Email Manager initialized with ${this.emailProviders.size} email providers and ${this.newsletterProviders.size} newsletter providers`);
  }

  // Send transactional email
  async sendEmail(emailData: EmailData, providerName?: string): Promise<{ success: boolean; error?: string }> {
    const provider = providerName 
      ? this.emailProviders.get(providerName)
      : this.emailProviders.values().next().value;

    if (!provider) {
      return { success: false, error: 'No email provider available' };
    }

    return provider.sendEmail(emailData);
  }

  // Send template email
  async sendTemplateEmail(templateId: string, to: string, data: Record<string, any>, providerName?: string): Promise<{ success: boolean; error?: string }> {
    const provider = providerName 
      ? this.emailProviders.get(providerName)
      : this.emailProviders.values().next().value;

    if (!provider) {
      return { success: false, error: 'No email provider available' };
    }

    return provider.sendTemplateEmail(templateId, to, data);
  }

  // Newsletter subscription
  async subscribeToNewsletter(subscriber: NewsletterSubscriber, providerName?: string): Promise<{ success: boolean; error?: string }> {
    const provider = providerName 
      ? this.newsletterProviders.get(providerName)
      : this.newsletterProviders.values().next().value;

    if (!provider) {
      return { success: false, error: 'No newsletter provider available' };
    }

    return provider.subscribe(subscriber);
  }

  // Newsletter unsubscription
  async unsubscribeFromNewsletter(email: string, providerName?: string): Promise<{ success: boolean; error?: string }> {
    const provider = providerName 
      ? this.newsletterProviders.get(providerName)
      : this.newsletterProviders.values().next().value;

    if (!provider) {
      return { success: false, error: 'No newsletter provider available' };
    }

    return provider.unsubscribe(email);
  }

  // Get available providers
  getEmailProviders(): string[] {
    return Array.from(this.emailProviders.keys());
  }

  getNewsletterProviders(): string[] {
    return Array.from(this.newsletterProviders.keys());
  }
}

// Export singleton instance
export const emailManager = EmailManager.getInstance();