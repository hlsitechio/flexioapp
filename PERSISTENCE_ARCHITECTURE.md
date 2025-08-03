# Dashboard Persistence Architecture Documentation

## ✅ WORKING SYSTEM - DO NOT CHANGE THIS PATTERN

This document describes the **tested and working** persistence system for the Premium Dashboard application. All future implementations MUST follow this exact pattern.

## Current Working Features

### 1. Grid Layout & Widget Persistence ✅
- **2x2 Grid**: Fully functional with widget placement
- **Widget Saving**: Calendar and Prompts Gallery widgets persist correctly
- **Database Sync**: Real-time synchronization with Supabase

### 2. Title Persistence ✅
- **Sidebar Title**: Custom titles save and persist after reload
- **Dashboard Title**: Header titles save and persist after reload
- **Database Fields**: Uses both legacy and new field names for compatibility

### 3. Top Navigation Widgets ✅
- **Widget Addition**: + Add Widget functionality works
- **Persistence**: Added widgets (Task Counter, Quick Note) persist after reload
- **Array Storage**: Stored as JSON array in `top_navigation_widgets` field

## Architecture Pattern - FOLLOW THIS EXACTLY

### 1. State Management Pattern
```typescript
// SettingsContext.tsx - THE CORE PATTERN
const [customSidebarTitle, setCustomSidebarTitle] = useState<string>('Premium Dashboard');
const [customHeaderTitle, setCustomHeaderTitle] = useState<string>('Premium Dashboard');
const [topNavigationWidgets, setTopNavigationWidgets] = useState<string[]>([]);
const [dashboardLayout, setDashboardLayout] = useState<Record<string, any>>({});
```

### 2. Auto-Save Pattern with Debouncing
```typescript
// CRITICAL: useEffect with ALL dependencies for auto-save
useEffect(() => {
  if (user && !isInitialLoadRef.current) {
    clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await saveSettingsToBackend();
      } catch (error) {
        console.error('❌ Backend save failed:', error);
      }
    }, 1000);
  }
}, [
  user, 
  customSidebarTitle,    // ← MUST include new state variables here
  customHeaderTitle,     // ← MUST include new state variables here
  topNavigationWidgets,  // ← MUST include new state variables here
  dashboardLayout,       // ← MUST include new state variables here
  // ... other existing dependencies
]);
```

### 3. Supabase Save Function Pattern
```typescript
const saveSettingsToBackend = async () => {
  // CRITICAL: Console logging for debugging
  console.log('💾 Saving settings to backend...', {
    customSidebarTitle,
    customHeaderTitle,
    gridSize,
    dashboardLayout: Object.keys(dashboardLayout).length
  });

  const { data, error } = await supabase
    .from('user_settings')
    .upsert({
      user_id: user.id,
      // NEW FIELDS (primary)
      custom_sidebar_title: customSidebarTitle,
      custom_header_title: customHeaderTitle,
      top_navigation_widgets: topNavigationWidgets,
      dashboard_layout: dashboardLayout,
      
      // LEGACY FIELDS (for backward compatibility)
      sidebar_title: customSidebarTitle,
      dashboard_title: customHeaderTitle,
      
      // ... other fields
    }, {
      onConflict: 'user_id'
    });
};
```

### 4. Data Loading Pattern
```typescript
const loadUserSettings = async () => {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (data) {
    // PRIORITY: New fields first, fallback to legacy
    if (data.custom_sidebar_title !== undefined) {
      setCustomSidebarTitle(data.custom_sidebar_title);
    } else if (data.sidebar_title !== undefined) {
      setCustomSidebarTitle(data.sidebar_title);
    }
    
    if (data.custom_header_title !== undefined) {
      setCustomHeaderTitle(data.custom_header_title);
    } else if (data.dashboard_title !== undefined) {
      setCustomHeaderTitle(data.dashboard_title);
    }
    
    if (data.top_navigation_widgets !== undefined) {
      setTopNavigationWidgets(data.top_navigation_widgets || []);
    }
    
    if (data.dashboard_layout !== undefined) {
      setDashboardLayout(data.dashboard_layout || {});
    }
  }
};
```

