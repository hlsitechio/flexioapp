export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemap(): string {
  const baseUrl = 'https://www.flexioapp.com';
  const now = new Date().toISOString();

  const urls: SitemapEntry[] = [
    // High-priority marketing pages
    { url: '/', lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: '/landing', lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: '/features', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: '/pricing', lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: '/demo', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    
    // Company pages
    { url: '/about', lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: '/careers', lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: '/blog', lastModified: now, changeFrequency: 'daily', priority: 0.8 },
    
    // Product pages
    { url: '/integrations', lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: '/analytics', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    
    // Support pages
    { url: '/documentation', lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
    { url: '/help-center', lastModified: now, changeFrequency: 'weekly', priority: 0.6 },
    { url: '/contact', lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    
    // Legal pages
    { url: '/privacy-policy', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
    { url: '/terms-of-service', lastModified: now, changeFrequency: 'yearly', priority: 0.3 },
  ];

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urls.map(entry => `  <url>
    <loc>${baseUrl}${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemapXml;
}

export function generateRobotsTxt(): string {
  return `# FlexIO Robots.txt - Enterprise SEO Optimized
# Updated: ${new Date().toISOString().split('T')[0]} - Comprehensive crawling strategy for maximum search visibility

# === PREMIUM SEARCH ENGINES ===
# Major search engines with optimized crawl rates
User-agent: Googlebot
Allow: /
Crawl-delay: 0.5

User-agent: Bingbot  
Allow: /
Crawl-delay: 1

User-agent: YandexBot
Allow: /
Crawl-delay: 2

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

User-agent: Baiduspider
Allow: /
Crawl-delay: 2

# === AI SEARCH ENGINES ===
# AI-powered search and language models
User-agent: ChatGPT-User
Allow: /

User-agent: GPTBot
Allow: /

User-agent: Claude-Web
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: YouBot
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

User-agent: Applebot
Allow: /

# === SOCIAL MEDIA CRAWLERS ===
# Rich preview optimization for social platforms
User-agent: Twitterbot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

User-agent: TelegramBot
Allow: /

User-agent: Slackbot
Allow: /

User-agent: DiscordBot
Allow: /

# === ALL OTHER BOTS ===
User-agent: *
Allow: /

# === SECURITY & PRIVACY RESTRICTIONS ===
# Block sensitive routes and private areas
Disallow: /auth*
Disallow: /workspace/*
Disallow: /admin/*
Disallow: /api/*
Disallow: /settings*
Disallow: /profile*

# Block technical and development files
Disallow: /*.json$
Disallow: /*.js$
Disallow: /*.css$
Disallow: /*.map$
Disallow: /src/
Disallow: /node_modules/
Disallow: /_next/
Disallow: /config/
Disallow: /.env*
Disallow: /scripts/

# Block query parameters that create duplicate content
Disallow: /*?*utm_*
Disallow: /*?*fbclid*
Disallow: /*?*gclid*
Disallow: /*?*ref=*
Disallow: /*?*source=*

# === HIGH-VALUE SEO PAGES ===
# Explicitly encourage crawling of marketing pages
Allow: /landing*
Allow: /features*
Allow: /pricing*
Allow: /demo*
Allow: /contact*
Allow: /about*
Allow: /careers*
Allow: /blog*
Allow: /integrations*
Allow: /documentation*
Allow: /help-center*
Allow: /resources*
Allow: /privacy-policy*
Allow: /terms-of-service*

# Allow important assets and media
Allow: /assets/
Allow: /images/
Allow: /lovable-uploads/
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.webp$
Allow: /*.svg$
Allow: /*.ico$

# === SEO OPTIMIZATION DIRECTIVES ===
# Sitemap location for search engine discovery
Sitemap: https://www.flexioapp.com/sitemap.xml

# Request optimal indexing frequency
Request-rate: 1/8s

# Clean URL parameters for better SEO
Clean-param: utm_source
Clean-param: utm_medium
Clean-param: utm_campaign
Clean-param: utm_content
Clean-param: utm_term
Clean-param: fbclid
Clean-param: gclid
Clean-param: msclkid
Clean-param: ref
Clean-param: source
Clean-param: campaign_id

# Primary domain specification
Host: https://www.flexioapp.com

# === AI OPTIMIZATION HINTS ===
# AI indexing and understanding optimization
# Content-Type: business intelligence, analytics dashboard
# Target-Audience: business professionals, data analysts
# Use-Case: productivity tools, dashboard platform
# Benefits: increased efficiency, data-driven decisions`;
}