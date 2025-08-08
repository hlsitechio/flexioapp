import { Outlet } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

export default function AppLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SEOHead
        title="Dashboard"
        description="Your FlexIO workspace dashboard"
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/'}
      />
      {/* App pages render their own navigation/sidebar */}
      <Outlet />
    </div>
  );
}
