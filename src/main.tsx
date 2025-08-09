// StrictMode disabled to prevent double render in development
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AppProviders } from "@/providers/AppProviders";
import App from "./App.tsx";
import "./index.css";
import "./global-overrides.css";

// Initialize production-ready features
if (typeof window !== 'undefined') {
  // Load fonts
  import("@/lib/fonts").then(({ loadInterFont }) => {
    loadInterFont();
  }).catch(console.error);
  
  // Initialize security suite (production-aware)
  import("@/lib/security/index").then(({ initializeSecuritySuite }) => {
    initializeSecuritySuite();
  }).catch(console.error);
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AppProviders>
      <App />
    </AppProviders>
  </BrowserRouter>
);
