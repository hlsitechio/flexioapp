// Security configuration for production deployment
// This should be implemented at the server/CDN level (e.g., Vercel, Netlify)

export const productionSecurityHeaders = {
  // Prevent clickjacking
  'X-Frame-Options': 'DENY',
  
  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',
  
  // XSS Protection (legacy but still useful)
  'X-XSS-Protection': '1; mode=block',
  
  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  
  // Permissions policy
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=()',
  
  // HSTS (only for HTTPS)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel-analytics.com https://*.googletagmanager.com https://www.googletagmanager.com https://px.ads.linkedin.com https://snap.licdn.com https://cdn.gpteng.co https://connect.facebook.net",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com",
    "img-src 'self' data: https:",
    "connect-src 'self' wss: ws: https://*.supabase.co wss://*.supabase.co https://*.vercel-analytics.com https://*.googleanalytics.com https://px.ads.linkedin.com https://www.facebook.com https://lovable-api.com https://*.lovable.dev",
    "frame-src 'none'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'"
  ].join('; ')
};

// Vercel headers configuration (vercel.json)
export const vercelConfig = {
  "headers": [
    {
      "source": "/(.*)",
      "headers": Object.entries(productionSecurityHeaders).map(([key, value]) => ({
        "key": key,
        "value": value
      }))
    }
  ]
};

// For development, these headers are set in vite.config.ts
export const developmentSecurityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
};