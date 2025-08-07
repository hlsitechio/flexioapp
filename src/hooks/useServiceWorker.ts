import { useEffect, useState } from 'react';

interface ServiceWorkerState {
  isSupported: boolean;
  isRegistered: boolean;
  isUpdateAvailable: boolean;
  registration: ServiceWorkerRegistration | null;
}

export function useServiceWorker() {
  const [state, setState] = useState<ServiceWorkerState>({
    isSupported: 'serviceWorker' in navigator,
    isRegistered: false,
    isUpdateAvailable: false,
    registration: null
  });

  useEffect(() => {
    // Avoid registering SW in development to prevent HMR reload loops
    if (!state.isSupported || import.meta.env.DEV) return;

    async function registerServiceWorker() {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        setState(prev => ({
          ...prev,
          isRegistered: true,
          registration
        }));

        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setState(prev => ({ ...prev, isUpdateAvailable: true }));
              }
            });
          }
        });

        // Handle messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
          if (event.data && event.data.type === 'CACHE_UPDATED') {
            setState(prev => ({ ...prev, isUpdateAvailable: true }));
          }
        });

        // Check if there's already an update waiting
        if (registration.waiting) {
          setState(prev => ({ ...prev, isUpdateAvailable: true }));
        }

      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }

    registerServiceWorker();
  }, [state.isSupported]);

  const updateServiceWorker = async () => {
    if (state.registration?.waiting) {
      state.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
      window.location.reload();
    }
  };

  const unregisterServiceWorker = async () => {
    if (state.registration) {
      await state.registration.unregister();
      setState(prev => ({
        ...prev,
        isRegistered: false,
        registration: null
      }));
    }
  };

  return {
    ...state,
    updateServiceWorker,
    unregisterServiceWorker
  };
}