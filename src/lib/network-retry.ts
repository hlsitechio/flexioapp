// Network retry utility for handling failed requests
interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryCondition?: (error: any) => boolean;
  onRetry?: (attemptNumber: number, error: any) => void;
}

class NetworkRetryManager {
  private defaultConfig: Required<RetryConfig> = {
    maxRetries: 3,
    baseDelay: 1000,
    maxDelay: 10000,
    retryCondition: (error: any) => {
      // Retry on network errors, timeouts, and 5xx status codes
      if (error.name === 'NetworkError' || error.name === 'TypeError') return true;
      if (error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') return true;
      if (error.status >= 500 && error.status < 600) return true;
      return false;
    },
    onRetry: () => {}
  };

  async withRetry<T>(
    operation: () => Promise<T>,
    config: RetryConfig = {}
  ): Promise<T> {
    const finalConfig = { ...this.defaultConfig, ...config };
    let lastError: any;

    for (let attempt = 0; attempt <= finalConfig.maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        // Don't retry if this is the last attempt or if retry condition fails
        if (attempt === finalConfig.maxRetries || !finalConfig.retryCondition(error)) {
          throw error;
        }

        // Calculate delay with exponential backoff
        const delay = Math.min(
          finalConfig.baseDelay * Math.pow(2, attempt),
          finalConfig.maxDelay
        );

        finalConfig.onRetry(attempt + 1, error);

        await this.delay(delay);
      }
    }

    throw lastError;
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Enhanced fetch with retry logic
  async fetchWithRetry(
    input: RequestInfo | URL,
    init?: RequestInit,
    config?: RetryConfig
  ): Promise<Response> {
    return this.withRetry(async () => {
      const response = await fetch(input, init);
      
      if (!response.ok) {
        const error = new Error(`HTTP ${response.status}: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }
      
      return response;
    }, config);
  }
}

export const networkRetry = new NetworkRetryManager();