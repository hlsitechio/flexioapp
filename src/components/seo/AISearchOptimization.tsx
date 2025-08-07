import { Helmet } from 'react-helmet-async';

interface AISearchOptimizationProps {
  pageType: 'homepage' | 'product' | 'feature' | 'pricing' | 'about' | 'contact' | 'blog' | 'documentation';
  primaryKeywords: string[];
  contentCategory: string;
  businessContext?: string;
}

export function AISearchOptimization({ 
  pageType, 
  primaryKeywords, 
  contentCategory,
  businessContext = 'business intelligence software'
}: AISearchOptimizationProps) {
  
  const generateAIMetaTags = () => {
    const baseKeywords = [
      'business intelligence',
      'analytics dashboard',
      'data visualization',
      'enterprise software',
      'productivity tools'
    ];

    const allKeywords = [...new Set([...primaryKeywords, ...baseKeywords])];
    
    return {
      'ai:purpose': contentCategory,
      'ai:content-type': pageType,
      'ai:keywords': allKeywords.join(', '),
      'ai:business-context': businessContext,
      'ai:target-users': 'business professionals, data analysts, project managers, executives',
      'ai:use-cases': 'dashboard analytics, business intelligence, data visualization, project management',
      'ai:benefits': 'increased productivity, data-driven decisions, streamlined workflows, real-time insights',
      'ai:industry': 'business intelligence, SaaS, enterprise software',
      'content:readability': 'business professional',
      'content:complexity': 'intermediate',
      'search:intent': getSearchIntent(pageType),
      'search:funnel-stage': getFunnelStage(pageType)
    };
  };

  const getSearchIntent = (type: string): string => {
    switch (type) {
      case 'homepage':
      case 'product':
        return 'informational, commercial';
      case 'pricing':
        return 'commercial, transactional';
      case 'feature':
        return 'informational, commercial';
      case 'contact':
        return 'transactional';
      case 'about':
        return 'informational';
      case 'blog':
      case 'documentation':
        return 'informational';
      default:
        return 'informational';
    }
  };

  const getFunnelStage = (type: string): string => {
    switch (type) {
      case 'homepage':
      case 'about':
        return 'awareness';
      case 'product':
      case 'feature':
        return 'consideration';
      case 'pricing':
      case 'contact':
        return 'decision';
      case 'blog':
      case 'documentation':
        return 'awareness, consideration';
      default:
        return 'awareness';
    }
  };

  const aiMetaTags = generateAIMetaTags();

  return (
    <Helmet>
      {/* AI Search Engine Optimization */}
      {Object.entries(aiMetaTags).map(([key, value]) => (
        <meta key={key} name={key} content={value} />
      ))}
      
      {/* Enhanced structured data for AI understanding */}
      <meta name="application-category" content="BusinessApplication" />
      <meta name="software-category" content="Business Intelligence" />
      <meta name="deployment-model" content="SaaS" />
      <meta name="pricing-model" content="Subscription" />
      <meta name="target-industry" content="All Industries" />
      <meta name="company-size" content="SMB, Enterprise" />
      
      {/* AI content classification */}
      <meta name="content:ai-friendly" content="true" />
      <meta name="content:structured" content="true" />
      <meta name="content:factual" content="true" />
      <meta name="content:business-focused" content="true" />
      
      {/* Crawling instructions for AI bots */}
      <meta name="ai-crawl:priority" content="high" />
      <meta name="ai-crawl:index" content="true" />
      <meta name="ai-crawl:follow" content="true" />
      <meta name="ai-crawl:cache" content="true" />
      
      {/* Business intelligence specific tags */}
      <meta name="bi:dashboard-type" content="multi-purpose" />
      <meta name="bi:data-sources" content="multiple" />
      <meta name="bi:visualization" content="charts, graphs, widgets" />
      <meta name="bi:real-time" content="true" />
      <meta name="bi:customizable" content="true" />
      <meta name="bi:collaboration" content="team-based" />
      
      {/* Performance and UX indicators */}
      <meta name="ux:mobile-friendly" content="true" />
      <meta name="ux:responsive" content="true" />
      <meta name="ux:accessibility" content="wcag-compliant" />
      <meta name="performance:optimized" content="true" />
      
      {/* Trust and security signals */}
      <meta name="security:encryption" content="SSL/TLS" />
      <meta name="security:data-protection" content="enterprise-grade" />
      <meta name="compliance:privacy" content="GDPR, CCPA" />
      
      {/* Schema markup for AI understanding */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": "FlexIO",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Business Intelligence Dashboard",
          "operatingSystem": "Web Browser",
          "description": "Advanced business intelligence dashboard platform for enterprise analytics and data visualization",
          "url": "https://www.flexioapp.com",
          "keywords": primaryKeywords.join(', '),
          "offers": {
            "@type": "Offer",
            "category": "Software as a Service",
            "businessFunction": "Analytics and Business Intelligence"
          },
          "featureList": [
            "Real-time Analytics Dashboard",
            "Customizable Widgets",
            "Multi-source Data Integration",
            "Team Collaboration Tools",
            "Automated Reporting",
            "Mobile-Responsive Design"
          ],
          "audience": {
            "@type": "BusinessAudience",
            "audienceType": "Business Professionals"
          }
        })}
      </script>
    </Helmet>
  );
}