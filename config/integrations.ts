export const integrationsConfig = {
  // Supabase Configuration
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL,
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    projectId: import.meta.env.VITE_SUPABASE_PROJECT_ID,
    realtime: {
      enabled: true,
      heartbeatInterval: 30000,
      reconnectInterval: 5000,
    },
    storage: {
      maxFileSize: 50 * 1024 * 1024, // 50MB
      allowedTypes: ['image/*', 'text/*', 'application/json', 'application/pdf'],
    },
  },

  // Analytics Integrations
  analytics: {
    vercel: {
      enabled: true,
      debug: false,
    },
    googleAnalytics: {
      enabled: false, // Will be enabled when GA4 is set up
      measurementId: '', // GA4 Measurement ID
      config: {
        send_page_view: true,
        anonymize_ip: true,
        cookie_domain: 'auto',
        cookie_expires: 63072000, // 2 years
      },
    },
    mixpanel: {
      enabled: false,
      token: '', // Mixpanel project token
      config: {
        track_pageview: true,
        persistence: 'localStorage',
        ignore_dnt: false,
      },
    },
  },

  // Error Monitoring
  sentry: {
    enabled: false, // Enable in production
    dsn: '', // Sentry DSN
    environment: import.meta.env.MODE,
    config: {
      tracesSampleRate: 0.1,
      replaysSessionSampleRate: 0.1,
      replaysOnErrorSampleRate: 1.0,
      beforeSend: (event: any) => {
        // Filter out development errors
        if (import.meta.env.DEV) {
          return null;
        }
        return event;
      },
    },
  },

  // Email Services
  email: {
    resend: {
      enabled: true, // Enable Resend by default
      apiKey: '', // Resend API Key (configured in Supabase Edge Functions)
      fromEmail: 'noreply@yourdomain.com',
      fromName: 'Your BI Platform',
      templates: {
        welcome: '',
        resetPassword: '',
        emailVerification: '',
        notification: '',
      },
    },
    sendgrid: {
      enabled: false,
      apiKey: '', // SendGrid API Key
      fromEmail: 'noreply@yourdomain.com',
      fromName: 'Your BI Platform',
      templates: {
        welcome: '',
        resetPassword: '',
        emailVerification: '',
        notification: '',
      },
    },
    mailchimp: {
      enabled: false,
      apiKey: '', // Mailchimp API Key
      serverPrefix: '', // e.g., 'us1'
      listId: '', // Default list ID
    },
  },

  // CRM Integrations
  crm: {
    hubspot: {
      enabled: false,
      apiKey: '', // HubSpot Private App Access Token
      portalId: '', // HubSpot Portal ID
      forms: {
        contactForm: '',
        newsletterSignup: '',
        demoRequest: '',
      },
    },
    salesforce: {
      enabled: false,
      clientId: '', // Salesforce Connected App Client ID
      clientSecret: '', // Salesforce Connected App Client Secret
      username: '', // Salesforce Username
      password: '', // Salesforce Password + Security Token
      sandbox: true, // Use sandbox environment
    },
  },

  // Support & Chat
  support: {
    intercom: {
      enabled: false,
      appId: '', // Intercom App ID
      config: {
        hide_default_launcher: false,
        alignment: 'right',
        horizontal_padding: 20,
        vertical_padding: 20,
      },
    },
    zendesk: {
      enabled: false,
      subdomain: '', // Zendesk subdomain
      apiToken: '', // Zendesk API Token
      email: '', // Zendesk admin email
    },
  },

  // Payment Processing
  payment: {
    stripe: {
      enabled: false,
      publicKey: '', // Stripe Publishable Key
      secretKey: '', // Stripe Secret Key (server-side only)
      webhookSecret: '', // Stripe Webhook Secret
      currency: 'usd',
      locale: 'en',
    },
  },

  // Social Media
  social: {
    twitter: {
      enabled: false,
      bearerToken: '', // Twitter API Bearer Token
      apiKey: '', // Twitter API Key
      apiSecret: '', // Twitter API Secret
    },
    linkedin: {
      enabled: false,
      clientId: '', // LinkedIn Client ID
      clientSecret: '', // LinkedIn Client Secret
    },
  },

  // Storage & CDN
  storage: {
    aws: {
      enabled: false,
      accessKeyId: '', // AWS Access Key ID
      secretAccessKey: '', // AWS Secret Access Key
      region: 'us-east-1',
      bucket: '', // S3 Bucket Name
    },
    cloudinary: {
      enabled: false,
      cloudName: '', // Cloudinary Cloud Name
      apiKey: '', // Cloudinary API Key
      apiSecret: '', // Cloudinary API Secret
    },
  },
};