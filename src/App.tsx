import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ProductionErrorBoundary } from "@/components/ui/production-error-boundary";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSafeAuth } from "@/hooks/useSafeAuth";
import { useSafeWorkspace } from "@/hooks/useSafeWorkspace";
import { useSessionTracking } from "@/hooks/useSessionTracking";
import { initializeMonitoring } from "@/lib/monitoring";
import { analytics } from "@/lib/analytics";
import { useEffect } from "react";
import Index from "./pages/Index";
import { AuthPage } from "./pages/auth";
import { Settings } from "./pages/settings";
import { ProfilePage } from "./pages/profile";
import { ComponentsPage } from "./pages/components";
import { CustomizationPage } from "./pages/customization";
import { PromptsGalleryPage } from "./pages/prompts-gallery";
import { CodeSnippetsPage } from "./pages/code-snippets";
import { AnalyticsPage } from "./pages/analytics";
import { WorkspaceProfilesPage, WorkspaceSelectionPage } from "./pages/workspace";
import { WorkspaceHashNavigator } from "./components/workspace/WorkspaceHashNavigator";
import { WorkspaceUrlManager } from "./components/workspace/WorkspaceUrlManager";
import { LandingPage, ContactPage, DemoPage } from "./pages/landing";
import { AboutPage, CareersPage, BlogPage } from "./pages/company";
import { FeaturesPage, PricingPage, IntegrationsPage } from "./pages/product";
import { DocumentationPage, HelpCenterPage } from "./pages/resources";
import { PrivacyPolicyPage, TermsOfServicePage } from "./pages/legal";
import { AdminDashboard } from "./pages/admin";
import NotFound from "./pages/NotFound";


const App = () => {
  const { user, loading } = useSafeAuth();
  
  // Check if we're on a public page that doesn't need workspace context
  const isPublicPage = window.location.pathname === '/' ||                      // Root path
                       window.location.pathname.startsWith('/landing') ||
                       window.location.pathname.startsWith('/contact') ||
                       window.location.pathname.startsWith('/demo') ||
                       window.location.pathname.startsWith('/about') ||
                       window.location.pathname.startsWith('/careers') ||
                       window.location.pathname.startsWith('/blog') ||
                       window.location.pathname.startsWith('/features') ||
                       window.location.pathname.startsWith('/pricing') ||
                       window.location.pathname.startsWith('/integrations') ||
                       window.location.pathname.startsWith('/documentation') ||
                       window.location.pathname.startsWith('/help-center') ||
                       window.location.pathname.startsWith('/privacy-policy') ||
                       window.location.pathname.startsWith('/terms-of-service');

  // Use safe workspace hook that handles provider absence gracefully
  const workspaceHookResult = useSafeWorkspace();
  const { workspace, loading: workspaceLoading } = isPublicPage 
    ? { workspace: null, loading: false } 
    : workspaceHookResult;
  
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
      
      // Only initialize full analytics on non-public pages or in development
      if (!isPublicPage || import.meta.env.DEV) {
        analytics.initialize();
        analytics.trackPageView(window.location.pathname);
      }
    } catch (error) {
      // Only log errors in development or debug mode
      if (import.meta.env.DEV || import.meta.env.VITE_DEBUG === 'true') {
        console.error("❌ App initialization failed:", error);
      }
    }
  }, [isPublicPage]);

  // Only log final authenticated state once
  useEffect(() => {
    if (!loading && !workspaceLoading && user && workspace) {
      console.log("✅ App ready - User authenticated & workspace loaded");
    }
  }, [user, workspace, loading, workspaceLoading]);

  if (loading || (user && workspaceLoading)) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <ProductionErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          {!isPublicPage && <WorkspaceHashNavigator />}
          {!isPublicPage && <WorkspaceUrlManager />}
          <Routes>
            {/* Public routes - no authentication required */}
            <Route path="/landing" element={<LandingPage />} />
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
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            
            {/* Protected routes - authentication required */}
            <Route path="/auth" element={user ? <Navigate to="/workspace-selection" replace /> : <AuthPage />} />
            <Route path="/workspace-selection" element={user ? <WorkspaceSelectionPage /> : <Navigate to="/auth" replace />} />
            
            {/* Workspace-specific routes with role-based URLs */}
            <Route path="/workspace/:workspaceDetails" element={user && workspace ? <Index /> : <Navigate to="/workspace-selection" replace />} />
            <Route path="/workspace/:workspaceDetails/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/components" element={user ? <ComponentsPage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/customization" element={user ? <CustomizationPage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/prompts-gallery" element={user ? <PromptsGalleryPage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/code-snippets" element={user ? <CodeSnippetsPage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/analytics" element={user ? <AnalyticsPage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/workspace-profiles" element={user ? <WorkspaceProfilesPage /> : <Navigate to="/auth" replace />} />
            <Route path="/workspace/:workspaceDetails/admin" element={user ? <AdminDashboard /> : <Navigate to="/auth" replace />} />
            
            {/* Legacy route redirect */}
            <Route path="/" element={<Navigate to="/landing" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ProductionErrorBoundary>
  );
};

export default App;
