import { ReactNode } from 'react';
import { SidebarProvider } from '@/components/ui/sidebar';
import { DashboardSidebar } from '@/components/sidebar';
import { PageTitleBar } from '@/components/ui/page-title-bar';

interface DashboardLayoutProps {
  children: ReactNode;
  title: string;
}

export function DashboardLayout({ children, title }: DashboardLayoutProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-background to-muted/20 m-0 p-0">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col min-w-0 m-0 p-0">
          <PageTitleBar title={title} />
          
          <main className="flex-1 m-0">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}