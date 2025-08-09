import { Card, CardContent } from '@/components/ui/card';
import { Briefcase, Heart, Rocket } from 'lucide-react';


export function CareersPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Join Our Team
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Build the future of productivity with us. Discover career opportunities at FlexIO.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Briefcase className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're building an amazing team and preparing exciting career opportunities. 
                  Join our talent community to be the first to know about new openings.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Rocket className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Innovation</h3>
                  <p className="text-sm text-muted-foreground">Work on cutting-edge technology</p>
                </div>
                <div className="space-y-2">
                  <Heart className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Culture</h3>
                  <p className="text-sm text-muted-foreground">Collaborative & inclusive</p>
                </div>
                <div className="space-y-2">
                  <Briefcase className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Growth</h3>
                  <p className="text-sm text-muted-foreground">Unlimited learning opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}