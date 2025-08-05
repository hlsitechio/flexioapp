import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useWorkspace } from "@/contexts/WorkspaceContext";
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
import { WorkspaceProfilesPage, WorkspaceSelectionPage } from "./pages/workspace";
import { LandingPage, ContactPage, DemoPage } from "./pages/landing";
import NotFound from "./pages/NotFound";

const App = () => {
  const { user, loading } = useAuth();
  const { workspace, loading: workspaceLoading } = useWorkspace();

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
    <>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/landing" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/demo" element={<DemoPage />} />
          
          {/* Protected routes - authentication required */}
          <Route path="/auth" element={user ? <Navigate to="/workspace-selection" replace /> : <AuthPage />} />
          <Route path="/workspace-selection" element={user ? <WorkspaceSelectionPage /> : <Navigate to="/auth" replace />} />
          <Route path="/" element={user && workspace ? <Index /> : <Navigate to="/workspace-selection" replace />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} />
          <Route path="/components" element={user ? <ComponentsPage /> : <Navigate to="/auth" replace />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
          <Route path="/customization" element={user ? <CustomizationPage /> : <Navigate to="/auth" replace />} />
          <Route path="/prompts-gallery" element={user ? <PromptsGalleryPage /> : <Navigate to="/auth" replace />} />
          <Route path="/code-snippets" element={user ? <CodeSnippetsPage /> : <Navigate to="/auth" replace />} />
          <Route path="/workspace-profiles" element={user ? <WorkspaceProfilesPage /> : <Navigate to="/auth" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

