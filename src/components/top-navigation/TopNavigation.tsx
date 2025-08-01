import { useState } from 'react';
import { DashboardTitle } from './DashboardTitle';
import { TimeDisplay } from './TimeDisplay';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Menu, Settings, AlignLeft, AlignCenter, AlignRight, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/contexts/SettingsContext';

interface TopNavigationProps {
  editMode?: boolean;
}

export function TopNavigation({ editMode = false }: TopNavigationProps) {
  const { 
    clockPosition, 
    setClockPosition, 
    showHeaderTitle, 
    setShowHeaderTitle, 
    customHeaderTitle, 
    setCustomHeaderTitle 
  } = useSettings();
  const [isCustomizing, setIsCustomizing] = useState(false);

  return (
    <header className="h-16 bg-background backdrop-blur-xl border-b border-border/50 flex items-center justify-between px-6 animate-fade-in relative">
      <div className="flex items-center space-x-4">
        <SidebarTrigger className="h-9 w-9 rounded-lg bg-sidebar-accent hover:bg-sidebar-accent/80 text-sidebar-foreground shadow-sm border border-sidebar-border">
          <Menu className="h-4 w-4" />
        </SidebarTrigger>
        {showHeaderTitle && <DashboardTitle customTitle={customHeaderTitle} />}
        {clockPosition === 'left' && <TimeDisplay />}
      </div>

      <div className="flex items-center space-x-6">
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
                Customize Header
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80" align="end">
              <div className="space-y-4">
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
                    <Label className="text-sm font-medium">Dashboard Title</Label>
                    <Input
                      value={customHeaderTitle}
                      onChange={(e) => setCustomHeaderTitle(e.target.value)}
                      placeholder="Enter custom title"
                    />
                  </div>
                )}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </header>
  );
}