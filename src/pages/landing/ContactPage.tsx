import { ContactForm } from '@/components/forms';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <a href="/landing">← Back to Home</a>
              </Button>
              <a href="/landing" className="flex items-center hover:opacity-80 transition-opacity">
                <img 
                  src="/lovable-uploads/801f0a89-558e-4fd0-8e4e-102d5c5d2d3e.png" 
                  alt="FlexIO Logo" 
                  className="h-12 w-auto"
                />
              </a>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="/landing" className="text-foreground/60 hover:text-foreground transition-colors">Home</a>
              <a href="/demo" className="text-foreground/60 hover:text-foreground transition-colors">Demo</a>
              <Button variant="outline" className="rounded-full" asChild>
                <a href="/demo">Request Demo</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="py-16 lg:py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-6">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Get in Touch
          </h1>
          <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Have questions? We'd love to hear from you. Send us a message and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-12 lg:py-16 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid lg:grid-cols-5 gap-12 lg:gap-16">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="text-2xl font-semibold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                      <p className="text-sm text-muted-foreground">Mon-Fri 9am-6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-muted-foreground">hello@yourplatform.com</p>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Office</h3>
                      <p className="text-muted-foreground">
                        123 Business Street<br />
                        Suite 100<br />
                        San Francisco, CA 94105
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-muted-foreground">
                        Monday - Friday: 9:00 AM - 6:00 PM EST<br />
                        Weekend: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Card className="p-6">
                <h3 className="font-semibold mb-4">Need immediate help?</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  For urgent technical issues or sales inquiries, you can also reach us through:
                </p>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="h-4 w-4 mr-2" />
                    Call Sales: +1 (555) 123-4567
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Mail className="h-4 w-4 mr-2" />
                    Support: support@yourplatform.com
                  </Button>
                </div>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 lg:py-24 px-8 sm:px-12 lg:px-16 bg-muted/30">
        <div className="max-w-[1800px] mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Quick answers to common questions. Can't find what you're looking for? Send us a message above.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-2">How quickly do you respond?</h3>
              <p className="text-sm text-muted-foreground">
                We typically respond to all inquiries within 24 hours during business days. For urgent matters, please call us directly.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Do you offer demos?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! We offer personalized demos to show you how our platform can benefit your specific business needs.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">What support do you provide?</h3>
              <p className="text-sm text-muted-foreground">
                We offer comprehensive support including onboarding, training, technical assistance, and ongoing customer success.
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-2">Can I schedule a call?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely! Include your preferred time in the contact form above, or request a demo to schedule a call with our team.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>&copy; 2024 FlexIO Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}