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
    // Enhanced HMR configuration following official Vite documentation
    hmr: {
      protocol: 'wss', // Use secure WebSocket for HTTPS environments
      overlay: true,
      timeout: 30000,
      // Let Vite auto-detect host and port for better compatibility
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
  },
  build: {
    // Leverage Vite 7's improved build performance with aggressive optimizations
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-popover', '@radix-ui/react-toast'],
          supabase: ['@supabase/supabase-js'],
          utils: ['clsx', 'tailwind-merge', 'class-variance-authority'],
          routing: ['react-router-dom'],
          icons: ['lucide-react'],
          animations: ['framer-motion'],
        },
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/css/i.test(ext)) {
            return `assets/styles/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      }
    },
    // Enable source maps for better debugging
    sourcemap: mode === 'development',
  },
  // Enhanced dependency pre-bundling for Vite 7 with aggressive optimization
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
      'framer-motion',
      'date-fns',
    ],
    force: mode === 'development',
    // Enhanced pre-bundling for better performance
    esbuildOptions: {
      target: 'esnext',
      splitting: true,
      format: 'esm',
    },
  },
  // Advanced caching for Vite 7
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
