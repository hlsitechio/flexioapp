import { useState } from 'react';
import { DashboardSidebar } from './sidebar';
import { TopNavigation } from './top-navigation';
import { DashboardGrid } from './DashboardGrid';

export function Dashboard() {
  const [editMode, setEditMode] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        
        <main className="flex-1 p-6">
          <DashboardGrid editMode={editMode} />
        </main>
      </div>
    </div>
  );
}