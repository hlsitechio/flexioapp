import React from 'react';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { SecurityDashboard } from '@/components/security';
import { useSettings } from '@/contexts/SettingsContext';

export function SecuritySettings() {
  const { editMode } = useSettings();
  
  return (
    <div className="min-h-screen flex w-screen bg-gradient-to-br from-background to-muted/20 overflow-x-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            <SecurityDashboard />
          </div>
        </main>
      </div>
    </div>
  );
}