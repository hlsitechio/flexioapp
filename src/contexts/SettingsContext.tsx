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
  
  // Manual save function
  saveSettingsToBackend: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  
  // Helper function to safely access localStorage
  const getStorageItem = (key: string, defaultValue: any) => {
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

  const getStorageString = (key: string, defaultValue: string) => {
    try {
      if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key) || defaultValue;
        console.log(`Getting localStorage string ${key}:`, item);
        return item;
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

  // Initialize settings from localStorage first, then override with backend if authenticated
  useEffect(() => {
    console.log('SettingsContext: Initializing settings...');
    // Always load localStorage first to have immediate settings
    loadSettingsFromLocalStorage();
  }, []);

  // When user authentication state changes, handle backend sync
  useEffect(() => {
    console.log('SettingsContext: User auth state changed:', user?.email || 'No user');
    if (user) {
      // User just signed in - load from backend and merge with current settings
      loadSettingsFromBackend();
    } else {
      // User signed out - ensure current settings are saved to localStorage
      saveCurrentSettingsToLocalStorage();
    }
  }, [user]);

  const loadSettingsFromLocalStorage = () => {
    console.log('🔄 Loading settings from localStorage...');
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

    console.log('📋 About to set clock settings:', {
      showSeconds: savedShowSeconds,
      showDate: savedShowDate,
      showYear: savedShowYear,
      use24HourFormat: savedUse24HourFormat,
      clockPosition: savedClockPosition
    });

    setClockPosition(savedClockPosition);
    setShowHeaderTitle(savedShowHeaderTitle);
    setCustomHeaderTitle(savedCustomHeaderTitle);
    setShowSidebarCrown(savedShowSidebarCrown);
    setCustomSidebarTitle(savedCustomSidebarTitle);
    setShowSeconds(savedShowSeconds);
    setShowDate(savedShowDate);
    setShowYear(savedShowYear);
    setUse24HourFormat(savedUse24HourFormat);
    
    console.log('✅ Settings loaded from localStorage');
  };

  const saveCurrentSettingsToLocalStorage = () => {
    console.log('💾 Saving current settings to localStorage...');
    console.log('Current state values:', {
      showSeconds,
      showDate,
      showYear,
      use24HourFormat,
      clockPosition
    });
    
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
        
        console.log('✅ Current settings saved to localStorage for offline access');
      }
    } catch (error) {
      console.warn('❌ Error saving current settings to localStorage:', error);
    }
  };

  const loadSettingsFromBackend = async () => {
    if (!user) return;
    
    console.log('📡 Loading settings from backend for user:', user.email);
    
    // Get current localStorage values to compare
    const currentLocalSettings = {
      clockPosition,
      showSeconds,
      showDate,
      showYear,
      use24HourFormat
    };
    console.log('📋 Current localStorage settings:', currentLocalSettings);
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading settings:', error);
        console.log('🔄 Keeping current localStorage settings');
        return; // Keep current localStorage settings
      }

      if (data) {
        console.log('📡 Backend data received:', data.dashboard_layout);
        
        // Only override if backend has newer/different settings
        const layout = (data.dashboard_layout as any) || {};
        
        console.log('🔄 Applying backend settings...');
        setCustomHeaderTitle(data.dashboard_title || 'Premium Dashboard');
        setCustomSidebarTitle(data.sidebar_title || 'Premium Dashboard');
        
        // Apply layout settings only if they exist in backend
        if (layout.clockPosition !== undefined) {
          console.log('📍 Setting clock position from backend:', layout.clockPosition);
          setClockPosition(layout.clockPosition);
        }
        if (layout.showHeaderTitle !== undefined) setShowHeaderTitle(layout.showHeaderTitle);
        if (layout.showSidebarCrown !== undefined) setShowSidebarCrown(layout.showSidebarCrown);
        if (layout.showSeconds !== undefined) {
          console.log('⏰ Setting showSeconds from backend:', layout.showSeconds);
          setShowSeconds(layout.showSeconds);
        }
        if (layout.showDate !== undefined) {
          console.log('📅 Setting showDate from backend:', layout.showDate);
          setShowDate(layout.showDate);
        }
        if (layout.showYear !== undefined) {
          console.log('📆 Setting showYear from backend:', layout.showYear);
          setShowYear(layout.showYear);
        }
        if (layout.use24HourFormat !== undefined) {
          console.log('🕐 Setting use24HourFormat from backend:', layout.use24HourFormat);
          setUse24HourFormat(layout.use24HourFormat);
        }
        
        console.log('✅ Backend settings applied successfully');
        
        // Save updated settings to localStorage as backup (after a short delay)
        setTimeout(() => {
          console.log('💾 Backing up backend settings to localStorage...');
          saveCurrentSettingsToLocalStorage();
        }, 500);
      } else {
        console.log('📝 No backend settings found, saving current localStorage settings to backend');
        // No settings found, save current localStorage settings to backend
        await saveSettingsToBackend();
      }
    } catch (error) {
      console.error('❌ Error loading settings from backend:', error);
      console.log('🔄 Keeping current localStorage settings');
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

      console.log('Saving clock settings to backend:', {
        showSeconds,
        showDate,
        showYear,
        use24HourFormat,
        clockPosition
      });

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
        console.error('Error saving settings to backend:', error);
      } else {
        console.log('Clock settings saved successfully to backend');
        // Also save to localStorage as backup
        saveCurrentSettingsToLocalStorage();
      }
    } catch (error) {
      console.error('Error saving settings to backend:', error);
      // Always save to localStorage as backup
      saveCurrentSettingsToLocalStorage();
    }
  };

  // Enhanced save logic with immediate localStorage backup
  useEffect(() => {
    // Skip the first render to avoid saving default values
    if (
      clockPosition === 'left' && 
      showHeaderTitle === true && 
      customHeaderTitle === 'Premium Dashboard' && 
      showSidebarCrown === true && 
      customSidebarTitle === 'Premium Dashboard' && 
      showSeconds === true && 
      showDate === true && 
      showYear === true && 
      use24HourFormat === false
    ) {
      console.log('⏭️ Skipping save of initial default values');
      return;
    }

    console.log('🔄 Settings changed, preparing to save...');
    
    // ALWAYS save to localStorage immediately when settings change
    saveCurrentSettingsToLocalStorage();
    
    // Then save to backend if authenticated (debounced)
    if (user) {
      const timer = setTimeout(() => {
        console.log('⏰ Debounced backend save triggered');
        saveSettingsToBackend();
      }, 1000);
      return () => clearTimeout(timer);
    }
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
    saveSettingsToBackend,
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