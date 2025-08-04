import { useState, useCallback } from 'react';

interface GenericToolState<T> {
  data: T;
  loading: boolean;
  error: string | null;
}

interface GenericToolActions<T> {
  updateData: (data: Partial<T> | ((prev: T) => T)) => void;
  resetData: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

/**
 * Generic hook for managing tool state with common patterns
 */
export function useGenericTool<T>(
  initialData: T,
  persistenceKey?: string
): GenericToolState<T> & GenericToolActions<T> {
  const [data, setData] = useState<T>(() => {
    if (persistenceKey) {
      const stored = localStorage.getItem(persistenceKey);
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch {
          return initialData;
        }
      }
    }
    return initialData;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateData = useCallback((newData: Partial<T> | ((prev: T) => T)) => {
    setData(prev => {
      const updated = typeof newData === 'function' ? newData(prev) : { ...prev, ...newData };
      
      // Persist to localStorage if key provided
      if (persistenceKey) {
        localStorage.setItem(persistenceKey, JSON.stringify(updated));
      }
      
      return updated;
    });
  }, [persistenceKey]);

  const resetData = useCallback(() => {
    setData(initialData);
    if (persistenceKey) {
      localStorage.removeItem(persistenceKey);
    }
  }, [initialData, persistenceKey]);

  return {
    data,
    loading,
    error,
    updateData,
    resetData,
    setLoading,
    setError,
  };
}