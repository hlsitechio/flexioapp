import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Crown, Star } from 'lucide-react';
import { PublicPageNav } from '@/components/shared';

export function PricingPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <PublicPageNav />

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Simple Pricing
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Choose the perfect plan for your team. Start free and upgrade as you grow.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <DollarSign className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're finalizing our pricing structure to ensure we offer the best value for teams of all sizes. 
                  Sign up for early access and special launch pricing.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Star className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Free Plan</h3>
                  <p className="text-sm text-muted-foreground">Perfect for getting started</p>
                </div>
                <div className="space-y-2">
                  <Crown className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Pro Plan</h3>
                  <p className="text-sm text-muted-foreground">Advanced features for teams</p>
                </div>
                <div className="space-y-2">
                  <DollarSign className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Enterprise</h3>
                  <p className="text-sm text-muted-foreground">Custom solutions</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}