import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
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
import { WelcomeAnimation } from "./components/animations";

const App = () => {
  const { user, loading } = useAuth();
  const { workspace, loading: workspaceLoading } = useWorkspace();
  useSessionTracking();

  // Initialize monitoring and analytics once - silent success, only log errors
  useEffect(() => {
    try {
      initializeMonitoring();
      analytics.initialize();
      analytics.trackPageView(window.location.pathname);
    } catch (error) {
      console.error("❌ App initialization failed:", error);
    }
  }, []);

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
    <WelcomeAnimation>
      <ErrorBoundary>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <WorkspaceHashNavigator />
          <WorkspaceUrlManager />
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
            <Route path="/" element={user && workspace ? <Navigate to="/workspace/WRK_00001-Default-free" replace /> : <Navigate to="/workspace-selection" replace />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ErrorBoundary>
    </WelcomeAnimation>
  );
};

export default App;
