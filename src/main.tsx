import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProviders } from "@/providers/AppProviders";
import App from "./App.tsx";
import "./index.css";

// Initialize enhanced security suite asynchronously
if (typeof window !== 'undefined') {
  import("@/lib/security/index").then(({ initializeSecuritySuite }) => {
    initializeSecuritySuite();
  }).catch(console.error);
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>
);