## Database Schema Requirements

### Required Fields in `user_settings` Table
```sql
-- Primary fields (use these for new features)
custom_sidebar_title TEXT
custom_header_title TEXT
top_navigation_widgets JSONB DEFAULT '[]'::jsonb
dashboard_layout JSONB DEFAULT '{}'::jsonb

-- Legacy fields (keep for backward compatibility)
sidebar_title TEXT
dashboard_title TEXT
```

## Implementation Rules for Future Features

### 🚨 CRITICAL RULES - NEVER BREAK THESE

1. **State Variable Addition**
   - Add new state variables to SettingsContext
   - Include in the useEffect dependency array
   - Add to saveSettingsToBackend function
   - Add to loadUserSettings function

2. **Database Fields**
   - Create new field in user_settings table via migration
   - Use descriptive names (avoid generic names)
   - Set appropriate defaults
   - Maintain backward compatibility

3. **Console Logging**
   - ALWAYS add console.log in saveSettingsToBackend
   - Include the new state variables in the log
   - Use descriptive messages for debugging

4. **Testing Protocol**
   - Change the setting in UI
   - Check console for save message
   - Reload page to test persistence
   - Verify in Supabase database

### ✅ TESTED WORKING PATTERNS

#### Pattern 1: Simple String/Boolean Values
```typescript
// State
const [newSetting, setNewSetting] = useState<string>('default');

// Save
new_setting_field: newSetting,

// Load
if (data.new_setting_field !== undefined) {
  setNewSetting(data.new_setting_field);
}

// Dependencies
}, [newSetting, ...otherDeps]);
```

#### Pattern 2: Array Values (like top navigation widgets)
```typescript
// State
const [newArray, setNewArray] = useState<string[]>([]);

// Save
new_array_field: newArray,

// Load
if (data.new_array_field !== undefined) {
  setNewArray(data.new_array_field || []);
}

// Dependencies
}, [newArray, ...otherDeps]);
```

#### Pattern 3: Object Values (like dashboard layout)
```typescript
// State
const [newObject, setNewObject] = useState<Record<string, any>>({});

// Save
new_object_field: newObject,

// Load
if (data.new_object_field !== undefined) {
  setNewObject(data.new_object_field || {});
}

// Dependencies
}, [newObject, ...otherDeps]);
```

## Future Implementation Checklist

When adding ANY new persistent feature:

- [ ] Add state variable to SettingsContext
- [ ] Add to useEffect dependency array
- [ ] Add to saveSettingsToBackend function
- [ ] Add to loadUserSettings function
- [ ] Add console logging for debugging
- [ ] Create database migration if needed
- [ ] Test the complete cycle: change → save → reload → persist
- [ ] Verify in Supabase database

## Current Database State (Reference)

```json
{
  "custom_header_title": "test reloade Work or not ?",
  "custom_sidebar_title": "test",
  "top_navigation_widgets": ["task-counter", "quick-note"],
  "dashboard_layout": {
    "2x2-0": {"component": "Calendar", "gridSize": "2x2"},
    "2x2-1": {"component": "Prompts Gallery", "gridSize": "2x2"}
  },
  "grid_size": "2x2"
}
```

## Success Metrics

✅ **All tests passing:**
- Sidebar title: "test" → persists after reload
- Dashboard title: "test reloade Work or not ?" → persists after reload  
- Top navigation: ["task-counter", "quick-note"] → persists after reload
- Grid layout: 2x2 with Calendar + Prompts Gallery → persists after reload

---

**⚠️ WARNING: This system is BATTLE-TESTED and WORKING. Do not deviate from these patterns unless absolutely necessary. Any new feature MUST follow this exact architecture.**
