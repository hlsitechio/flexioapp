import { SEOHead } from '@/components/seo/SEOHead';
import { AISearchOptimization } from '@/components/seo/AISearchOptimization';
import UltraClearHero from '@/components/landing/UltraClearHero';
import { FeaturePeekCarousel } from '@/components/landing/FeaturePeekCarousel';

export default function UltraClearLanding(): JSX.Element {
  const canonical = typeof window !== 'undefined' ? window.location.pathname : '/';
  return (
    <div className="flex flex-col">
      <SEOHead
        title="Realtime BI dashboards in minutes | FlexIO"
        description="Build customizable realtime BI dashboards, calendar, notes, and projects in one workspace. Try the live demo and get insights fast."
        canonicalUrl={canonical}
        ogType="website"
      />

      <AISearchOptimization
        pageType="homepage"
        primaryKeywords={[
          'realtime BI dashboards',
          'analytics workspace',
          'customizable dashboards',
        ]}
        contentCategory="software"
        businessContext="analytics for business teams"
      />

      <main>
        <UltraClearHero />
        <FeaturePeekCarousel />
      </main>
    </div>
  );
}
