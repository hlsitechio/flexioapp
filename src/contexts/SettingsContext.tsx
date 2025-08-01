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
  // Load settings from localStorage on init
  const [clockPosition, setClockPosition] = useState<'left' | 'center' | 'right'>(() => {
    const saved = localStorage.getItem('clockPosition');
    return (saved as 'left' | 'center' | 'right') || 'left';
  });
  
  const [showHeaderTitle, setShowHeaderTitle] = useState<boolean>(() => {
    const saved = localStorage.getItem('showHeaderTitle');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [customHeaderTitle, setCustomHeaderTitle] = useState<string>(() => {
    return localStorage.getItem('customHeaderTitle') || 'Premium Dashboard';
  });
  
  const [showSidebarCrown, setShowSidebarCrown] = useState<boolean>(() => {
    const saved = localStorage.getItem('showSidebarCrown');
    return saved !== null ? JSON.parse(saved) : true;
  });
  
  const [customSidebarTitle, setCustomSidebarTitle] = useState<string>(() => {
    return localStorage.getItem('customSidebarTitle') || 'Premium Dashboard';
  });
  
  const [editMode, setEditMode] = useState<boolean>(false);

  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('clockPosition', clockPosition);
  }, [clockPosition]);
  
  useEffect(() => {
    localStorage.setItem('showHeaderTitle', JSON.stringify(showHeaderTitle));
  }, [showHeaderTitle]);
  
  useEffect(() => {
    localStorage.setItem('customHeaderTitle', customHeaderTitle);
  }, [customHeaderTitle]);
  
  useEffect(() => {
    localStorage.setItem('showSidebarCrown', JSON.stringify(showSidebarCrown));
  }, [showSidebarCrown]);
  
  useEffect(() => {
    localStorage.setItem('customSidebarTitle', customSidebarTitle);
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