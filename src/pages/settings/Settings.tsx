import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ClockSettings } from './ClockSettings';
import { WorkspaceProfileManager } from '@/components/workspace/WorkspaceProfileManager';
import { useSettings } from '@/contexts/SettingsContext';

export function Settings() {
  const { editMode } = useSettings();
  
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
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="workspace">Workspace Controls</TabsTrigger>
                <TabsTrigger value="danger">Danger Zone</TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="space-y-6">
                <div className="max-w-2xl">
                  <ClockSettings />
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