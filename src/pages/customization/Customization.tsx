import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Appearance } from './Appearance';
import { GalleryGradient } from './gallery-gradient';
import { DividerControl } from '@/components/customization/DividerControl';
import { useSettings } from '@/contexts/SettingsContext';

export function Customization() {
  const { editMode } = useSettings();
  
  return (
    <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <main className="flex-1 p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="grid gap-6 md:grid-cols-1 max-w-2xl">
              {/* Appearance Settings */}
              <Appearance />
              
              {/* Divider Control */}
              <DividerControl />
              
              {/* Gallery Gradient */}
              <GalleryGradient />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}