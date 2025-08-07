import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClockSettings } from './ClockSettings';
import { BackendStatus } from './BackendStatus';
import { WorkspaceProfileManager } from '@/components/workspace/WorkspaceProfileManager';
import { useSettings } from '@/contexts/SettingsContext';
import { useNavigate } from 'react-router-dom';
import { useSafeWorkspace } from '@/hooks/useSafeWorkspace';
import { Mail, ExternalLink } from 'lucide-react';

export function Settings() {
  const { editMode } = useSettings();
  const navigate = useNavigate();
  const { workspace } = useSafeWorkspace();
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            <div className="mb-6">
              <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
              <p className="text-muted-foreground">
                Manage your account settings and workspace preferences.
              </p>
            </div>
            
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="integrations">Integrations</TabsTrigger>
                <TabsTrigger value="backend">Backend Status</TabsTrigger>
                <TabsTrigger value="workspace">Workspace Controls</TabsTrigger>
                <TabsTrigger value="danger">Danger Zone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <div className="max-w-2xl">
                  <ClockSettings />
                </div>
              </TabsContent>
              
              <TabsContent value="integrations" className="space-y-6">
                <div className="max-w-4xl space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        Email Integration
                      </CardTitle>
                      <CardDescription>
                        Test and manage your Resend email integration
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <h4 className="font-medium">Status</h4>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Resend Connected</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium">Routing</h4>
                          <div className="text-sm text-muted-foreground">
                            → hlarosesurprenant@gmail.com
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => {
                            // Navigate to email test page using current URL structure
                            const currentPath = window.location.pathname;
                            const basePath = currentPath.replace('/settings', '');
                            navigate(`${basePath}/settings/email-test`);
                          }}
                          className="flex items-center gap-2"
                        >
                          <Mail className="h-4 w-4" />
                          Test Email System
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Integrations</CardTitle>
                      <CardDescription>
                        Connect additional services to enhance your workflow
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Stripe</h4>
                          <p className="text-sm text-muted-foreground mb-2">Payment processing</p>
                          <Button size="sm" variant="outline" disabled>
                            Coming Soon
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">OpenAI</h4>
                          <p className="text-sm text-muted-foreground mb-2">AI-powered features</p>
                          <Button size="sm" variant="outline" disabled>
                            Coming Soon
                          </Button>
                        </div>
                        
                        <div className="p-4 border rounded-lg">
                          <h4 className="font-medium mb-2">Zapier</h4>
                          <p className="text-sm text-muted-foreground mb-2">Workflow automation</p>
                          <Button size="sm" variant="outline" disabled>
                            Coming Soon
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              
              <TabsContent value="backend" className="space-y-6">
                <div className="max-w-4xl">
                  <BackendStatus />
                </div>
              </TabsContent>
              
              <TabsContent value="workspace" className="space-y-6">
                <WorkspaceProfileManager />
              </TabsContent>
              
              <TabsContent value="danger" className="space-y-6">
                <div className="max-w-2xl">
                  <Card className="border-destructive/50">
                    <CardHeader>
                      <CardTitle className="text-destructive">Danger Zone</CardTitle>
                      <CardDescription>
                        Irreversible and destructive actions
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button variant="destructive" className="w-full">
                        Delete Account
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}