import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Appearance } from './Appearance';

export function Settings() {
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
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
  );
}