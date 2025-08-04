import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { TimeDisplay } from './TimeDisplay';
import { TopNavigationGridLayout } from './TopNavigationGridLayout';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, Settings, AlignLeft, AlignCenter, AlignRight, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/contexts/SettingsContext';

interface UnifiedHeaderProps {
  editMode?: boolean;
}

export function UnifiedHeader({ editMode = false }: UnifiedHeaderProps) {
  const location = useLocation();
  const { 
    clockPosition, 
    setClockPosition, 
    showHeaderTitle, 
    setShowHeaderTitle, 
    customHeaderTitle, 
    setCustomHeaderTitle,
    hideDividers = false,
    minimalNavigationMode,
    setMinimalNavigationMode
  } = useSettings();
  const [isCustomizing, setIsCustomizing] = useState(false);

  const getPageTitle = () => {
    if (customHeaderTitle && customHeaderTitle.trim() !== '') {
      return customHeaderTitle;
    }
    
    switch (location.pathname) {
      case '/':
        return 'Premium Dashboard';
      case '/profile':
        return 'Profile';
      case '/settings':
        return 'Settings';
      case '/components':
        return 'Components';
      default:
        return 'Premium Dashboard';
    }
  };

  return (
    <header className={`${minimalNavigationMode ? 'h-12 bg-black text-white' : 'h-16 bg-background/95'} backdrop-blur-xl ${hideDividers ? '' : 'border-b border-border/50'} flex ${minimalNavigationMode ? 'items-center' : 'flex-col justify-center'} px-4 animate-fade-in relative gradient-target-header ${minimalNavigationMode ? '' : 'rounded-b-lg'}`} data-component="header">
      {/* Top Section - Title and Clock */}
      <div className={`flex items-center justify-between ${minimalNavigationMode ? '' : 'mb-2'}`}>
        <div className="flex items-center space-x-4">
          <SidebarTrigger className={`h-7 w-7 rounded border ${minimalNavigationMode ? 'bg-gray-800 hover:bg-gray-700 text-white border-gray-600' : 'bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground border-sidebar-border'}`}>
            <Menu className="h-3 w-3" />
          </SidebarTrigger>
          {showHeaderTitle && (
            <div className="flex items-center space-x-2">
              <Crown className={`h-4 w-4 ${minimalNavigationMode ? 'text-white' : 'text-primary'}`} />
              <h1 className={`text-lg font-medium ${minimalNavigationMode ? 'text-white' : 'text-foreground'}`}>
                {getPageTitle()}
              </h1>
            </div>
          )}
          {clockPosition === 'left' && <TimeDisplay />}
        </div>

        <div className="flex items-center space-x-4">
          {clockPosition === 'center' && (
            <div className="absolute left-1/2 transform -translate-x-1/2">
              <TimeDisplay />
            </div>
          )}
          
          {clockPosition === 'right' && <TimeDisplay />}
          
          {editMode && (
            <Popover open={isCustomizing} onOpenChange={setIsCustomizing}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Customize Navigation Menu
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Minimal Navigation Mode</Label>
                      <Switch
                        checked={minimalNavigationMode}
                        onCheckedChange={setMinimalNavigationMode}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Show only title and clock in a black bar
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Clock Position</Label>
                    <div className="flex space-x-2">
                      <Button
                        variant={clockPosition === 'left' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setClockPosition('left')}
                        className="flex-1"
                      >
                        <AlignLeft className="h-3 w-3 mr-1" />
                        Left
                      </Button>
                      <Button
                        variant={clockPosition === 'center' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setClockPosition('center')}
                        className="flex-1"
                      >
                        <AlignCenter className="h-3 w-3 mr-1" />
                        Center
                      </Button>
                      <Button
                        variant={clockPosition === 'right' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setClockPosition('right')}
                        className="flex-1"
                      >
                        <AlignRight className="h-3 w-3 mr-1" />
                        Right
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Show Title</Label>
                      <Switch
                        checked={showHeaderTitle}
                        onCheckedChange={setShowHeaderTitle}
                      />
                    </div>
                  </div>

                  {showHeaderTitle && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Navigation Menu Title</Label>
                      <Input
                        value={customHeaderTitle}
                        onChange={(e) => setCustomHeaderTitle(e.target.value)}
                        placeholder="Enter custom navigation menu title"
                      />
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>

      {/* Bottom Section - Navigation Menu Grid - Only show if not in minimal mode */}
      {!minimalNavigationMode && (
        <div className="flex items-center justify-center">
          <TopNavigationGridLayout editMode={editMode} />
        </div>
      )}
    </header>
  );
}