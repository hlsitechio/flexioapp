import React, { createContext, useContext, useState, useEffect } from 'react';

interface SettingsContextType {
  // Header settings
  clockPosition: 'left' | 'center' | 'right';
  setClockPosition: (position: 'left' | 'center' | 'right') => void;
  showHeaderTitle: boolean;
  setShowHeaderTitle: (show: boolean) => void;
  customHeaderTitle: string;
  setCustomHeaderTitle: (title: string) => void;
  
  // Clock display settings
  showSeconds: boolean;
  setShowSeconds: (show: boolean) => void;
  showDate: boolean;
  setShowDate: (show: boolean) => void;
  showYear: boolean;
  setShowYear: (show: boolean) => void;
  use24HourFormat: boolean;
  setUse24HourFormat: (use24Hour: boolean) => void;
  
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
  
  // Clock display settings
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [showYear, setShowYear] = useState<boolean>(true);
  const [use24HourFormat, setUse24HourFormat] = useState<boolean>(false);

  // Load from localStorage after component mounts
  useEffect(() => {
    const savedClockPosition = getStorageString('clockPosition', 'left') as 'left' | 'center' | 'right';
    const savedShowHeaderTitle = getStorageItem('showHeaderTitle', true);
    const savedCustomHeaderTitle = getStorageString('customHeaderTitle', 'Premium Dashboard');
    const savedShowSidebarCrown = getStorageItem('showSidebarCrown', true);
    const savedCustomSidebarTitle = getStorageString('customSidebarTitle', 'Premium Dashboard');
    
    // Clock settings
    const savedShowSeconds = getStorageItem('showSeconds', true);
    const savedShowDate = getStorageItem('showDate', true);
    const savedShowYear = getStorageItem('showYear', true);
    const savedUse24HourFormat = getStorageItem('use24HourFormat', false);

    setClockPosition(savedClockPosition);
    setShowHeaderTitle(savedShowHeaderTitle);
    setCustomHeaderTitle(savedCustomHeaderTitle);
    setShowSidebarCrown(savedShowSidebarCrown);
    setCustomSidebarTitle(savedCustomSidebarTitle);
    setShowSeconds(savedShowSeconds);
    setShowDate(savedShowDate);
    setShowYear(savedShowYear);
    setUse24HourFormat(savedUse24HourFormat);
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

  // Save clock settings to localStorage
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('showSeconds', JSON.stringify(showSeconds));
      }
    } catch (error) {
      console.warn('Error saving showSeconds to localStorage:', error);
    }
  }, [showSeconds]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('showDate', JSON.stringify(showDate));
      }
    } catch (error) {
      console.warn('Error saving showDate to localStorage:', error);
    }
  }, [showDate]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('showYear', JSON.stringify(showYear));
      }
    } catch (error) {
      console.warn('Error saving showYear to localStorage:', error);
    }
  }, [showYear]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('use24HourFormat', JSON.stringify(use24HourFormat));
      }
    } catch (error) {
      console.warn('Error saving use24HourFormat to localStorage:', error);
    }
  }, [use24HourFormat]);

  const value: SettingsContextType = {
    clockPosition,
    setClockPosition,
    showHeaderTitle,
    setShowHeaderTitle,
    customHeaderTitle,
    setCustomHeaderTitle,
    showSeconds,
    setShowSeconds,
    showDate,
    setShowDate,
    showYear,
    setShowYear,
    use24HourFormat,
    setUse24HourFormat,
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