import React from 'react';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { SecurityMessageCenter } from '@/components/security';
import { useSettings } from '@/contexts/SettingsContext';

export function SecurityMessagesPage() {
  const { editMode } = useSettings();
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <SecurityMessageCenter />
          </div>
        </main>
      </div>
    </div>
  );
}