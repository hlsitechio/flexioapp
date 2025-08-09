import { Card, CardContent } from '@/components/ui/card';
import { FileText, Scale, CheckCircle } from 'lucide-react';


export function TermsOfServicePage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              The terms and conditions that govern your use of FlexIO's platform and services.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Scale className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're preparing fair and transparent terms of service that outline the rights 
                  and responsibilities for using FlexIO's platform.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Scale className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Fair Terms</h3>
                  <p className="text-sm text-muted-foreground">Balanced & reasonable</p>
                </div>
                <div className="space-y-2">
                  <FileText className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Clear Language</h3>
                  <p className="text-sm text-muted-foreground">Easy to understand</p>
                </div>
                <div className="space-y-2">
                  <CheckCircle className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">User Rights</h3>
                  <p className="text-sm text-muted-foreground">Your rights protected</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}