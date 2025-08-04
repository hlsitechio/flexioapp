import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersistence } from '@/hooks/usePersistence';

interface UISettingsContextType {
  // Header settings
  showHeaderTitle: boolean;
  setShowHeaderTitle: (show: boolean) => void;
  customHeaderTitle: string;
  setCustomHeaderTitle: (title: string) => void;
  minimalNavigationMode: boolean;
  setMinimalNavigationMode: (minimal: boolean) => void;
  hideDividers: boolean;
  setHideDividers: (hide: boolean) => void;
  
  // Clock settings
  clockPosition: 'left' | 'center' | 'right';
  setClockPosition: (position: 'left' | 'center' | 'right') => void;
  show24Hour: boolean;
  setShow24Hour: (show: boolean) => void;
  showSeconds: boolean;
  setShowSeconds: (show: boolean) => void;
  
  // Edit mode
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  
  // Background and visual
  dashboardBackground: string;
  setDashboardBackground: (background: string) => void;
  gradientMode: 'full' | 'subtle' | 'minimal';
  setGradientMode: (mode: 'full' | 'subtle' | 'minimal') => void;
}

const UISettingsContext = createContext<UISettingsContextType | undefined>(undefined);

const defaultUISettings = {
  showHeaderTitle: true,
  customHeaderTitle: 'Dashboard',
  minimalNavigationMode: false,
  hideDividers: false,
  clockPosition: 'right' as const,
  show24Hour: false,
  showSeconds: false,
  editMode: false,
  dashboardBackground: 'bg-gradient-to-br from-background to-muted/20',
  gradientMode: 'full' as const,
};

export function UISettingsProvider({ children }: { children: React.ReactNode }) {
  // State
  const [showHeaderTitle, setShowHeaderTitle] = useState(defaultUISettings.showHeaderTitle);
  const [customHeaderTitle, setCustomHeaderTitle] = useState(defaultUISettings.customHeaderTitle);
  const [minimalNavigationMode, setMinimalNavigationMode] = useState(defaultUISettings.minimalNavigationMode);
  const [hideDividers, setHideDividers] = useState(defaultUISettings.hideDividers);
  const [clockPosition, setClockPosition] = useState<'left' | 'center' | 'right'>(defaultUISettings.clockPosition);
  const [show24Hour, setShow24Hour] = useState(defaultUISettings.show24Hour);
  const [showSeconds, setShowSeconds] = useState(defaultUISettings.showSeconds);
  const [editMode, setEditMode] = useState(defaultUISettings.editMode);
  const [dashboardBackground, setDashboardBackground] = useState(defaultUISettings.dashboardBackground);
  const [gradientMode, setGradientMode] = useState<'full' | 'subtle' | 'minimal'>(defaultUISettings.gradientMode);

  // Persistence
  const { 
    loadSettings, 
    saveSettings, 
    resetSettings 
  } = usePersistence('ui_settings', {
    showHeaderTitle,
    customHeaderTitle,
    minimalNavigationMode,
    hideDividers,
    clockPosition,
    show24Hour,
    showSeconds,
    editMode,
    dashboardBackground,
    gradientMode,
  });

  // Load settings on mount
  useEffect(() => {
    const loadUISettings = async () => {
      const settings = await loadSettings();
      if (settings) {
        setShowHeaderTitle(settings.showHeaderTitle ?? defaultUISettings.showHeaderTitle);
        setCustomHeaderTitle(settings.customHeaderTitle ?? defaultUISettings.customHeaderTitle);
        setMinimalNavigationMode(settings.minimalNavigationMode ?? defaultUISettings.minimalNavigationMode);
        setHideDividers(settings.hideDividers ?? defaultUISettings.hideDividers);
        setClockPosition(settings.clockPosition ?? defaultUISettings.clockPosition);
        setShow24Hour(settings.show24Hour ?? defaultUISettings.show24Hour);
        setShowSeconds(settings.showSeconds ?? defaultUISettings.showSeconds);
        setEditMode(settings.editMode ?? defaultUISettings.editMode);
        setDashboardBackground(settings.dashboardBackground ?? defaultUISettings.dashboardBackground);
        setGradientMode(settings.gradientMode ?? defaultUISettings.gradientMode);
      }
    };
    loadUISettings();
  }, [loadSettings]);

  // Auto-save when settings change
  useEffect(() => {
    saveSettings({
      showHeaderTitle,
      customHeaderTitle,
      minimalNavigationMode,
      hideDividers,
      clockPosition,
      show24Hour,
      showSeconds,
      editMode,
      dashboardBackground,
      gradientMode,
    });
  }, [
    showHeaderTitle,
    customHeaderTitle,
    minimalNavigationMode,
    hideDividers,
    clockPosition,
    show24Hour,
    showSeconds,
    editMode,
    dashboardBackground,
    gradientMode,
    saveSettings
  ]);

  const value = {
    showHeaderTitle,
    setShowHeaderTitle,
    customHeaderTitle,
    setCustomHeaderTitle,
    minimalNavigationMode,
    setMinimalNavigationMode,
    hideDividers,
    setHideDividers,
    clockPosition,
    setClockPosition,
    show24Hour,
    setShow24Hour,
    showSeconds,
    setShowSeconds,
    editMode,
    setEditMode,
    dashboardBackground,
    setDashboardBackground,
    gradientMode,
    setGradientMode,
  };

  return (
    <UISettingsContext.Provider value={value}>
      {children}
    </UISettingsContext.Provider>
  );
}

export function useUISettings() {
  const context = useContext(UISettingsContext);
  if (!context) {
    throw new Error('useUISettings must be used within a UISettingsProvider');
  }
  return context;
}