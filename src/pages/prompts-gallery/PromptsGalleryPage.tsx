import { PromptsGallery } from '@/pages/components/prompts-gallery';

export function PromptsGalleryPage() {
  return (
    <div className="min-h-screen w-full bg-background">
      <div className="max-w-[1920px] min-h-[1080px] mx-auto flex flex-col">
        <PromptsGallery />
      </div>
    </div>
  );
}