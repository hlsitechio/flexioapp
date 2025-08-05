import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LeadCaptureForm } from '@/components/forms';
import { CheckCircle, ArrowRight, Star, Users, Shield, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">FlexIO</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-foreground/60 hover:text-foreground transition-colors story-link">Product</a>
              <a href="#" className="text-foreground/60 hover:text-foreground transition-colors story-link">Solutions</a>
              <a href="/contact" className="text-foreground/60 hover:text-foreground transition-colors story-link">Resources</a>
              <a href="#pricing" className="text-foreground/60 hover:text-foreground transition-colors story-link">Pricing</a>
              <Button variant="ghost" className="rounded-full" asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button className="rounded-full" asChild>
                <a href="/demo">Get Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 lg:py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center min-h-[700px]">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                  <Zap className="h-4 w-4" />
                  Introducing FlexIO Platform
                </div>
                <h1 className="text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-[1.1]">
                  The productivity platform{' '}
                  <span className="text-primary">for everyone</span>
                </h1>
                <p className="text-xl lg:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                  Streamline operations, boost productivity, and accelerate growth with our innovative platform that adapts to your workflow.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8 py-4 rounded-full hover-scale">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 rounded-full hover-scale" asChild>
                  <a href="/demo">Try Demo</a>
                </Button>
              </div>

              <div className="flex items-center flex-wrap gap-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Free forever plan</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>No setup required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-emerald-500" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-gradient-to-br from-muted/30 to-muted/10 rounded-2xl p-8 border border-border/50 backdrop-blur-sm">
                <div className="bg-background rounded-xl p-6 shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-sm text-muted-foreground">FlexIO Dashboard</span>
                  </div>
                  <LeadCaptureForm source="homepage_hero" campaign="landing_page" />
                </div>
                <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/20 rounded-full blur-xl"></div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/20 rounded-full blur-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 px-8 sm:px-12 lg:px-16 border-y bg-muted/20">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center space-y-8">
            <p className="text-muted-foreground font-medium">Trusted by innovative companies worldwide</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12 items-center opacity-60">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-16 bg-muted rounded-lg flex items-center justify-center hover-scale">
                  <span className="text-lg font-semibold">Company {i}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <span className="text-lg font-semibold">4.9/5 from 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* Productivity for Everyone Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-background">
        <div className="max-w-[1400px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <div className="w-16 h-1 bg-primary mx-auto rounded-full"></div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Productivity for the rest of us
            </h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              FlexIO makes productivity tools accessible to everyone—not just experts. With FlexIO as your 
              dedicated productivity platform, you can streamline workflows and drive meaningful outcomes in your business.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-8 sm:px-12 lg:px-16 bg-muted/30">
        <div className="max-w-[1600px] mx-auto">
          <div className="text-center space-y-6 mb-20">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Everything you need to succeed</h2>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Powerful features designed to help your business grow faster and more efficiently.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            <Card className="p-8 text-center space-y-6 border-0 shadow-xl bg-background/70 backdrop-blur-sm hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Lightning Fast</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Built for speed with cutting-edge technology that delivers results in real-time.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-6 border-0 shadow-xl bg-background/70 backdrop-blur-sm hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Enterprise Security</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Bank-level security with end-to-end encryption and compliance certifications.
              </p>
            </Card>

            <Card className="p-8 text-center space-y-6 border-0 shadow-xl bg-background/70 backdrop-blur-sm hover-scale">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Team Collaboration</h3>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Work together seamlessly with real-time collaboration and communication tools.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16 bg-foreground text-background">
        <div className="max-w-[1400px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">
              Ready to transform your productivity?
            </h2>
            <p className="text-xl lg:text-2xl opacity-80 max-w-3xl mx-auto leading-relaxed">
              Join thousands of businesses that have already revolutionized their operations with FlexIO.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-10 py-4 rounded-full hover-scale">
              Get Started Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-10 py-4 rounded-full border-background text-background hover:bg-background hover:text-foreground hover-scale" asChild>
              <a href="/demo">Request Demo</a>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16 py-16">
          <div className="grid md:grid-cols-4 gap-12">
            <div className="space-y-6">
              <h3 className="text-xl font-bold">FlexIO</h3>
              <p className="text-muted-foreground leading-relaxed">
                Empowering businesses worldwide with innovative productivity solutions that adapt to your workflow.
              </p>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Product</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors story-link">Features</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Pricing</a></li>
                <li><a href="/demo" className="hover:text-foreground transition-colors story-link">Demo</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Integrations</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Company</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors story-link">About</a></li>
                <li><a href="/contact" className="hover:text-foreground transition-colors story-link">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Careers</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Blog</a></li>
              </ul>
            </div>
            <div className="space-y-6">
              <h4 className="font-semibold">Resources</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Documentation</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors story-link">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-12 pt-12 text-center text-muted-foreground">
            <p>&copy; 2024 FlexIO. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}