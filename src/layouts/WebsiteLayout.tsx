import { Outlet, useLocation } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';
import { PublicPageNav } from '@/components/shared/PublicPageNav';

export default function WebsiteLayout() {
  const location = useLocation();
  const isLanding = location.pathname === '/' || location.pathname === '/landing';
  return (
    <div className="min-h-screen flex flex-col bg-background overflow-x-hidden">
      <SEOHead
        title="FlexIO Website"
        description="Explore FlexIO: BI platform, analytics and dashboards"
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/'}
      />
      {!isLanding && (
        <header>
          <PublicPageNav />
        </header>
      )}
      <main className="flex-1 w-full">
        {isLanding ? (
          <Outlet />
        ) : (
          <div className="mx-auto w-full max-w-[1920px] px-6">
            <Outlet />
          </div>
        )}
      </main>
    </div>
  );
}
