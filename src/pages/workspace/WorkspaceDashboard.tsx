import { Dashboard } from '@/components/Dashboard';
import { SEOHead } from '@/components/seo/SEOHead';

export function WorkspaceDashboard() {
  return (
    <div className="w-full h-full">
      <SEOHead
        title="Dashboard"
        description="Your FlexIO workspace dashboard"
        canonicalUrl={typeof window !== 'undefined' ? window.location.pathname : '/dashboard'}
      />
      <Dashboard />
    </div>
  );
}