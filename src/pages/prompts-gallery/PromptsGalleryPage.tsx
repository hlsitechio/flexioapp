import { PromptsGallery } from '@/pages/components/prompts-gallery';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';

export function PromptsGalleryPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 overflow-hidden">
          <div className="h-full">
            <div className="h-full">
              <PromptsGallery />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}