export const productionConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://api.yourdomain.com',
    timeout: 15000,
    retries: 5,
  },
  
  database: {
    maxConnections: 100,
    connectionTimeout: 10000,
    queryTimeout: 60000,
  },
  
  logging: {
    level: 'error',
    enableConsole: false,
    enableFile: true,
  },
  
  features: {
    enableHotReload: false,
    enableDebugTools: false,
    enableMockData: false,
    enablePerformanceMetrics: true,
    // Vite 7 specific features
    enableFastRefresh: false,
    enableOptimizedDeps: true,
  },
  
  monitoring: {
    enableSentry: true,
    enableAnalytics: true,
    enableErrorReporting: true,
  },
  
  security: {
    enableCSP: true,
    enableCORS: true,
    enableRateLimit: true,
  },
  
  cache: {
    enableCaching: true,
    ttl: 3600, // 1 hour
    maxSize: 10000,
  }
};