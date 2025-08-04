import React, { createContext, useContext, useState, useEffect } from 'react';
import { usePersistence } from '@/hooks/usePersistence';

interface DashboardSlot {
  id: string;
  componentType: string;
  size: string;
  position?: { x: number; y: number };
}

interface DashboardSettings {
  slot1: DashboardSlot[];
  slot2: DashboardSlot[];
  slot3: DashboardSlot[];
  slot4: DashboardSlot[];
  slot5: DashboardSlot[];
  slot6: DashboardSlot[];
  gridSize: string;
  bannerImage: string;
  bannerEnabled: boolean;
}

interface DashboardSettingsContextType extends DashboardSettings {
  setSlot1: (components: DashboardSlot[]) => void;
  setSlot2: (components: DashboardSlot[]) => void;
  setSlot3: (components: DashboardSlot[]) => void;
  setSlot4: (components: DashboardSlot[]) => void;
  setSlot5: (components: DashboardSlot[]) => void;
  setSlot6: (components: DashboardSlot[]) => void;
  setGridSize: (size: string) => void;
  setBannerImage: (image: string) => void;
  setBannerEnabled: (enabled: boolean) => void;
  addComponentToSlot: (slotName: keyof DashboardSettings, component: DashboardSlot) => void;
  removeComponentFromSlot: (slotName: keyof DashboardSettings, componentId: string) => void;
}

const DashboardSettingsContext = createContext<DashboardSettingsContextType | undefined>(undefined);

const defaultDashboardSettings: DashboardSettings = {
  slot1: [],
  slot2: [],
  slot3: [],
  slot4: [],
  slot5: [],
  slot6: [],
  gridSize: '3x3',
  bannerImage: '',
  bannerEnabled: false,
};

export function DashboardSettingsProvider({ children }: { children: React.ReactNode }) {
  // State
  const [slot1, setSlot1] = useState<DashboardSlot[]>(defaultDashboardSettings.slot1);
  const [slot2, setSlot2] = useState<DashboardSlot[]>(defaultDashboardSettings.slot2);
  const [slot3, setSlot3] = useState<DashboardSlot[]>(defaultDashboardSettings.slot3);
  const [slot4, setSlot4] = useState<DashboardSlot[]>(defaultDashboardSettings.slot4);
  const [slot5, setSlot5] = useState<DashboardSlot[]>(defaultDashboardSettings.slot5);
  const [slot6, setSlot6] = useState<DashboardSlot[]>(defaultDashboardSettings.slot6);
  const [gridSize, setGridSize] = useState(defaultDashboardSettings.gridSize);
  const [bannerImage, setBannerImage] = useState(defaultDashboardSettings.bannerImage);
  const [bannerEnabled, setBannerEnabled] = useState(defaultDashboardSettings.bannerEnabled);

  // Persistence
  const { 
    loadSettings, 
    saveSettings 
  } = usePersistence('dashboard_settings', {
    slot1,
    slot2,
    slot3,
    slot4,
    slot5,
    slot6,
    gridSize,
    bannerImage,
    bannerEnabled,
  });

  // Load settings on mount
  useEffect(() => {
    const loadDashboardSettings = async () => {
      const settings = await loadSettings();
      if (settings) {
        setSlot1(settings.slot1 ?? defaultDashboardSettings.slot1);
        setSlot2(settings.slot2 ?? defaultDashboardSettings.slot2);
        setSlot3(settings.slot3 ?? defaultDashboardSettings.slot3);
        setSlot4(settings.slot4 ?? defaultDashboardSettings.slot4);
        setSlot5(settings.slot5 ?? defaultDashboardSettings.slot5);
        setSlot6(settings.slot6 ?? defaultDashboardSettings.slot6);
        setGridSize(settings.gridSize ?? defaultDashboardSettings.gridSize);
        setBannerImage(settings.bannerImage ?? defaultDashboardSettings.bannerImage);
        setBannerEnabled(settings.bannerEnabled ?? defaultDashboardSettings.bannerEnabled);
      }
    };
    loadDashboardSettings();
  }, [loadSettings]);

  // Auto-save when settings change
  useEffect(() => {
    saveSettings({
      slot1,
      slot2,
      slot3,
      slot4,
      slot5,
      slot6,
      gridSize,
      bannerImage,
      bannerEnabled,
    });
  }, [
    slot1,
    slot2,
    slot3,
    slot4,
    slot5,
    slot6,
    gridSize,
    bannerImage,
    bannerEnabled,
    saveSettings
  ]);

  // Utility functions
  const addComponentToSlot = (slotName: keyof DashboardSettings, component: DashboardSlot) => {
    const setters = {
      slot1: setSlot1,
      slot2: setSlot2,
      slot3: setSlot3,
      slot4: setSlot4,
      slot5: setSlot5,
      slot6: setSlot6,
    };
    
    const setter = setters[slotName as keyof typeof setters];
    if (setter) {
      setter(prev => [...prev, component]);
    }
  };

  const removeComponentFromSlot = (slotName: keyof DashboardSettings, componentId: string) => {
    const setters = {
      slot1: setSlot1,
      slot2: setSlot2,
      slot3: setSlot3,
      slot4: setSlot4,
      slot5: setSlot5,
      slot6: setSlot6,
    };
    
    const setter = setters[slotName as keyof typeof setters];
    if (setter) {
      setter(prev => prev.filter(component => component.id !== componentId));
    }
  };

  const value = {
    slot1,
    setSlot1,
    slot2,
    setSlot2,
    slot3,
    setSlot3,
    slot4,
    setSlot4,
    slot5,
    setSlot5,
    slot6,
    setSlot6,
    gridSize,
    setGridSize,
    bannerImage,
    setBannerImage,
    bannerEnabled,
    setBannerEnabled,
    addComponentToSlot,
    removeComponentFromSlot,
  };

  return (
    <DashboardSettingsContext.Provider value={value}>
      {children}
    </DashboardSettingsContext.Provider>
  );
}

export function useDashboardSettings() {
  const context = useContext(DashboardSettingsContext);
  if (!context) {
    throw new Error('useDashboardSettings must be used within a DashboardSettingsProvider');
  }
  return context;
}