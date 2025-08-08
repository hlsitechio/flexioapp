import { CodeBlock } from '@/pages/components/code-block';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';
import { NotificationSidebar } from '@/components/sidebar/notifications';
import { ImageBanner } from '@/components/banner';
import { useSettings } from '@/contexts/SettingsContext';

export function CodeSnippetsPage() {
  const { editMode } = useSettings();

  return (
    <div className="min-h-screen flex w-screen bg-background overflow-x-hidden">
      <DashboardSidebar />
      
      <div className="flex-1 flex flex-col">
        <TopNavigation editMode={editMode} />
        
        <ImageBanner />
        
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground">Code Snippets</h1>
              <p className="text-muted-foreground mt-2">
                Manage and organize your reusable code snippets
              </p>
            </div>
            <CodeBlock />
          </div>
        </main>
      </div>
      
      <NotificationSidebar />
    </div>
  );
}