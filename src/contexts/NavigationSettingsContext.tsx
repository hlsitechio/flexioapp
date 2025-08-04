import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersistence } from '@/hooks/usePersistence';

interface NavigationSettingsContextType {
  // Sidebar settings
  sidebarSolid: boolean;
  setSidebarSolid: (solid: boolean) => void;
  
  // Quick notes
  quickNotesEnabled: boolean;
  setQuickNotesEnabled: (enabled: boolean) => void;
  
  // User navigation order
  userNavigationOrder: string[];
  setUserNavigationOrder: (order: string[]) => void;
}

const NavigationSettingsContext = createContext<NavigationSettingsContextType | undefined>(undefined);

const defaultNavigationSettings = {
  sidebarSolid: false,
  quickNotesEnabled: true,
  userNavigationOrder: [],
};

export function NavigationSettingsProvider({ children }: { children: React.ReactNode }) {
  // State
  const [sidebarSolid, setSidebarSolid] = useState(defaultNavigationSettings.sidebarSolid);
  const [quickNotesEnabled, setQuickNotesEnabled] = useState(defaultNavigationSettings.quickNotesEnabled);
  const [userNavigationOrder, setUserNavigationOrder] = useState(defaultNavigationSettings.userNavigationOrder);

  // Persistence
  const { 
    loadSettings, 
    saveSettings 
  } = usePersistence('navigation_settings', {
    sidebarSolid,
    quickNotesEnabled,
    userNavigationOrder,
  });

  // Load settings on mount
  useEffect(() => {
    const loadNavigationSettings = async () => {
      const settings = await loadSettings();
      if (settings) {
        setSidebarSolid(settings.sidebarSolid ?? defaultNavigationSettings.sidebarSolid);
        setQuickNotesEnabled(settings.quickNotesEnabled ?? defaultNavigationSettings.quickNotesEnabled);
        setUserNavigationOrder(settings.userNavigationOrder ?? defaultNavigationSettings.userNavigationOrder);
      }
    };
    loadNavigationSettings();
  }, [loadSettings]);

  // Auto-save when settings change
  useEffect(() => {
    saveSettings({
      sidebarSolid,
      quickNotesEnabled,
      userNavigationOrder,
    });
  }, [
    sidebarSolid,
    quickNotesEnabled,
    userNavigationOrder,
    saveSettings
  ]);

  const value = {
    sidebarSolid,
    setSidebarSolid,
    quickNotesEnabled,
    setQuickNotesEnabled,
    userNavigationOrder,
    setUserNavigationOrder,
  };

  return (
    <NavigationSettingsContext.Provider value={value}>
      {children}
    </NavigationSettingsContext.Provider>
  );
}

export function useNavigationSettings() {
  const context = useContext(NavigationSettingsContext);
  if (!context) {
    throw new Error('useNavigationSettings must be used within a NavigationSettingsProvider');
  }
  return context;
}