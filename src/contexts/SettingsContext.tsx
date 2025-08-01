import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  // Header settings
  clockPosition: 'left' | 'center' | 'right';
  setClockPosition: (position: 'left' | 'center' | 'right') => void;
  showHeaderTitle: boolean;
  setShowHeaderTitle: (show: boolean) => void;
  customHeaderTitle: string;
  setCustomHeaderTitle: (title: string) => void;
  
  // Sidebar settings
  showSidebarCrown: boolean;
  setShowSidebarCrown: (show: boolean) => void;
  customSidebarTitle: string;
  setCustomSidebarTitle: (title: string) => void;
  
  // Edit mode
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  // Helper function to safely access localStorage
  const getStorageItem = (key: string, defaultValue: any) => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item !== null ? JSON.parse(item) : defaultValue;
      }
    } catch (error) {
      console.warn(`Error reading ${key} from localStorage:`, error);
    }
    return defaultValue;
  };

  const getStorageString = (key: string, defaultValue: string) => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem(key) || defaultValue;
      }
    } catch (error) {
      console.warn(`Error reading ${key} from localStorage:`, error);
    }
    return defaultValue;
  };

  // Load settings from localStorage on init - using safe access
  const [clockPosition, setClockPosition] = useState<'left' | 'center' | 'right'>('left');
  const [showHeaderTitle, setShowHeaderTitle] = useState<boolean>(true);
  const [customHeaderTitle, setCustomHeaderTitle] = useState<string>('Premium Dashboard');
  const [showSidebarCrown, setShowSidebarCrown] = useState<boolean>(true);
  const [customSidebarTitle, setCustomSidebarTitle] = useState<string>('Premium Dashboard');
  const [editMode, setEditMode] = useState<boolean>(false);

  // Load from localStorage after component mounts
  useEffect(() => {
    const savedClockPosition = getStorageString('clockPosition', 'left') as 'left' | 'center' | 'right';
    const savedShowHeaderTitle = getStorageItem('showHeaderTitle', true);
    const savedCustomHeaderTitle = getStorageString('customHeaderTitle', 'Premium Dashboard');
    const savedShowSidebarCrown = getStorageItem('showSidebarCrown', true);
    const savedCustomSidebarTitle = getStorageString('customSidebarTitle', 'Premium Dashboard');

    setClockPosition(savedClockPosition);
    setShowHeaderTitle(savedShowHeaderTitle);
    setCustomHeaderTitle(savedCustomHeaderTitle);
    setShowSidebarCrown(savedShowSidebarCrown);
    setCustomSidebarTitle(savedCustomSidebarTitle);
  }, []);

  // Save to localStorage whenever settings change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('clockPosition', clockPosition);
      }
    } catch (error) {
      console.warn('Error saving clockPosition to localStorage:', error);
    }
  }, [clockPosition]);
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('showHeaderTitle', JSON.stringify(showHeaderTitle));
      }
    } catch (error) {
      console.warn('Error saving showHeaderTitle to localStorage:', error);
    }
  }, [showHeaderTitle]);
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('customHeaderTitle', customHeaderTitle);
      }
    } catch (error) {
      console.warn('Error saving customHeaderTitle to localStorage:', error);
    }
  }, [customHeaderTitle]);
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('showSidebarCrown', JSON.stringify(showSidebarCrown));
      }
    } catch (error) {
      console.warn('Error saving showSidebarCrown to localStorage:', error);
    }
  }, [showSidebarCrown]);
  
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('customSidebarTitle', customSidebarTitle);
      }
    } catch (error) {
      console.warn('Error saving customSidebarTitle to localStorage:', error);
    }
  }, [customSidebarTitle]);

  const value: SettingsContextType = {
    clockPosition,
    setClockPosition,
    showHeaderTitle,
    setShowHeaderTitle,
    customHeaderTitle,
    setCustomHeaderTitle,
    showSidebarCrown,
    setShowSidebarCrown,
    customSidebarTitle,
    setCustomSidebarTitle,
    editMode,
    setEditMode,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}