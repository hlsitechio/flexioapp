import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { DashboardWidgets } from './dashboard-widgets';
import { SidebarComponents } from './sidebar-components';
import { PromptsGallery } from './prompts-gallery';
import { CodeBlock } from './code-block';
import { useSettings } from '@/contexts/SettingsContext';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ComponentsPage() {
  const { editMode } = useSettings();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const targetSlot = searchParams.get('slot');
  const gridSize = searchParams.get('gridSize');
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        {/* Slot Selection Header */}
        {targetSlot && (
          <div className="px-6 py-4 bg-muted/30 border-b border-border/50">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Dashboard</span>
                </Button>
                <div className="flex items-center space-x-2 text-sm">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Adding component to</span>
                  <span className="font-medium text-foreground">
                    Slot {parseInt(targetSlot) + 1} ({gridSize} Grid)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Content Area - Horizontal Layout */}
            <div className="space-y-8">
              {/* Dashboard Widgets Section */}
              <DashboardWidgets targetSlot={targetSlot} gridSize={gridSize} />

              {/* Sidebar Components Section - Only show if not targeting a specific slot */}
              {!targetSlot && <SidebarComponents />}

              {/* Prompts Gallery Section - Only show if not targeting a specific slot */}
              {!targetSlot && <PromptsGallery />}

              {/* Code Block Section - Only show if not targeting a specific slot */}
              {!targetSlot && <CodeBlock />}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}