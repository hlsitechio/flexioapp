import { PromptsGallery } from '@/pages/components/prompts-gallery';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { NotificationSidebar } from '@/components/sidebar/notifications';
import { ImageBanner } from '@/components/banner';
import { useSettings } from '@/contexts/SettingsContext';

export function PromptsGalleryPage() {
  const { editMode } = useSettings();

  return (
    <div className="min-h-screen flex w-full bg-background">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <ImageBanner />
        
        <main className="flex-1 p-6">
          <PromptsGallery />
        </main>
      </div>
      
      <NotificationSidebar />
    </div>
  );
}