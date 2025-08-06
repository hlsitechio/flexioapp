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
    // Enhanced HMR configuration for hosted environments like Lovable
    hmr: {
      // Use WSS for secure connections
      protocol: 'wss',
      // Set clientPort to 443 for HTTPS hosted environments
      clientPort: 443,
      overlay: true,
      timeout: 30000,
    },
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
    // Prevent React duplication by ensuring single instance
    dedupe: ['react', 'react-dom', 'next-themes'],
  },
  build: {
    // Simplified build configuration to prevent React duplication
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          // Ensure React is in a single chunk to prevent duplication
          react: ['react', 'react-dom'],
          vendor: ['@tanstack/react-query', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-toast'],
          themes: ['next-themes'],
          supabase: ['@supabase/supabase-js'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          icons: ['lucide-react'],
        },
      }
    },
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
  },
  // Fixed dependency pre-bundling for Vite 7 to prevent React duplication
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
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
    ],
    // Remove force option to prevent re-bundling issues
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
