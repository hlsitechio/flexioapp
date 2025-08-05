import { developmentConfig } from './development';
import { stagingConfig } from './staging';
import { productionConfig } from './production';

export type AppConfig = typeof developmentConfig;

const getConfig = (): AppConfig => {
  const env = import.meta.env.MODE || 'development';
  
  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    case 'development':
    default:
      return developmentConfig;
  }
};

export const config = getConfig();

// Environment utilities
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;
export const isStaging = import.meta.env.MODE === 'staging';

// Feature flags based on environment
export const featureFlags = {
  enableDebugMode: config.features.enableDebugTools,
  enableMockData: config.features.enableMockData,
  enablePerformanceMetrics: config.features.enablePerformanceMetrics,
  enableHotReload: config.features.enableHotReload,
};

export { developmentConfig, stagingConfig, productionConfig };