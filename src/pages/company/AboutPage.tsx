import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Users, Target, Award } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Navigation */}
      <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-[1800px] mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <a href="/landing" className="flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </a>
              </Button>
              <h1 className="text-xl font-bold">FlexIO</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <a href="/auth">Sign In</a>
              </Button>
              <Button asChild>
                <a href="/workspace-selection">Get Started</a>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              About FlexIO
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Learn more about our mission, vision, and the team behind FlexIO's innovative productivity platform.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're crafting our story and preparing to share our journey, mission, and the passionate team 
                  behind FlexIO. Stay tuned for insights into what drives us to build the future of productivity.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Target className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">Empowering teams worldwide</p>
                </div>
                <div className="space-y-2">
                  <Users className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Our Team</h3>
                  <p className="text-sm text-muted-foreground">Passionate innovators</p>
                </div>
                <div className="space-y-2">
                  <Award className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Our Vision</h3>
                  <p className="text-sm text-muted-foreground">Future of productivity</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}