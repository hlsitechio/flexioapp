export const developmentConfig = {
  api: {
    baseUrl: 'http://localhost:3000',
    timeout: 10000,
    retries: 3,
  },
  
  database: {
    maxConnections: 10,
    connectionTimeout: 5000,
    queryTimeout: 30000,
  },
  
  logging: {
    level: 'debug',
    enableConsole: true,
    enableFile: false,
  },
  
  features: {
    enableHotReload: true,
    enableDebugTools: true,
    enableMockData: true,
    enablePerformanceMetrics: true,
  },
  
  monitoring: {
    enableSentry: false,
    enableAnalytics: false,
    enableErrorReporting: true,
  },
  
  security: {
    enableCSP: false,
    enableCORS: true,
    enableRateLimit: false,
  },
  
  cache: {
    enableCaching: false,
    ttl: 300, // 5 minutes
    maxSize: 1000,
  }
};