import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/providers/AppProviders";
import App from "./App.tsx";
import "./index.css";

// Mark performance measurement start
if (typeof window !== 'undefined' && 'performance' in window) {
  performance.mark('app-start');
}

// Initialize enhanced security suite and fonts asynchronously
if (typeof window !== 'undefined') {
  // Load fonts
  import("@/lib/fonts").then(({ loadInterFont }) => {
    loadInterFont();
  }).catch(console.error);
  
  // Load security suite
  import("@/lib/security/index").then(({ initializeSecuritySuite }) => {
    initializeSecuritySuite();
  }).catch(console.error);
  
  // Initialize performance monitoring
  import("@/lib/monitoring/index").then(({ initializeMonitoring }) => {
    initializeMonitoring();
  }).catch(console.error);
  
  // Preload critical routes after app loads
  import("@/lib/code-splitting").then(({ preloadCriticalRoutes }) => {
    preloadCriticalRoutes();
  }).catch(console.error);
}

// Mark before React hydration
if (typeof window !== 'undefined' && 'performance' in window) {
  performance.mark('react-start');
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);

// Mark after React hydration
if (typeof window !== 'undefined' && 'performance' in window) {
  performance.mark('react-end');
  performance.measure('react-hydration', 'react-start', 'react-end');
}