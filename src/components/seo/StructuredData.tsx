import { Helmet } from 'react-helmet-async';

export interface OrganizationStructuredDataProps {
  type?: 'organization' | 'website' | 'product' | 'article' | 'faq';
  name?: string;
  description?: string;
  url?: string;
  logo?: string;
  contactPoint?: {
    telephone?: string;
    email?: string;
    contactType?: string;
  };
  sameAs?: string[];
  foundingDate?: string;
  employees?: string;
  industry?: string;
}

export interface ProductStructuredDataProps {
  name: string;
  description: string;
  brand: string;
  category: string;
  offers?: {
    price?: string;
    currency?: string;
    availability?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface ArticleStructuredDataProps {
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  publisher: string;
  url: string;
}

interface StructuredDataProps {
  type: 'organization' | 'website' | 'product' | 'article' | 'faq';
  data?: OrganizationStructuredDataProps | ProductStructuredDataProps | ArticleStructuredDataProps | any;
}

export function StructuredData({ type, data = {} }: StructuredDataProps) {
  const generateOrganizationData = () => ({
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "FlexIO",
    "description": "Advanced Business Intelligence Dashboard Platform for Enterprise Analytics and Data Visualization",
    "url": "https://www.flexioapp.com",
    "logo": "https://www.flexioapp.com/assets/flexio-logo-f.png",
    "foundingDate": "2024",
    "industry": "Business Intelligence Software",
    "numberOfEmployees": "11-50",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": "support@flexioapp.com",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://www.linkedin.com/company/flexio",
      "https://twitter.com/flexioapp"
    ],
    "offers": {
      "@type": "Offer",
      "name": "FlexIO Business Intelligence Platform",
      "description": "Comprehensive dashboard solution for business analytics",
      "category": "Software as a Service"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "FlexIO Products",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "SoftwareApplication",
            "name": "FlexIO Analytics Dashboard",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web Browser"
          }
        }
      ]
    },
    ...data
  });

  const generateWebsiteData = () => ({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "FlexIO",
    "description": "Business Intelligence Dashboard Platform",
    "url": "https://www.flexioapp.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://www.flexioapp.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "publisher": {
      "@type": "Organization",
      "name": "FlexIO"
    },
    ...data
  });

  const generateProductData = (productData: ProductStructuredDataProps) => ({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": productData.name,
    "description": productData.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "brand": {
      "@type": "Brand",
      "name": productData.brand
    },
    "offers": productData.offers ? {
      "@type": "Offer",
      "price": productData.offers.price,
      "priceCurrency": productData.offers.currency || "USD",
      "availability": productData.offers.availability || "https://schema.org/InStock"
    } : undefined,
    "aggregateRating": productData.aggregateRating ? {
      "@type": "AggregateRating",
      "ratingValue": productData.aggregateRating.ratingValue,
      "reviewCount": productData.aggregateRating.reviewCount
    } : undefined,
    ...data
  });

  const generateArticleData = (articleData: ArticleStructuredDataProps) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": articleData.headline,
    "description": articleData.description,
    "author": {
      "@type": "Person",
      "name": articleData.author
    },
    "publisher": {
      "@type": "Organization",
      "name": articleData.publisher,
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.flexioapp.com/assets/flexio-logo-f.png"
      }
    },
    "datePublished": articleData.datePublished,
    "dateModified": articleData.dateModified || articleData.datePublished,
    "image": articleData.image,
    "url": articleData.url,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": articleData.url
    },
    ...data
  });

  const generateFAQData = () => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is FlexIO?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FlexIO is an advanced business intelligence dashboard platform that provides comprehensive analytics, data visualization, and project management tools for enterprises."
        }
      },
      {
        "@type": "Question", 
        "name": "How does FlexIO help with business analytics?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FlexIO offers real-time analytics dashboards, customizable widgets, data integration capabilities, and advanced reporting features to help businesses make data-driven decisions."
        }
      },
      {
        "@type": "Question",
        "name": "What integrations does FlexIO support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "FlexIO integrates with popular business tools including CRM systems, project management platforms, and various data sources to provide a unified dashboard experience."
        }
      }
    ],
    ...data
  });

  const getStructuredData = () => {
    switch (type) {
      case 'organization':
        return generateOrganizationData();
      case 'website':
        return generateWebsiteData();
      case 'product':
        return generateProductData(data as ProductStructuredDataProps);
      case 'article':
        return generateArticleData(data as ArticleStructuredDataProps);
      case 'faq':
        return generateFAQData();
      default:
        return generateOrganizationData();
    }
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(getStructuredData())}
      </script>
    </Helmet>
  );
}