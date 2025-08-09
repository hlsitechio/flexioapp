import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, Crown, Star, Check } from 'lucide-react';
import { SEOHead } from '@/components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { PricingToggle } from '@/components/pricing/PricingToggle';
import { UsageCalculator } from '@/components/pricing/UsageCalculator';
export function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  return (
  <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      <SEOHead
        title="FlexIO Pricing — Free, Pro, Premium"
        description="Simple pricing for every team: Free, Pro, and Premium plans. Start free and scale when you’re ready."
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/pricing'}
      />

      <header className="py-20 lg:py-28 px-8 sm:px-12 lg:px-16 text-center">
        <div className="max-w-[1200px] mx-auto space-y-6">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">Pricing Plans</h1>
          <p className="text-lg lg:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Choose the perfect plan for your workflow. Start free and upgrade as you grow.
          </p>
          <div className="pt-2 flex justify-center">
            <PricingToggle value={billingCycle} onChange={setBillingCycle} />
          </div>
        </div>
      </header>

      <main className="pb-24 px-8 sm:px-12 lg:px-16">
        <section aria-labelledby="pricing-section" className="max-w-[1200px] mx-auto">
          <h2 id="pricing-section" className="sr-only">Plans and pricing</h2>
          <div className="grid gap-6 sm:gap-8 md:grid-cols-3">
            {/* Free */}
            <Card className="border border-border/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-6 w-6 text-primary" aria-hidden="true" />
                  <CardTitle>Free</CardTitle>
                </div>
                <CardDescription>Everything you need to get started</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/ forever</span>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    'Core widgets and dashboards',
                    'Up to 2 workspaces',
                    'Community support',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <Link to="/workspace-selection">Get Started Free</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Pro */}
            <Card className="relative border border-border/50 shadow-2xl ring-1 ring-primary/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs bg-primary text-primary-foreground">Most Popular</div>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-primary" aria-hidden="true" />
                  <CardTitle>Pro</CardTitle>
                </div>
                <CardDescription>Advanced features for growing teams</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-muted-foreground">/ user / month</span>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    'Everything in Free',
                    'Unlimited workspaces',
                    'Advanced analytics widgets',
                    'Priority support',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="gap-2">
                <Button asChild className="w-full">
                  <Link to="/workspace-selection">Start Pro</Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Premium */}
            <Card className="border border-border/50 shadow-xl">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-6 w-6 text-primary" aria-hidden="true" />
                  <CardTitle>Premium</CardTitle>
                </div>
                <CardDescription>For organizations needing custom solutions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold">Custom</span>
                  <span className="text-muted-foreground">pricing</span>
                </div>
                <ul className="space-y-3 text-sm">
                  {[
                    'Everything in Pro',
                    'Enterprise security and SSO',
                    'Custom integrations and SLAs',
                    'Dedicated success manager',
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-primary mt-0.5" aria-hidden="true" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>

          {/* Usage Calculator */}
          <div className="mt-12">
            <UsageCalculator billingCycle={billingCycle} />
          </div>

          {/* CTA bar */}
          <div className="mt-12 text-center">
            <p className="text-muted-foreground mb-4">Not sure which plan fits? Start free — you can upgrade anytime.</p>
            <Button asChild>
              <Link to="/workspace-selection">Start Free</Link>
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
