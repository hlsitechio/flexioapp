import { DemoRequestForm } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Play, Users, Clock, Star } from 'lucide-react';

export function DemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button variant="ghost" asChild>
                <a href="/">← Back to Home</a>
              </Button>
              <h1 className="text-xl font-bold ml-4">Request Demo</h1>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-foreground/60 hover:text-foreground transition-colors">Home</a>
              <a href="/contact" className="text-foreground/60 hover:text-foreground transition-colors">Contact</a>
              <Button variant="outline" asChild>
                <a href="/contact">Contact Us</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <Badge variant="secondary" className="mb-4">
            <Star className="h-3 w-3 mr-1" />
            Most Popular
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            See Our Platform in Action
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get a personalized demo tailored to your business needs. See exactly how our platform can transform your operations.
          </p>
        </div>
      </section>

      {/* Demo Benefits */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Play className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Live Demo</h3>
              <p className="text-sm text-muted-foreground">
                Interactive walkthrough of key features with real data and use cases relevant to your industry.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Expert Guidance</h3>
              <p className="text-sm text-muted-foreground">
                Get insights from our product experts who understand your business challenges and goals.
              </p>
            </Card>

            <Card className="p-6 text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick Setup</h3>
              <p className="text-sm text-muted-foreground">
                Learn how fast you can get started and see results with our streamlined onboarding process.
              </p>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Demo Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6">What to Expect</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Personalized Overview</h3>
                      <p className="text-sm text-muted-foreground">
                        We'll customize the demo based on your industry, company size, and specific requirements.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Real-World Scenarios</h3>
                      <p className="text-sm text-muted-foreground">
                        See how the platform handles actual business processes and workflows from your industry.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Q&A Session</h3>
                      <p className="text-sm text-muted-foreground">
                        Get all your questions answered by our product experts and implementation specialists.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Next Steps</h3>
                      <p className="text-sm text-muted-foreground">
                        Learn about pricing, implementation timeline, and how to get started with a free trial.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Demo Options</h3>
                <div className="space-y-3">
                  <Card className="p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">Online Demo</h4>
                        <p className="text-sm text-muted-foreground">30-minute overview via video call</p>
                      </div>
                      <Badge variant="secondary">Most Popular</Badge>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div>
                      <h4 className="font-medium">Custom Demo</h4>
                      <p className="text-sm text-muted-foreground">60-minute deep dive with custom scenarios</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div>
                      <h4 className="font-medium">Technical Deep Dive</h4>
                      <p className="text-sm text-muted-foreground">90-minute technical session with your IT team</p>
                    </div>
                  </Card>
                </div>
              </div>

              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold mb-2">💡 Pro Tip</h3>
                <p className="text-sm text-muted-foreground">
                  Come prepared with specific questions about your current workflow challenges. 
                  This helps us show you the most relevant features and integrations.
                </p>
              </Card>
            </div>

            {/* Demo Request Form */}
            <div>
              <DemoRequestForm />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Hear from businesses that have transformed their operations with our platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="p-6">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                "The demo showed us exactly how this platform could solve our workflow challenges. 
                Implementation was smooth and we saw results within the first week."
              </p>
              <div>
                <p className="font-medium text-sm">Sarah Johnson</p>
                <p className="text-xs text-muted-foreground">Operations Director, TechCorp</p>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex mb-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                "The personalized demo helped us understand the ROI immediately. 
                Our team was excited to get started right after the call."
              </p>
              <div>
                <p className="font-medium text-sm">Michael Chen</p>
                <p className="text-xs text-muted-foreground">CEO, GrowthLabs</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Your Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}