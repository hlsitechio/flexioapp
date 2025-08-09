import { SEOHead } from '@/components/seo/SEOHead';
import { StructuredData } from '@/components/seo/StructuredData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

export function LandingPage2() {
  const canonical = typeof window !== 'undefined' ? window.location.pathname : '/landing-2';
  return (
    <div className="bg-background text-foreground">
      <SEOHead
        title="Modern Landing Page - FlexIO"
        description="A clean, static SaaS landing page layout without animations."
        canonicalUrl={canonical}
      />
      <StructuredData type="website" />

      <main>
        {/* Hero */}
        <section className="container mx-auto px-6 sm:px-8 lg:px-12 py-16 sm:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Modern SaaS Landing Page (No Animations)
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg mb-8 max-w-prose">
                This is a standard React landing page structure: hero, features, social proof, and a simple email capture. No animations—just clean layout and accessible components.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild>
                  <Link to="/workspace-selection">Get Started</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/features">View Features</Link>
                </Button>
              </div>
            </div>

            {/* Placeholder visual (no image) */}
            <div className="rounded-xl border border-border bg-card p-4">
              <div className="aspect-[16/9] w-full rounded-lg bg-muted/40 flex items-center justify-center text-muted-foreground">
                Placeholder for hero image or product screenshot
              </div>
            </div>
          </div>
        </section>

        {/* Email capture */}
        <section className="container mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-2">Stay in the loop</h2>
            <p className="text-muted-foreground mb-6 max-w-prose">
              Join our newsletter to receive product updates and best practices. No spam, unsubscribe anytime.
            </p>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={(e) => e.preventDefault()}>
              <Input type="email" required placeholder="your@email.com" aria-label="Email address" />
              <Button type="submit">Subscribe</Button>
            </form>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 sm:px-8 lg:px-12 pb-16 sm:pb-24">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map((i) => (
              <article key={i} className="rounded-xl border border-border bg-card p-6">
                <div className="h-10 w-10 rounded-md bg-primary/10 mb-4" aria-hidden />
                <h3 className="text-lg font-semibold mb-2">Feature {i}</h3>
                <p className="text-sm text-muted-foreground">
                  Brief description explaining the value proposition for this feature in simple terms.
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Social proof */}
        <section className="container mx-auto px-6 sm:px-8 lg:px-12 pb-24">
          <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
            <h2 className="text-2xl font-semibold mb-2">What users say</h2>
            <p className="text-muted-foreground mb-6 max-w-prose">
              A short testimonial block helps build trust and credibility.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <blockquote className="rounded-lg border border-border p-5 bg-background">
                “FlexIO makes building dashboards simple and efficient.”
                <footer className="mt-3 text-sm text-muted-foreground">— Product Manager</footer>
              </blockquote>
              <blockquote className="rounded-lg border border-border p-5 bg-background">
                “Clean UI, fast performance, and great developer experience.”
                <footer className="mt-3 text-sm text-muted-foreground">— Tech Lead</footer>
              </blockquote>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
