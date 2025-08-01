import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  
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

  // Load settings from backend if user is authenticated, otherwise localStorage
  useEffect(() => {
    if (user) {
      loadSettingsFromBackend();
    } else {
      loadSettingsFromLocalStorage();
    }
  }, [user]);

  const loadSettingsFromLocalStorage = () => {
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
  };

  const loadSettingsFromBackend = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading settings:', error);
        loadSettingsFromLocalStorage(); // Fallback to localStorage
        return;
      }

      if (data) {
        setCustomHeaderTitle(data.dashboard_title || 'Premium Dashboard');
        setCustomSidebarTitle(data.sidebar_title || 'Premium Dashboard');
        // Load other settings from dashboard_layout JSON if stored there
        const layout = (data.dashboard_layout as any) || {};
        if (layout.clockPosition) setClockPosition(layout.clockPosition);
        if (layout.showHeaderTitle !== undefined) setShowHeaderTitle(layout.showHeaderTitle);
        if (layout.showSidebarCrown !== undefined) setShowSidebarCrown(layout.showSidebarCrown);
        if (layout.showSeconds !== undefined) setShowSeconds(layout.showSeconds);
        if (layout.showDate !== undefined) setShowDate(layout.showDate);
        if (layout.showYear !== undefined) setShowYear(layout.showYear);
        if (layout.use24HourFormat !== undefined) setUse24HourFormat(layout.use24HourFormat);
      } else {
        // No settings found, use defaults and create initial record
        await saveSettingsToBackend();
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      loadSettingsFromLocalStorage(); // Fallback to localStorage
    }
  };

  const saveSettingsToBackend = async () => {
    if (!user) return;

    try {
      const layoutSettings = {
        clockPosition,
        showHeaderTitle,
        showSidebarCrown,
        showSeconds,
        showDate,
        showYear,
        use24HourFormat,
      };

      const { error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          dashboard_title: customHeaderTitle,
          sidebar_title: customSidebarTitle,
          sidebar_collapsed: false, // You can add this to state if needed
          dashboard_layout: layoutSettings,
        });

      if (error) {
        console.error('Error saving settings:', error);
      }
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  // Save settings (to backend if authenticated, otherwise localStorage)
  useEffect(() => {
    const saveSettings = () => {
      if (user) {
        // Debounce backend saves
        const timer = setTimeout(saveSettingsToBackend, 1000);
        return () => clearTimeout(timer);
      } else {
        // Save to localStorage immediately
        try {
          if (typeof window !== 'undefined') {
            localStorage.setItem('clockPosition', clockPosition);
            localStorage.setItem('showHeaderTitle', JSON.stringify(showHeaderTitle));
            localStorage.setItem('customHeaderTitle', customHeaderTitle);
            localStorage.setItem('showSidebarCrown', JSON.stringify(showSidebarCrown));
            localStorage.setItem('customSidebarTitle', customSidebarTitle);
            localStorage.setItem('showSeconds', JSON.stringify(showSeconds));
            localStorage.setItem('showDate', JSON.stringify(showDate));
            localStorage.setItem('showYear', JSON.stringify(showYear));
            localStorage.setItem('use24HourFormat', JSON.stringify(use24HourFormat));
          }
        } catch (error) {
          console.warn('Error saving settings to localStorage:', error);
        }
      }
    };

    const cleanup = saveSettings();
    return cleanup;
  }, [
    clockPosition,
    showHeaderTitle,
    customHeaderTitle,
    showSidebarCrown,
    customSidebarTitle,
    showSeconds,
    showDate,
    showYear,
    use24HourFormat,
    user,
  ]);

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