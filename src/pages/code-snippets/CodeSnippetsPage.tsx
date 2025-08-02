import { CodeBlock } from '@/pages/components/code-block';
import { DashboardSidebar } from '@/components/sidebar';
import { TopNavigation } from '@/components/top-navigation';

export function CodeSnippetsPage() {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col">
        <TopNavigation />
        <main className="flex-1 overflow-hidden">
          <div className="p-6 h-full">
            <div className="max-w-7xl mx-auto h-full">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-foreground">Code Snippets</h1>
                <p className="text-muted-foreground mt-2">
                  Manage and organize your reusable code snippets
                </p>
              </div>
              <CodeBlock />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}