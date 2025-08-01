import { useState } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from './sidebar';
import { TopNavigation } from './top-navigation';
import { DashboardGrid } from './DashboardGrid';

export function Dashboard() {
  const [editMode, setEditMode] = useState(false);

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <TopNavigation editMode={editMode} setEditMode={setEditMode} />
          
          <main className="flex-1 p-6">
            <DashboardGrid editMode={editMode} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}