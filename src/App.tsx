import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import { AuthPage } from "./pages/auth";
import { Settings } from "./pages/settings";
import { ProfilePage } from "./pages/profile";
import { ComponentsPage } from "./pages/components";
import { CustomizationPage } from "./pages/customization";
import NotFound from "./pages/NotFound";

const App = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
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
          <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
          <Route path="/" element={user ? <Index /> : <Navigate to="/auth" replace />} />
          <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/auth" replace />} />
          <Route path="/components" element={user ? <ComponentsPage /> : <Navigate to="/auth" replace />} />
          <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
          <Route path="/customization" element={user ? <CustomizationPage /> : <Navigate to="/auth" replace />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;

