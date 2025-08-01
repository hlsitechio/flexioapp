import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { Profile } from './Profile';

export function ProfilePage() {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigation />
          
          <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
                <Profile />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}