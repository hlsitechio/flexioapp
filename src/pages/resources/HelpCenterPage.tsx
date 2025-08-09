import { Card, CardContent } from '@/components/ui/card';
import { HelpCircle, MessageCircle, Lightbulb } from 'lucide-react';


export function HelpCenterPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Help Center
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get help, find answers, and connect with our support team for all your FlexIO questions.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <HelpCircle className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're building a comprehensive help center with FAQs, troubleshooting guides, 
                  and multiple ways to get support when you need it.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <HelpCircle className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">FAQs</h3>
                  <p className="text-sm text-muted-foreground">Common questions & answers</p>
                </div>
                <div className="space-y-2">
                  <MessageCircle className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Live Support</h3>
                  <p className="text-sm text-muted-foreground">Chat with our team</p>
                </div>
                <div className="space-y-2">
                  <Lightbulb className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Tips & Tricks</h3>
                  <p className="text-sm text-muted-foreground">Get the most out of FlexIO</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}