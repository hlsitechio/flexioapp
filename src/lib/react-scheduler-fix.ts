// Fix for React Scheduler unstable_now error
// This ensures the Scheduler has proper timing functions

if (typeof window !== 'undefined') {
  // Polyfill for performance.now if missing
  if (!window.performance) {
    window.performance = {} as Performance;
  }
  
  if (!window.performance.now) {
    window.performance.now = () => Date.now();
  }
  
  // Ensure MessageChannel is available for React Scheduler
  if (!window.MessageChannel) {
    // Simple MessageChannel polyfill for older environments
    window.MessageChannel = class {
      port1: any;
      port2: any;
      
      constructor() {
        const callbacks: Array<() => void> = [];
        
        this.port1 = {
          postMessage: () => {
            setTimeout(() => {
              callbacks.forEach(cb => cb());
            }, 0);
          },
          onmessage: null
        };
        
        this.port2 = {
          onmessage: null,
          postMessage: (data: any) => {
            if (this.port1.onmessage) {
              setTimeout(() => {
                this.port1.onmessage({ data });
              }, 0);
            }
          }
        };
      }
    };
  }
}

// Export empty to make this a module
export {};