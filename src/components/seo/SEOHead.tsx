import React from 'react';

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

  // Update document head directly
  React.useEffect(() => {
    document.title = fullTitle;
    
    // Update meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', aiDescription);
    
    // Update canonical URL
    if (fullCanonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.setAttribute('rel', 'canonical');
        document.head.appendChild(canonical);
      }
      canonical.setAttribute('href', fullCanonicalUrl);
    }

    // Update keywords
    if (keywords.length > 0) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords.join(', '));
    }
  }, [fullTitle, aiDescription, fullCanonicalUrl, keywords]);

  return null;
}