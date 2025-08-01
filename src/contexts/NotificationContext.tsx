import { createContext, useContext, useState } from 'react';

interface NotificationContextType {
  isNotificationOpen: boolean;
  setIsNotificationOpen: (open: boolean) => void;
  toggleNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const toggleNotification = () => {
    setIsNotificationOpen(prev => !prev);
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