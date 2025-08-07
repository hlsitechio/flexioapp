import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string[];
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  articleSection?: string;
  noindex?: boolean;
  aiOptimized?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords = [],
  canonicalUrl,
  ogImage = '/assets/flexio-logo-f.png',
  ogType = 'website',
  publishedTime,
  modifiedTime,
  author,
  articleSection,
  noindex = false,
  aiOptimized = true
}: SEOHeadProps) {
  const siteUrl = 'https://www.flexioapp.com';
  const fullTitle = title.includes('FlexIO') ? title : `${title} | FlexIO`;
  const fullCanonicalUrl = canonicalUrl ? `${siteUrl}${canonicalUrl}` : undefined;
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${siteUrl}${ogImage}`;

  // AI-optimized description with structured formatting
  const aiDescription = aiOptimized 
    ? `${description} FlexIO provides comprehensive business intelligence solutions including analytics dashboards, data visualization, and project management tools for enterprises.`
    : description;

  return (
    <Helmet>
      {/* Primary Meta Tags - AI Optimized */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={aiDescription} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      
      {/* AI Search Optimization */}
      {aiOptimized && (
        <>
          <meta name="ai-purpose" content="business intelligence dashboard analytics" />
          <meta name="ai-content-type" content="product information" />
          <meta name="ai-target-audience" content="business professionals, data analysts, project managers" />
          <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large, max-snippet:-1"} />
        </>
      )}

      {/* Canonical URL */}
      {fullCanonicalUrl && <link rel="canonical" href={fullCanonicalUrl} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={fullCanonicalUrl || siteUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:site_name" content="FlexIO" />

      {/* Article specific */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
        </>
      )}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={fullCanonicalUrl || siteUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={fullOgImage} />

      {/* AI-Optimized Structured Markup */}
      <meta name="application-name" content="FlexIO" />
      <meta name="theme-color" content="#0066cc" />
      <meta name="format-detection" content="telephone=no" />
      
      {/* Schema.org for Search Engines */}
      <meta itemProp="name" content={fullTitle} />
      <meta itemProp="description" content={description} />
      <meta itemProp="image" content={fullOgImage} />
    </Helmet>
  );
}