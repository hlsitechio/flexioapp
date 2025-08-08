import { Outlet } from 'react-router-dom';
import { SEOHead } from '@/components/seo/SEOHead';

export default function AdminLayout() {
  return (
    <div className="min-h-screen w-full bg-background">
      <SEOHead
        title="Admin Dashboard"
        description="Administrative controls and audit logs"
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/'}
      />
      <Outlet />
    </div>
  );
}
