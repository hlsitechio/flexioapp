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
          <div className="p-6 h-full">
            <div className="max-w-7xl mx-auto h-full">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Prompts Gallery</h1>
                <p className="text-muted-foreground mt-2">
                  Discover and use powerful prompts for various tasks and workflows
                </p>
              </div>
              <PromptsGallery />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}