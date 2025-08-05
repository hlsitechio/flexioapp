export const stagingConfig = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://staging-api.yourdomain.com',
    timeout: 12000,
    retries: 4,
  },
  
  database: {
    maxConnections: 50,
    connectionTimeout: 8000,
    queryTimeout: 45000,
  },
  
  logging: {
    level: 'info',
    enableConsole: true,
    enableFile: true,
  },
  
  features: {
    enableHotReload: false,
    enableDebugTools: true,
    enableMockData: false,
    enablePerformanceMetrics: true,
  },
  
  monitoring: {
    enableSentry: true,
    enableAnalytics: false,
    enableErrorReporting: true,
  },
  
  security: {
    enableCSP: true,
    enableCORS: true,
    enableRateLimit: true,
  },
  
  cache: {
    enableCaching: true,
    ttl: 1800, // 30 minutes
    maxSize: 5000,
  }
};