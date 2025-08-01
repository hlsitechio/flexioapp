import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, ArrowRight } from 'lucide-react';
import { Appearance } from './Appearance';

export function Settings() {
  const navigate = useNavigate();
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* Header */}
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-foreground">Settings</h1>
                <p className="text-muted-foreground">Manage your account and preferences</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Advanced Settings Link */}
                <Card className="animate-fade-in border-orange-200 dark:border-orange-800 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/advanced')}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <SettingsIcon className="h-5 w-5 text-orange-500" />
                        <span>Advanced Settings</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </CardTitle>
                    <CardDescription>
                      Access premium features and advanced workspace configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate('/advanced');
                      }}
                    >
                      Open Advanced Settings
                    </Button>
                  </CardContent>
                </Card>

                {/* Appearance */}
                <Appearance />
              </div>

              {/* Danger Zone */}
              <Card className="border-destructive/50 animate-fade-in">
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
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}