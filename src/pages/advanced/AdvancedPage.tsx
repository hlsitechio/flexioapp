import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { PageTitleBar } from '@/components/ui/page-title-bar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Building2, Zap } from 'lucide-react';

export function AdvancedPage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <PageTitleBar 
            title="Advanced Settings" 
            description="Advanced workspace configuration and premium features"
          />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Premium Badge */}
              <div className="flex justify-start">
                <Badge variant="secondary" className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
                  Premium
                </Badge>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Workspace Configuration */}
                <Card className="animate-fade-in">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Building2 className="h-5 w-5" />
                      <span>Workspace Configuration</span>
                    </CardTitle>
                    <CardDescription>
                      Your workspace identification and backend integration settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="workspaceId">Workspace ID</Label>
                      <Input 
                        id="workspaceId" 
                        value="WK-000000001" 
                        readOnly 
                        className="bg-muted font-mono text-sm"
                      />
                      <p className="text-xs text-muted-foreground">
                        This ID is used for backend integration and cannot be modified.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Premium Features */}
                <Card className="animate-fade-in border-orange-200 dark:border-orange-800">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Zap className="h-5 w-5 text-orange-500" />
                      <span>Premium Features</span>
                    </CardTitle>
                    <CardDescription>
                      Advanced functionality for premium subscribers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Advanced Analytics</p>
                          <p className="text-sm text-muted-foreground">Detailed workspace insights</p>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Custom Integrations</p>
                          <p className="text-sm text-muted-foreground">Connect external services</p>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                      
                      <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                        <div>
                          <p className="font-medium">Advanced Permissions</p>
                          <p className="text-sm text-muted-foreground">Granular access control</p>
                        </div>
                        <Badge variant="outline">Coming Soon</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}