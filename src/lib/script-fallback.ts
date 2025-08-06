// Script fallback utility for handling blocked external scripts
interface ScriptConfig {
  src: string;
  fallback?: () => void;
  retryCount?: number;
  retryDelay?: number;
  essential?: boolean;
}

class ScriptFallbackManager {
  private failedScripts = new Set<string>();
  private retryAttempts = new Map<string, number>();

  async loadScript(config: ScriptConfig): Promise<boolean> {
    const { src, fallback, retryCount = 3, retryDelay = 1000, essential = false } = config;

    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = true;

      const onLoad = () => {
        resolve(true);
        this.cleanup(script);
      };

      const onError = () => {
        this.failedScripts.add(src);
        const attempts = this.retryAttempts.get(src) || 0;
        
        if (attempts < retryCount) {
          this.retryAttempts.set(src, attempts + 1);
          setTimeout(() => {
            this.loadScript(config).then(resolve);
          }, retryDelay);
        } else {
          console.warn(`Failed to load script after ${retryCount} attempts:`, src);
          
          if (fallback) {
            try {
              fallback();
              console.info('Fallback executed for:', src);
            } catch (error) {
              console.error('Fallback execution failed:', error);
            }
          }

          if (essential) {
            console.error('Essential script failed to load:', src);
          }

          resolve(false);
        }
        
        this.cleanup(script);
      };

      script.addEventListener('load', onLoad);
      script.addEventListener('error', onError);

      document.head.appendChild(script);

      // Timeout fallback - simply timeout if script hasn't loaded
      const timeoutId = setTimeout(() => {
        onError();
      }, 10000);

      // Clear timeout on successful load
      script.addEventListener('load', () => clearTimeout(timeoutId), { once: true });
    });
  }

  private cleanup(script: HTMLScriptElement) {
    script.removeEventListener('load', () => {});
    script.removeEventListener('error', () => {});
    if (script.parentNode) {
      script.parentNode.removeChild(script);
    }
  }

  getFailedScripts(): string[] {
    return Array.from(this.failedScripts);
  }

  clearFailedScripts(): void {
    this.failedScripts.clear();
    this.retryAttempts.clear();
  }
}

export const scriptFallback = new ScriptFallbackManager();