import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { GridSize } from '@/components/grid-layouts';

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
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Top navigation grid settings
  topNavigationWidgets: string[];
  setTopNavigationWidgets: (widgets: string[]) => void;
  
  // Quick note
  quickNote: string;
  setQuickNote: (note: string) => void;
  
  // Edit mode
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  
  // Dashboard layout
  dashboardLayout: Record<string, { component: string; gridSize: string } | null>;
  setDashboardLayout: (layout: Record<string, { component: string; gridSize: string } | null>) => void;
  addComponentToSlot: (slotIndex: number, componentName: string, gridSize: string) => void;
  removeComponentFromSlot: (slotIndex: number) => void;
  
  // Grid settings
  gridSize: GridSize;
  setGridSize: (size: GridSize) => void;
  
  // Banner settings
  bannerImage: string;
  setBannerImage: (image: string) => void;
  showBanner: boolean;
  setShowBanner: (show: boolean) => void;
  bannerHeight: number;
  setBannerHeight: (height: number) => void;
  
  // Manual save function
  saveSettingsToBackend: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isLoadingRef = useRef(false);
  const isSavingRef = useRef(false);
  const hasLoadedFromBackendRef = useRef(false);
  const lastUserIdRef = useRef<string | null>(null);
  
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  
  // Clock display settings
  const [showSeconds, setShowSeconds] = useState<boolean>(true);
  const [showDate, setShowDate] = useState<boolean>(true);
  const [showYear, setShowYear] = useState<boolean>(true);
  const [use24HourFormat, setUse24HourFormat] = useState<boolean>(false);
  
  // Dashboard layout settings
  const [dashboardLayout, setDashboardLayout] = useState<Record<string, { component: string; gridSize: string } | null>>({});
  
  // Grid settings
  const [gridSize, setGridSize] = useState<GridSize>('4x4');
  
  // Top navigation widgets
  const [topNavigationWidgets, setTopNavigationWidgets] = useState<string[]>([]);
  
  // Quick note
  const [quickNote, setQuickNote] = useState<string>('');
  
  // Banner settings
  const [bannerImage, setBannerImage] = useState<string>('');
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerHeight, setBannerHeight] = useState<number>(192);

  // Initialize settings from localStorage first, then override with backend if authenticated
  useEffect(() => {
    console.log('SettingsContext: Initializing settings...');
    // Always load localStorage first to have immediate settings
    loadSettingsFromLocalStorage();
  }, []);

  // When user authentication state changes, handle backend sync ONLY for new users
  useEffect(() => {
    const currentUserId = user?.id || null;
    console.log('SettingsContext: User auth state changed:', user?.email || 'No user');
    
    // Only load from backend if this is a NEW user session (not re-renders)
    if (user && currentUserId !== lastUserIdRef.current && !hasLoadedFromBackendRef.current) {
      console.log('🔄 New user session detected, loading from backend...');
      lastUserIdRef.current = currentUserId;
      hasLoadedFromBackendRef.current = true;
      loadSettingsFromBackend();
    } else if (!user) {
      // User signed out - reset flags and save current settings
      console.log('👋 User signed out, resetting state...');
      hasLoadedFromBackendRef.current = false;
      lastUserIdRef.current = null;
      saveCurrentSettingsToLocalStorage();
    }
  }, [user?.id]); // Only depend on user.id, not the entire user object

  const loadSettingsFromLocalStorage = () => {
    console.log('🔄 Loading settings from localStorage...');
    const savedClockPosition = getStorageString('clockPosition', 'left') as 'left' | 'center' | 'right';
    const savedShowHeaderTitle = getStorageItem('showHeaderTitle', true);
    const savedCustomHeaderTitle = getStorageString('customHeaderTitle', 'Premium Dashboard');
    const savedShowSidebarCrown = getStorageItem('showSidebarCrown', true);
    const savedCustomSidebarTitle = getStorageString('customSidebarTitle', 'Premium Dashboard');
    const savedSidebarCollapsed = getStorageItem('sidebarCollapsed', false);
    
    // Clock settings
    const savedShowSeconds = getStorageItem('showSeconds', true);
    const savedShowDate = getStorageItem('showDate', true);
    const savedShowYear = getStorageItem('showYear', true);
    const savedUse24HourFormat = getStorageItem('use24HourFormat', false);
    
    // Dashboard layout
    const savedDashboardLayout = getStorageItem('dashboardLayout', {});
    
    // Grid settings
    const savedGridSize = getStorageString('gridSize', '4x4') as GridSize;
    
    // Top navigation widgets
    const savedTopNavigationWidgets = getStorageItem('topNavigationWidgets', []);
    
    // Quick note
    const savedQuickNote = getStorageString('quickNote', '');
    
    // Banner settings
    const savedBannerImage = getStorageString('bannerImage', '');
    const savedShowBanner = getStorageItem('showBanner', false);
    const savedBannerHeight = getStorageItem('bannerHeight', 192);

    console.log('📋 About to set all settings:', {
      showSeconds: savedShowSeconds,
      showDate: savedShowDate,
      showYear: savedShowYear,
      use24HourFormat: savedUse24HourFormat,
      clockPosition: savedClockPosition,
      sidebarCollapsed: savedSidebarCollapsed
    });

    setClockPosition(savedClockPosition);
    setShowHeaderTitle(savedShowHeaderTitle);
    setCustomHeaderTitle(savedCustomHeaderTitle);
    setShowSidebarCrown(savedShowSidebarCrown);
    setCustomSidebarTitle(savedCustomSidebarTitle);
    setSidebarCollapsed(savedSidebarCollapsed);
    setShowSeconds(savedShowSeconds);
    setShowDate(savedShowDate);
    setShowYear(savedShowYear);
    setUse24HourFormat(savedUse24HourFormat);
    setDashboardLayout(savedDashboardLayout);
    setGridSize(savedGridSize);
    setTopNavigationWidgets(savedTopNavigationWidgets);
    setQuickNote(savedQuickNote);
    setBannerImage(savedBannerImage);
    setShowBanner(savedShowBanner);
    setBannerHeight(savedBannerHeight);
    
    console.log('✅ Settings loaded from localStorage');
  };

  const saveCurrentSettingsToLocalStorage = () => {
    console.log('💾 Saving current settings to localStorage...');
    console.log('Current state values:', {
      showSeconds,
      showDate,
      showYear,
      use24HourFormat,
      clockPosition,
      sidebarCollapsed,
      customHeaderTitle,
      customSidebarTitle
    });
    
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('clockPosition', clockPosition);
        localStorage.setItem('showHeaderTitle', JSON.stringify(showHeaderTitle));
        localStorage.setItem('customHeaderTitle', customHeaderTitle);
        localStorage.setItem('showSidebarCrown', JSON.stringify(showSidebarCrown));
        localStorage.setItem('customSidebarTitle', customSidebarTitle);
        localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
        localStorage.setItem('showSeconds', JSON.stringify(showSeconds));
        localStorage.setItem('showDate', JSON.stringify(showDate));
        localStorage.setItem('showYear', JSON.stringify(showYear));
        localStorage.setItem('use24HourFormat', JSON.stringify(use24HourFormat));
        localStorage.setItem('dashboardLayout', JSON.stringify(dashboardLayout));
        localStorage.setItem('gridSize', gridSize);
        localStorage.setItem('topNavigationWidgets', JSON.stringify(topNavigationWidgets));
        localStorage.setItem('quickNote', quickNote);
        localStorage.setItem('bannerImage', bannerImage);
        localStorage.setItem('showBanner', JSON.stringify(showBanner));
        localStorage.setItem('bannerHeight', JSON.stringify(bannerHeight));
        
        console.log('✅ Current settings saved to localStorage for offline access');
      }
    } catch (error) {
      console.warn('❌ Error saving current settings to localStorage:', error);
    }
  };

  const loadSettingsFromBackend = async () => {
    if (!user || isLoadingRef.current || isSavingRef.current) {
      console.log('🚫 Skipping backend load: user, loading, or saving state prevents it');
      return;
    }
    
    isLoadingRef.current = true;
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
        
        // Apply sidebar collapsed state if it exists
        if (data.sidebar_collapsed !== undefined) {
          console.log('📱 Setting sidebar collapsed from backend:', data.sidebar_collapsed);
          setSidebarCollapsed(data.sidebar_collapsed);
        }
        
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
        if (layout.dashboardLayout !== undefined) {
          console.log('🎯 Setting dashboardLayout from backend:', layout.dashboardLayout);
          setDashboardLayout(layout.dashboardLayout);
        }
        if (layout.gridSize !== undefined) {
          console.log('📏 Setting gridSize from backend:', layout.gridSize);
          setGridSize(layout.gridSize);
        }
        if (layout.topNavigationWidgets !== undefined) {
          console.log('🔝 Setting topNavigationWidgets from backend:', layout.topNavigationWidgets);
          setTopNavigationWidgets(layout.topNavigationWidgets);
        }
        
        // Set quick note from backend if it exists
        if (data.quick_note !== undefined) {
          console.log('📝 Setting quickNote from backend:', data.quick_note);
          setQuickNote(data.quick_note);
        }
        
        // Set banner settings from backend if they exist
        if (layout.bannerImage !== undefined) {
          console.log('🖼️ Setting bannerImage from backend:', layout.bannerImage);
          setBannerImage(layout.bannerImage);
        }
        if (layout.showBanner !== undefined) {
          console.log('👁️ Setting showBanner from backend:', layout.showBanner);
          setShowBanner(layout.showBanner);
        }
        if (layout.bannerHeight !== undefined) {
          console.log('📏 Setting bannerHeight from backend:', layout.bannerHeight);
          setBannerHeight(layout.bannerHeight);
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
    } finally {
      isLoadingRef.current = false;
    }
  };

  const saveSettingsToBackend = async () => {
    if (!user || isLoadingRef.current) {
      console.log('❌ Cannot save to backend: No user or currently loading');
      return;
    }

    isSavingRef.current = true;

    console.log('🚀 Starting save to backend...', { userId: user.id });

    try {
      const layoutSettings = {
        clockPosition,
        showHeaderTitle,
        showSidebarCrown,
        showSeconds,
        showDate,
        showYear,
        use24HourFormat,
        dashboardLayout,
        gridSize,
        topNavigationWidgets,
        bannerImage,
        showBanner,
        bannerHeight,
      };

      console.log('💾 Saving settings to backend:', {
        user_id: user.id,
        dashboard_title: customHeaderTitle,
        sidebar_title: customSidebarTitle,
        layout: layoutSettings
      });

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          dashboard_title: customHeaderTitle,
          sidebar_title: customSidebarTitle,
          sidebar_collapsed: sidebarCollapsed,
          dashboard_layout: layoutSettings,
          quick_note: quickNote,
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('❌ Supabase error saving settings:', error);
        throw error;
      } else {
        console.log('✅ Settings saved successfully to Supabase backend!', data);
        // Also save to localStorage as backup
        saveCurrentSettingsToLocalStorage();
      }
    } catch (error) {
      console.error('❌ Fatal error saving settings to backend:', error);
      // Always save to localStorage as backup
      saveCurrentSettingsToLocalStorage();
      throw error; // Re-throw so the UI can handle it
    } finally {
      isSavingRef.current = false;
    }
  };

  // Dashboard layout functions
  const addComponentToSlot = (slotIndex: number, componentName: string, gridSize: string) => {
    const slotKey = `${gridSize}-${slotIndex}`;
    setDashboardLayout(prev => ({
      ...prev,
      [slotKey]: { component: componentName, gridSize }
    }));
  };

  const removeComponentFromSlot = (slotIndex: number) => {
    // Remove from current grid size only
    const slotKey = `${gridSize}-${slotIndex}`;
    setDashboardLayout(prev => {
      const newLayout = { ...prev };
      delete newLayout[slotKey];
      return newLayout;
    });
  };

  // Optimized save logic with debouncing to prevent excessive re-renders
  const debouncedSave = useCallback(() => {
    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // Save to localStorage immediately
    saveCurrentSettingsToLocalStorage();
    
    // Save to backend with debouncing if authenticated
    if (user) {
      saveTimerRef.current = setTimeout(async () => {
        try {
          await saveSettingsToBackend();
        } catch (error) {
          console.error('❌ Backend save failed:', error);
        }
      }, 2000); // Increased debounce time to reduce frequency
    }
  }, [user, clockPosition, showHeaderTitle, customHeaderTitle, showSidebarCrown, customSidebarTitle, sidebarCollapsed, showSeconds, showDate, showYear, use24HourFormat, dashboardLayout, gridSize, topNavigationWidgets, quickNote, bannerImage, showBanner, bannerHeight]);

  // Only trigger save when settings actually change (with debouncing)
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
      use24HourFormat === false &&
      Object.keys(dashboardLayout).length === 0 &&
      quickNote === ''
    ) {
      return;
    }

    debouncedSave();
    
    // Cleanup timer on unmount
    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [debouncedSave]);

  // Memoize the context value to prevent unnecessary re-renders
  const value: SettingsContextType = useMemo(() => ({
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
    sidebarCollapsed,
    setSidebarCollapsed,
    editMode,
    setEditMode,
    dashboardLayout,
    setDashboardLayout,
    addComponentToSlot,
    removeComponentFromSlot,
    gridSize,
    setGridSize,
    topNavigationWidgets,
    setTopNavigationWidgets,
    quickNote,
    setQuickNote,
    bannerImage,
    setBannerImage,
    showBanner,
    setShowBanner,
    bannerHeight,
    setBannerHeight,
    saveSettingsToBackend,
  }), [
    clockPosition,
    showHeaderTitle,
    customHeaderTitle,
    showSeconds,
    showDate,
    showYear,
    use24HourFormat,
    showSidebarCrown,
    customSidebarTitle,
    sidebarCollapsed,
    editMode,
    dashboardLayout,
    gridSize,
    topNavigationWidgets,
    quickNote,
    bannerImage,
    showBanner,
    bannerHeight,
    addComponentToSlot,
    removeComponentFromSlot,
    saveSettingsToBackend,
  ]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    console.error('useSettings must be used within a SettingsProvider. Current component tree may not have SettingsProvider as ancestor.');
    // Return default values to prevent app crash
    return {
      clockPosition: 'left' as const,
      setClockPosition: () => {},
      showHeaderTitle: true,
      setShowHeaderTitle: () => {},
      customHeaderTitle: 'Premium Dashboard',
      setCustomHeaderTitle: () => {},
      showSeconds: true,
      setShowSeconds: () => {},
      showDate: true,
      setShowDate: () => {},
      showYear: true,
      setShowYear: () => {},
      use24HourFormat: false,
      setUse24HourFormat: () => {},
      showSidebarCrown: true,
      setShowSidebarCrown: () => {},
      customSidebarTitle: 'Premium Dashboard',
      setCustomSidebarTitle: () => {},
      sidebarCollapsed: false,
      setSidebarCollapsed: () => {},
      editMode: false,
      setEditMode: () => {},
      dashboardLayout: {},
      setDashboardLayout: () => {},
      addComponentToSlot: () => {},
      removeComponentFromSlot: () => {},
      gridSize: '4x4' as const,
      setGridSize: () => {},
      topNavigationWidgets: [],
      setTopNavigationWidgets: () => {},
      quickNote: '',
      setQuickNote: () => {},
      bannerImage: '',
      setBannerImage: () => {},
      showBanner: false,
      setShowBanner: () => {},
      bannerHeight: 192,
      setBannerHeight: () => {},
      saveSettingsToBackend: async () => {},
    };
  }
  return context;
}