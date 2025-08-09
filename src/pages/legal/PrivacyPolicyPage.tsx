import { Card, CardContent } from '@/components/ui/card';
import { Shield, Lock, Eye } from 'lucide-react';


export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      

      {/* Hero Section */}
      <section className="py-24 px-8 sm:px-12 lg:px-16">
        <div className="max-w-[1800px] mx-auto text-center space-y-12">
          <div className="space-y-6">
            <h1 className="text-5xl lg:text-6xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Your privacy is important to us. Learn how we collect, use, and protect your information.
            </p>
          </div>

          {/* Coming Soon Card */}
          <Card className="max-w-2xl mx-auto border border-border/50 shadow-xl">
            <CardContent className="p-12 text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-10 w-10 text-primary" />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-bold">Coming Soon</h2>
                <p className="text-lg text-muted-foreground">
                  We're finalizing our comprehensive privacy policy that clearly explains 
                  our data practices, your rights, and how we protect your information.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8">
                <div className="space-y-2">
                  <Shield className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Data Protection</h3>
                  <p className="text-sm text-muted-foreground">Enterprise-grade security</p>
                </div>
                <div className="space-y-2">
                  <Eye className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Transparency</h3>
                  <p className="text-sm text-muted-foreground">Clear data practices</p>
                </div>
                <div className="space-y-2">
                  <Lock className="h-8 w-8 text-primary mx-auto" />
                  <h3 className="font-semibold">Your Rights</h3>
                  <p className="text-sm text-muted-foreground">Full control over your data</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}