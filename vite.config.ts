import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Enhanced server configuration for Vite 7 with optimized performance
    headers: {
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
      'Cache-Control': mode === 'development' ? 'no-cache' : 'public, max-age=31536000',
    },
    // Disable HMR in hosted/iframe environments to prevent WebSocket connection errors
    hmr: process.env.NODE_ENV === 'development' && !process.env.LOVABLE_PROJECT_ID ? {
      // Only enable HMR in true local development
      protocol: 'ws',
      overlay: true,
      timeout: 30000,
    } : false, // Completely disable HMR in hosted environments
    // Performance optimizations
    middlewareMode: false,
    warmup: {
      clientFiles: [
        './src/components/**/*.tsx',
        './src/pages/**/*.tsx',
        './src/hooks/**/*.ts',
        './src/contexts/**/*.tsx',
        './src/lib/**/*.ts',
      ],
    },
    fs: {
      strict: false,
      allow: ['..'],
    },
  },
  envPrefix: ['VITE_'],
  define: {
    // Fix for __WS_TOKEN__ undefined error in Vite 7
    __WS_TOKEN__: JSON.stringify(process.env.WS_TOKEN || ''),
  },
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
    // Critical: Prevent React duplication by ensuring single instance
    dedupe: ['react', 'react-dom', 'react-dom/client', 'scheduler', 'next-themes'],
  },
  build: {
    // Optimized build configuration for performance
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Critical: Ensure React is in a single, consistent chunk
          if (id.includes('react') || id.includes('react-dom') || id.includes('scheduler')) {
            return 'react-core';
          }
          
          // UI library chunk - separate from React
          if (id.includes('@radix-ui') || id.includes('lucide-react')) {
            return 'ui-libs';
          }
          
          // Animation libraries
          if (id.includes('framer-motion')) {
            return 'animation';
          }
          
          // Utilities - keep small and separate
          if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
            return 'utils';
          }
          
          // Data fetching
          if (id.includes('@tanstack/react-query')) {
            return 'query';
          }
          
          // Supabase
          if (id.includes('@supabase/supabase-js')) {
            return 'supabase';
          }
          
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          
          // Everything else from node_modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        // Optimize chunk naming
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/[name]-[hash].js`;
        },
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
  },
  // Enhanced dependency pre-bundling to prevent React duplication
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-popover',
      '@radix-ui/react-toast',
      '@supabase/supabase-js',
      'clsx',
      'tailwind-merge',
      'class-variance-authority',
      'lucide-react',
      'date-fns',
      'framer-motion'
    ],
    // Force pre-bundling to prevent React duplication
    force: false,
    esbuildOptions: {
      target: 'esnext',
    },
  },
  // Simplified caching for Vite 7
  cacheDir: 'node_modules/.vite',
  // Enhanced ESBuild configuration for Vite 7 with performance optimizations
  esbuild: {
    target: 'esnext',
    logOverride: { 'this-is-undefined-in-esm': 'silent' },
    drop: mode === 'production' ? ['console', 'debugger'] : [],
    legalComments: 'none',
    minifyIdentifiers: mode === 'production',
    minifySyntax: mode === 'production',
    minifyWhitespace: mode === 'production',
  },
  // Enhanced worker configuration for real-time features
  worker: {
    format: 'es',
    plugins: () => [react()],
  },
}));
