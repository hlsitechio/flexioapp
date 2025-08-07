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
    // Completely disable HMR in hosted/production environments
    hmr: mode === 'development', // Enable HMR in development, disable elsewhere
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
    // Prevent React duplication
    dedupe: ['react', 'react-dom'],
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Simple, proven chunk strategy
          'react': ['react', 'react-dom'],
          'vendor': ['@tanstack/react-query', 'react-router-dom', '@supabase/supabase-js'],
          'ui': ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-toast', 'lucide-react'],
        }
      }
    },
    sourcemap: mode === 'development',
  },
  // Simplified dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@supabase/supabase-js',
      'clsx',
      'tailwind-merge',
      'lucide-react'
    ],
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
