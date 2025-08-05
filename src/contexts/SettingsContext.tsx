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
  sidebarSolid: boolean;
  setSidebarSolid: (solid: boolean) => void;
  
  // Top navigation grid settings
  topNavigationWidgets: string[];
  setTopNavigationWidgets: (widgets: string[]) => void;
  minimalNavigationMode: boolean;
  setMinimalNavigationMode: (minimal: boolean) => void;
  
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
  
  // Dashboard background
  dashboardBackground: string;
  setDashboardBackground: (background: string) => void;
  
  // Gradient modes
  gradientMode: 'full' | 'main' | 'main-nav' | 'main-sidebar';
  setGradientMode: (mode: 'full' | 'main' | 'main-nav' | 'main-sidebar') => void;
  
  // Divider visibility
  hideDividers: boolean;
  setHideDividers: (hide: boolean) => void;
  
  // User navigation order
  userNavigationOrder: string[];
  setUserNavigationOrder: (order: string[]) => void;
  
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
  const lastSaveLogRef = useRef<string>('');
  const saveLogCountRef = useRef(0);
  const lastUserIdRef = useRef<string | null>(null);
  
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
        const item = localStorage.getItem(key) || defaultValue;
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
  const [sidebarSolid, setSidebarSolid] = useState<boolean>(false);
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
  
  // Minimal navigation mode
  const [minimalNavigationMode, setMinimalNavigationMode] = useState<boolean>(getStorageItem('minimalNavigationMode', false));
  
  // Quick note
  const [quickNote, setQuickNote] = useState<string>('');
  
  // Banner settings
  const [bannerImage, setBannerImage] = useState<string>('');
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [bannerHeight, setBannerHeight] = useState<number>(192);
  
  // Dashboard background
  const [dashboardBackground, setDashboardBackground] = useState<string>('bg-gradient-to-br from-background to-muted/20');
  
  // Gradient modes
  const [gradientMode, setGradientMode] = useState<'full' | 'main' | 'main-nav' | 'main-sidebar'>('main');
  
  // Divider visibility
  const [hideDividers, setHideDividers] = useState<boolean>(false);
  
  // User navigation order
  const [userNavigationOrder, setUserNavigationOrder] = useState<string[]>([
    'DarkModeToggle',
    'Profile', 
    'NotificationButton',
    'UserSettings',
    'UserCustomization',
    'SignInOut'
  ]);

  // One-time sync setup for sign-in
  const setupOneTimeSync = async () => {
    if (!user) {
      return;
    }

    // Load settings directly from backend once
    await loadSettingsFromBackend();
  };

  const applySettingsFromPayload = (data: any) => {
    if (data.clock_position !== undefined) {
      setClockPosition(data.clock_position as 'left' | 'center' | 'right');
    }
    if (data.show_header_title !== undefined) {
      setShowHeaderTitle(data.show_header_title);
    }
    if (data.custom_header_title !== undefined) {
      setCustomHeaderTitle(data.custom_header_title);
    }
    if (data.show_sidebar_crown !== undefined) {
      setShowSidebarCrown(data.show_sidebar_crown);
    }
    if (data.custom_sidebar_title !== undefined) {
      setCustomSidebarTitle(data.custom_sidebar_title);
    }
    if (data.sidebar_collapsed !== undefined) {
      setSidebarCollapsed(data.sidebar_collapsed);
    }
    if (data.sidebar_solid !== undefined) {
      setSidebarSolid(data.sidebar_solid);
    }
    if (data.show_seconds !== undefined) {
      setShowSeconds(data.show_seconds);
    }
    if (data.show_date !== undefined) {
      setShowDate(data.show_date);
    }
    if (data.show_year !== undefined) {
      setShowYear(data.show_year);
    }
    if (data.use_24_hour_format !== undefined) {
      setUse24HourFormat(data.use_24_hour_format);
    }
    if (data.grid_size !== undefined) {
      setGridSize(data.grid_size as GridSize);
    }
    if (data.top_navigation_widgets !== undefined) {
      setTopNavigationWidgets(data.top_navigation_widgets as string[]);
    }
    if (data.minimal_navigation_mode !== undefined) {
      setMinimalNavigationMode(data.minimal_navigation_mode);
    }
    if (data.quick_note !== undefined) {
      setQuickNote(data.quick_note);
    }
    if (data.banner_image !== undefined) {
      setBannerImage(data.banner_image);
    }
    if (data.show_banner !== undefined) {
      setShowBanner(data.show_banner);
    }
    if (data.banner_height !== undefined) {
      setBannerHeight(data.banner_height);
    }
    if (data.dashboard_background !== undefined) {
      setDashboardBackground(data.dashboard_background);
    }
    if (data.gradient_mode !== undefined) {
      setGradientMode(data.gradient_mode);
    }
    if (data.hide_dividers !== undefined) {
      setHideDividers(data.hide_dividers);
    }
    if (data.user_navigation_order !== undefined) {
      setUserNavigationOrder(data.user_navigation_order as string[]);
    }
    if (data.edit_mode !== undefined) {
      setEditMode(data.edit_mode);
    }
    if (data.dashboard_layout !== undefined) {
      setDashboardLayout(data.dashboard_layout as Record<string, { component: string; gridSize: string } | null>);
    }
    
    // Also apply legacy fields for backward compatibility
    if (data.dashboard_title !== undefined) {
      setCustomHeaderTitle(data.dashboard_title);
    }
    if (data.sidebar_title !== undefined) {
      setCustomSidebarTitle(data.sidebar_title);
    }
  };

  // Initialize settings based on authentication state
  useEffect(() => {
    if (isLoadingRef.current) {
      return;
    }
    
    const currentUserId = user?.id || null;
    
    if (user && currentUserId !== lastUserIdRef.current) {
      // User authenticated - load settings from backend
      lastUserIdRef.current = currentUserId;
      hasLoadedFromBackendRef.current = false; // Reset for new user
      
      // Load from backend first for authenticated users
      setTimeout(() => {
        loadSettingsFromBackend();
      }, 100);
    } else if (!user) {
      // User signed out - clear settings and reset to defaults
      hasLoadedFromBackendRef.current = false;
      lastUserIdRef.current = null;
      resetToDefaultSettings();
    }
  }, [user?.id]);

  const resetToDefaultSettings = () => {
    setClockPosition('left');
    setShowHeaderTitle(true);
    setCustomHeaderTitle('Premium Dashboard');
    setShowSidebarCrown(true);
    setCustomSidebarTitle('Premium Dashboard');
    setSidebarCollapsed(false);
    setSidebarSolid(false);
    setShowSeconds(true);
    setShowDate(true);
    setShowYear(true);
    setUse24HourFormat(false);
    setDashboardLayout({});
    setGridSize('4x4');
    setTopNavigationWidgets([]);
    setQuickNote('');
    setBannerImage('');
    setShowBanner(false);
    setBannerHeight(192);
    setDashboardBackground('bg-gradient-to-br from-background to-muted/20');
    setGradientMode('main');
    setHideDividers(false);
    setEditMode(false);
    setUserNavigationOrder([
      'DarkModeToggle',
      'Profile', 
      'NotificationButton',
      'UserSettings',
      'UserCustomization',
      'SignInOut'
    ]);
  };

  const loadSettingsFromLocalStorage = () => {
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
    
    // Dashboard background
    const savedDashboardBackground = getStorageString('dashboardBackground', 'bg-gradient-to-br from-background to-muted/20');
    
    // Gradient mode
    const savedGradientMode = getStorageString('gradientMode', 'main') as 'full' | 'main' | 'main-nav' | 'main-sidebar';
    
    // Divider visibility
    const savedHideDividers = getStorageItem('hideDividers', false);
    
    // User navigation order
    const savedUserNavigationOrder = getStorageItem('userNavigationOrder', [
      'DarkModeToggle',
      'Profile', 
      'NotificationButton',
      'UserSettings',
      'UserCustomization',
      'SignInOut'
    ]);

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
    setDashboardBackground(savedDashboardBackground);
    setGradientMode(savedGradientMode);
    setHideDividers(savedHideDividers);
    setUserNavigationOrder(savedUserNavigationOrder);
  };

  const saveCurrentSettingsToLocalStorage = () => {
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
        localStorage.setItem('minimalNavigationMode', JSON.stringify(minimalNavigationMode));
        localStorage.setItem('quickNote', quickNote);
        localStorage.setItem('bannerImage', bannerImage);
        localStorage.setItem('showBanner', JSON.stringify(showBanner));
        localStorage.setItem('bannerHeight', JSON.stringify(bannerHeight));
        localStorage.setItem('dashboardBackground', dashboardBackground);
        localStorage.setItem('gradientMode', gradientMode);
        localStorage.setItem('hideDividers', JSON.stringify(hideDividers));
        localStorage.setItem('userNavigationOrder', JSON.stringify(userNavigationOrder));
      }
    } catch (error) {
      console.warn('❌ Error saving current settings to localStorage:', error);
    }
  };

  const loadSettingsFromBackend = async () => {
    if (!user) {
      return;
    }
    
    if (isLoadingRef.current) {
      return;
    }
    
    if (isSavingRef.current) {
      return;
    }
    
    isLoadingRef.current = true;
    
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error loading settings:', error);
        return; // Keep current localStorage settings
      }

      if (data) {
        // Apply settings from backend
        applySettingsFromPayload(data);
        hasLoadedFromBackendRef.current = true;
      } else {
        // No settings found, save current localStorage settings to backend
        await saveSettingsToBackend();
      }
    } catch (error) {
      console.error('❌ Unexpected error loading settings:', error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  const saveSettingsToBackend = async () => {
    if (!user) {
      console.log('⚠️ Cannot save settings: User not authenticated');
      return;
    }
    
    if (isLoadingRef.current) {
      return;
    }
    
    if (isSavingRef.current) {
      return;
    }

    isSavingRef.current = true;

    try {
      // Create a unique identifier for this save operation
      const saveIdentifier = JSON.stringify({
        userId: user.id,
        customSidebarTitle,
        customHeaderTitle,
        gridSize,
        minimalNavigationMode,
        dashboardLayout: Object.keys(dashboardLayout).length
      });

      // Check if we've already logged this exact save recently
      if (lastSaveLogRef.current === saveIdentifier) {
        saveLogCountRef.current += 1;
        console.log(`💾 Settings save (${saveLogCountRef.current}x) - deduplicating logs`);
      } else {
        // New save operation - reset counter and log full details
        saveLogCountRef.current = 1;
        lastSaveLogRef.current = saveIdentifier;
        console.log('💾 Saving settings to backend...', {
          userId: user.id,
          userEmail: user.email,
          customSidebarTitle,
          customHeaderTitle,
          gridSize,
          minimalNavigationMode,
          dashboardLayout: Object.keys(dashboardLayout).length
        });
      }

      // Reset the log identifier after 5 seconds to allow fresh logging
      setTimeout(() => {
        lastSaveLogRef.current = '';
        saveLogCountRef.current = 0;
      }, 5000);

      const { data, error } = await supabase
        .from('user_settings')
        .upsert({
          user_id: user.id,
          clock_position: clockPosition,
          show_header_title: showHeaderTitle,
          custom_header_title: customHeaderTitle,
          show_sidebar_crown: showSidebarCrown,
          custom_sidebar_title: customSidebarTitle,
          sidebar_collapsed: sidebarCollapsed,
          sidebar_solid: sidebarSolid,
          show_seconds: showSeconds,
          show_date: showDate,
          show_year: showYear,
          use_24_hour_format: use24HourFormat,
          dashboard_layout: dashboardLayout,
          grid_size: gridSize,
          top_navigation_widgets: topNavigationWidgets,
          minimal_navigation_mode: minimalNavigationMode,
          quick_note: quickNote,
          banner_image: bannerImage,
          show_banner: showBanner,
          banner_height: bannerHeight,
          dashboard_background: dashboardBackground,
          gradient_mode: gradientMode,
          hide_dividers: hideDividers,
          edit_mode: editMode,
          user_navigation_order: userNavigationOrder,
          // Keep legacy fields for backward compatibility
          dashboard_title: customHeaderTitle,
          sidebar_title: customSidebarTitle,
        }, {
          onConflict: 'user_id'
        })
        .select();

      if (error) {
        console.error('❌ Supabase error saving settings:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
          fullError: error
        });
        throw error;
      }
    } catch (error) {
      console.error('❌ Fatal error saving settings to backend:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined,
        fullError: error
      });
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

  // Save logic for authenticated users only  
  const debouncedSave = useCallback(() => {
    // Clear existing timer
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    
    // Only save to backend if authenticated and have loaded initial settings
    if (user && hasLoadedFromBackendRef.current) {
      saveTimerRef.current = setTimeout(async () => {
        try {
          await saveSettingsToBackend();
        } catch (error) {
          console.error('❌ Backend save failed:', {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined,
            fullError: error
          });
        }
      }, 2000); // 2 seconds debounce
    }
  }, [user]); // Only depend on user, not all settings

  // Only trigger save when settings actually change (with debouncing)
  useEffect(() => {
    // Skip the first render to avoid saving default values
    if (
      clockPosition === 'left' && 
      showHeaderTitle === true && 
      customHeaderTitle === 'Premium Dashboard' && 
      showSidebarCrown === true && 
      customSidebarTitle === 'Premium Dashboard' && 
      sidebarSolid === false &&
      showSeconds === true &&
      showDate === true && 
      showYear === true && 
      use24HourFormat === false &&
      Object.keys(dashboardLayout).length === 0 &&
      quickNote === '' &&
      bannerImage === '' &&
      showBanner === false &&
      bannerHeight === 192 &&
      dashboardBackground === 'bg-gradient-to-br from-background to-muted/20' &&
      gradientMode === 'main' &&
      hideDividers === false
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
    sidebarSolid,
    setSidebarSolid,
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
    minimalNavigationMode,
    setMinimalNavigationMode,
    quickNote,
    setQuickNote,
    bannerImage,
    setBannerImage,
    showBanner,
    setShowBanner,
    bannerHeight,
    setBannerHeight,
    dashboardBackground,
    setDashboardBackground,
    gradientMode,
    setGradientMode,
    hideDividers,
    setHideDividers,
    userNavigationOrder,
    setUserNavigationOrder,
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
    sidebarSolid,
    editMode,
    dashboardLayout,
    gridSize,
    topNavigationWidgets,
    minimalNavigationMode,
    quickNote,
    bannerImage,
    showBanner,
    bannerHeight,
    dashboardBackground,
    gradientMode,
    hideDividers,
    userNavigationOrder,
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
      sidebarSolid: false,
      setSidebarSolid: () => {},
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
      minimalNavigationMode: false,
      setMinimalNavigationMode: () => {},
      quickNote: '',
      setQuickNote: () => {},
      bannerImage: '',
      setBannerImage: () => {},
      showBanner: false,
      setShowBanner: () => {},
      bannerHeight: 192,
      setBannerHeight: () => {},
      dashboardBackground: 'bg-gradient-to-br from-background to-muted/20',
      setDashboardBackground: () => {},
      gradientMode: 'main' as const,
      setGradientMode: () => {},
      hideDividers: false,
      setHideDividers: () => {},
      userNavigationOrder: [
        'DarkModeToggle',
        'Profile', 
        'NotificationButton',
        'UserSettings',
        'UserCustomization',
        'SignInOut'
      ],
      setUserNavigationOrder: () => {},
      saveSettingsToBackend: async () => {},
    };
  }
  return context;
}
