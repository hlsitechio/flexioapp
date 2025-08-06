import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Enhanced server configuration for Vite 7
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
    },
    // Fix for Vite 7 WebSocket issues
    hmr: {
      overlay: true,
      port: 8080,
    },
  },
  envPrefix: ['VITE_'],
  plugins: [
    react({
      // Enhanced React SWC plugin configuration for Vite 7
      devTarget: 'esnext',
    }),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Leverage Vite 7's improved build performance
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          routing: ['react-router-dom'],
        }
      }
    },
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
  },
  // Optimized dependency pre-bundling for Vite 7
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      'clsx',
      'tailwind-merge',
    ],
  },
  // Enhanced ESBuild configuration for Vite 7
  esbuild: {
    target: 'esnext',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
  },
}));
