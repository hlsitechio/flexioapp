import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  toggleNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Helper function to safely access localStorage
  const getStorageItem = (key: string, defaultValue: boolean) => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        console.log(`Getting localStorage ${key}:`, item, 'defaulting to:', defaultValue);
        return item !== null ? JSON.parse(item) : defaultValue;
      }
    } catch (error) {
      console.warn(`Error reading ${key} from localStorage:`, error);
    }
    return defaultValue;
  };

  // Load notification state from localStorage on init
  useEffect(() => {
    console.log('NotificationContext: Initializing notification state...');
    const savedNotificationOpen = getStorageItem('isNotificationOpen', false);
    setIsNotificationOpen(savedNotificationOpen);
    console.log('✅ Notification state loaded from localStorage');
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    console.log('📱 Notification state changed, saving to localStorage:', isNotificationOpen);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('isNotificationOpen', JSON.stringify(isNotificationOpen));
        console.log('✅ Notification state saved to localStorage');
      }
    } catch (error) {
      console.warn('❌ Error saving notification state to localStorage:', error);
    }

    // If user is authenticated, we could also save to backend (optional for this setting)
    if (user) {
      console.log('👤 User authenticated - could sync notification state to backend if needed');
    }
  }, [isNotificationOpen, user]);

  const toggleNotification = () => {
    setIsNotificationOpen(prev => {
      const newState = !prev;
      console.log('🔄 Toggling notification panel:', prev, '->', newState);
      return newState;
    });
  };

  const value = {
    isNotificationOpen,
    setIsNotificationOpen,
    toggleNotification,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
}