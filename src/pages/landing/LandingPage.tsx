import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LeadCaptureForm } from '@/components/forms';
import { CheckCircle, ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Your Platform</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/60 hover:text-foreground transition-colors">Features</a>
              <a href="#pricing" className="text-foreground/60 hover:text-foreground transition-colors">Pricing</a>
              <a href="/contact" className="text-foreground/60 hover:text-foreground transition-colors">Contact</a>
              <Button variant="outline" asChild>
                <a href="/demo">Request Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight">
                  Transform Your Business with{' '}
                  <span className="text-primary">Next-Gen Technology</span>
                </h1>
                <p className="text-lg lg:text-xl text-muted-foreground max-w-xl">
                  Streamline operations, boost productivity, and accelerate growth with our innovative platform trusted by thousands of businesses worldwide.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="/demo">Watch Demo</a>
                </Button>
              </div>

              <div className="flex items-center flex-wrap gap-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="lg:justify-self-end w-full max-w-md">
              <LeadCaptureForm source="homepage_hero" campaign="landing_page" />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 border-y bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8">
            <p className="text-muted-foreground">Trusted by innovative companies worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-60">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-muted rounded flex items-center justify-center">
                  <span className="text-sm font-medium">Company {i}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-sm font-medium">4.9/5 from 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Everything you need to succeed</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help your business grow faster and more efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Built for speed with cutting-edge technology that delivers results in real-time.
              </p>
            </Card>

            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Enterprise Security</h3>
              <p className="text-muted-foreground">
                Bank-level security with end-to-end encryption and compliance certifications.
              </p>
            </Card>

            <Card className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Team Collaboration</h3>
              <p className="text-muted-foreground">
                Work together seamlessly with real-time collaboration and communication tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">
            Ready to transform your business?
          </h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of businesses that have already revolutionized their operations with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Start Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <a href="/demo">Schedule Demo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Your Platform</h3>
              <p className="text-sm text-muted-foreground">
                Empowering businesses worldwide with innovative technology solutions.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="/demo" className="hover:text-foreground transition-colors">Demo</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-medium">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}