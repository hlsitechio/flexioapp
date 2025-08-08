import { Card, CardContent } from '@/components/ui/card';
import { Zap, Settings, BarChart } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';

export function FeaturesPage() {
  return (
    <div className="min-h-screen w-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <SEOHead
        title="FlexIO Features — Powerful Productivity Tools"
        description="Explore FlexIO features: core tools, customization, and analytics for modern teams."
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/features'}
      />

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              Powerful Features
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Discover all the features that make FlexIO the ultimate productivity platform for modern teams.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto shadow-xl">
            <CardContent className="p-8 sm:p-10 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're preparing a comprehensive overview of all FlexIO features, including detailed 
                  explanations, use cases, and interactive demonstrations.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Zap className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Core Features</h3>
                  <p className="text-sm text-muted-foreground">Essential productivity tools</p>
                </div>
                <div className="space-y-2">
                  <Settings className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Customization</h3>
                  <p className="text-sm text-muted-foreground">Tailored to your workflow</p>
                </div>
                <div className="space-y-2">
                  <BarChart className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Analytics</h3>
                  <p className="text-sm text-muted-foreground">Data-driven insights</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
