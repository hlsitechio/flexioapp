import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ProductionErrorBoundary } from "@/components/ui/production-error-boundary";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useSafeAuth } from "@/hooks/useSafeAuth";
import { useSafeWorkspace } from "@/hooks/useSafeWorkspace";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { initializeMonitoring } from "@/lib/monitoring";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import { useServiceWorker } from "@/hooks/useServiceWorker";
import { toast } from "@/components/ui/sonner";
// Use lazy-loaded heavy pages
import { LazyAuthPage, LazyWorkspacePage, LazyAnalyticsPage, LazySettingsPage, LazyAdminDashboard, LazyCodeSnippetsPage, LazyPromptsGalleryPage, LazyWorkspaceDashboard } from "@/lib/code-splitting";
import { isPublicPath } from "@/lib/routes/publicPaths";
import { EmailTest } from "./pages/settings/EmailTest";
import { ProfilePage } from "./pages/profile";
import { ComponentsPage } from "./pages/components";
import { CustomizationPage } from "./pages/customization";
import { WorkspaceProfilesPage } from "./pages/workspace";
import { DocumentsPage } from "./pages/documents";
import { WorkspaceHashNavigator } from "./components/workspace/WorkspaceHashNavigator";
import { WorkspaceUrlManager } from "./components/workspace/WorkspaceUrlManager";
import { LandingPage, ContactPage, DemoPage, LandingPage2 } from "./pages/landing";
import UltraClearLanding from "./pages/landing/UltraClearLanding";
import { AboutPage, CareersPage, BlogPage } from "./pages/company";
import { FeaturesPage, PricingPage, IntegrationsPage } from "./pages/product";
import { DocumentationPage, HelpCenterPage, EmailDeliverabilityGuide } from "./pages/resources";
import { PrivacyPolicyPage, TermsOfServicePage } from "./pages/legal";
import NotFound from "./pages/NotFound";
import WebsiteLayout from "@/layouts/WebsiteLayout";
import AppLayout from "@/layouts/AppLayout";
import AdminLayout from "@/layouts/AdminLayout";
import { createLogger } from '@/lib/logger';


const App = () => {
  const log = createLogger('app');
  const { user, loading } = useSafeAuth();
  
  log.debug('Current path:', window.location.pathname);
  log.debug('User:', user?.email || 'No user');
  log.debug('Loading:', loading);
  
  // Check if we're on a public page that doesn't need workspace context
  const isPublicPage = typeof window !== 'undefined' && isPublicPath(window.location.pathname);
  const location = useLocation();

  // Use safe workspace hook that handles provider absence gracefully
  const { workspace, loading: workspaceLoading } = useSafeWorkspace();
  
  log.debug('Workspace:', workspace?.name || 'No workspace');
  log.debug('Workspace loading:', workspaceLoading);
  log.debug('Should render workspace content:', !isPublicPage && user && !loading);
  
  // Only track sessions for authenticated users on protected routes
  const isProtectedRoute = window.location.pathname.startsWith('/workspace') || 
                          window.location.pathname.startsWith('/auth') ||
                          window.location.pathname === '/workspace-selection';
  
  // Only enable session tracking for authenticated users on protected routes - not on public pages
  const shouldTrackSession = !isPublicPage && user && isProtectedRoute;
  useSessionTracking(shouldTrackSession, workspace);

  // Initialize monitoring and analytics - optimized for public pages
  useEffect(() => {
    try {
      // Always initialize basic monitoring
      initializeMonitoring();
      
      // Initialize analytics across all routes
      analytics.initialize();
      analytics.trackPageView(window.location.pathname);
    } catch (error) {
      // Only log errors in development or debug mode
      if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true') {
        log.error('App initialization failed:', error);
      }
    }
  }, [isPublicPage]);

  // Track SPA route changes
  useEffect(() => {
    analytics.trackPageView(location.pathname);
  }, [location.pathname]);

  const { isUpdateAvailable, updateServiceWorker } = useServiceWorker();

  useEffect(() => {
    if (isUpdateAvailable) {
      toast("A new version is available", {
        action: {
          label: "Update",
          onClick: updateServiceWorker
        }
      });
    }
  }, [isUpdateAvailable]);

  // Only log final authenticated state once
  useEffect(() => {
    if (!loading && !workspaceLoading && user && workspace) {
      log.info('App ready - User authenticated & workspace loaded');
    }
  }, [user, workspace, loading, workspaceLoading]);

  if (loading || (user && workspaceLoading)) {
    log.debug('App loading state:', { loading, user: !!user, workspaceLoading });
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        <p className="mt-4 text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  log.debug('Rendering routes - current path:', window.location.pathname);
  
  return (
    <ProductionErrorBoundary>
        <Toaster />
        <Sonner />
        {!isPublicPage && <WorkspaceHashNavigator />}
        {!isPublicPage && <WorkspaceUrlManager />}
        <Routes>
          {/* Public routes under WebsiteLayout */}
          <Route element={<WebsiteLayout />}>
            <Route path="/" element={<UltraClearLanding />} />
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/landing-2" element={<LandingPage2 />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/demo" element={<DemoPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/careers" element={<CareersPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/features" element={<FeaturesPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/integrations" element={<IntegrationsPage />} />
            <Route path="/documentation" element={<DocumentationPage />} />
            <Route path="/help-center" element={<HelpCenterPage />} />
            <Route path="/email-deliverability" element={<EmailDeliverabilityGuide />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            <Route path="/auth" element={user ? <Navigate to="/workspace-selection" replace /> : <LazyAuthPage />} />
          </Route>

          {/* App routes under AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/workspace-selection" element={user ? <LazyWorkspacePage /> : <Navigate to="/auth" replace />} />

            {/* Workspace-specific nested routes */}
            <Route path="/workspace/:workspaceDetails">
              <Route index element={user && workspace ? <LazyWorkspaceDashboard /> : <Navigate to="/workspace-selection" replace />} />
              <Route path="profile" element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} />
              <Route path="components" element={user ? <ComponentsPage /> : <Navigate to="/auth" replace />} />
              <Route path="settings" element={user ? <LazySettingsPage /> : <Navigate to="/auth" replace />} />
              <Route path="settings/email-test" element={user ? <EmailTest /> : <Navigate to="/auth" replace />} />
              <Route path="customization" element={user ? <CustomizationPage /> : <Navigate to="/auth" replace />} />
              <Route path="prompts-gallery" element={user ? <LazyPromptsGalleryPage /> : <Navigate to="/auth" replace />} />
              <Route path="code-snippets" element={user ? <LazyCodeSnippetsPage /> : <Navigate to="/auth" replace />} />
              <Route path="analytics" element={user ? <LazyAnalyticsPage /> : <Navigate to="/auth" replace />} />
              <Route path="documents-viewer" element={user ? <DocumentsPage /> : <Navigate to="/auth" replace />} />
              <Route path="workspace-profiles" element={user ? <WorkspaceProfilesPage /> : <Navigate to="/auth" replace />} />
            </Route>
          </Route>

          {/* Admin routes under AdminLayout */}
          <Route element={<AdminLayout />}>
            <Route path="/workspace/:workspaceDetails/admin" element={user ? <LazyAdminDashboard /> : <Navigate to="/auth" replace />} />
          </Route>

          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ProductionErrorBoundary>
  );
};

export default App;
