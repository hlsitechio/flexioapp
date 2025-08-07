import { ReactNode } from 'react';

interface AIOptimizedContentProps {
  children: ReactNode;
  topic?: string;
  context?: string;
  intent?: 'informational' | 'navigational' | 'commercial' | 'transactional';
  entities?: string[];
  className?: string;
}

export function AIOptimizedContent({ 
  children, 
  topic, 
  context, 
  intent = 'informational',
  entities = [],
  className = ""
}: AIOptimizedContentProps) {
  // Generate semantic markup for AI understanding
  const generateSemanticAttributes = () => {
    const attributes: Record<string, string> = {};
    
    if (topic) {
      attributes['data-ai-topic'] = topic;
    }
    
    if (context) {
      attributes['data-ai-context'] = context;
    }
    
    attributes['data-ai-intent'] = intent;
    
    if (entities.length > 0) {
      attributes['data-ai-entities'] = entities.join(',');
    }
    
    return attributes;
  };

  return (
    <div 
      className={className}
      {...generateSemanticAttributes()}
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      {children}
    </div>
  );
}

// Specialized AI-optimized components
export function AIFeatureSection({ 
  title, 
  description, 
  features,
  className = ""
}: {
  title: string;
  description: string;
  features: Array<{ name: string; description: string; benefit: string }>;
  className?: string;
}) {
  return (
    <AIOptimizedContent
      topic="business intelligence features"
      context="product capabilities"
      intent="commercial"
      entities={['dashboard', 'analytics', 'business intelligence']}
      className={className}
    >
      <section itemScope itemType="https://schema.org/Product">
        <h2 className="text-3xl font-bold text-foreground mb-4" itemProp="name">
          {title}
        </h2>
        <p className="text-lg text-muted-foreground mb-8" itemProp="description">
          {description}
        </p>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-card p-6 rounded-lg border"
              itemScope
              itemType="https://schema.org/DigitalDocument"
            >
              <h3 className="text-xl font-semibold text-foreground mb-3" itemProp="name">
                {feature.name}
              </h3>
              <p className="text-muted-foreground mb-4" itemProp="description">
                {feature.description}
              </p>
              <div 
                className="text-sm text-primary font-medium"
                data-ai-benefit={feature.benefit}
              >
                ✓ {feature.benefit}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AIOptimizedContent>
  );
}

export function AIBenefitsSection({
  title,
  benefits,
  className = ""
}: {
  title: string;
  benefits: Array<{ title: string; description: string; metric?: string }>;
  className?: string;
}) {
  return (
    <AIOptimizedContent
      topic="business intelligence benefits"
      context="value proposition"
      intent="commercial"
      entities={['ROI', 'efficiency', 'productivity', 'analytics']}
      className={className}
    >
      <section>
        <h2 className="text-3xl font-bold text-foreground text-center mb-12">
          {title}
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="text-center"
              itemScope
              itemType="https://schema.org/Claim"
            >
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-primary font-bold">
                  {index + 1}
                </span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3" itemProp="name">
                {benefit.title}
              </h3>
              <p className="text-muted-foreground" itemProp="description">
                {benefit.description}
              </p>
              {benefit.metric && (
                <div className="mt-3 text-primary font-semibold" data-ai-metric={benefit.metric}>
                  {benefit.metric}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </AIOptimizedContent>
  );
}