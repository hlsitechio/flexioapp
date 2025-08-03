import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { Layout, Monitor, Navigation, Sidebar, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { GRADIENT_MODE_CONFIGS, applySolidSidebarForFullMode } from '@/components/gradient-coverage/utils/gradientModeUtils';

export function GradientModeControl() {
  const { gradientMode, setGradientMode } = useSettings();
  const [isSidebarSolid, setIsSidebarSolid] = useState(false);

  const iconMap = {
    'full': Monitor,
    'main': Layout,
    'main-nav': Navigation,
    'main-sidebar': Sidebar,
  };

  const modes = Object.values(GRADIENT_MODE_CONFIGS).map(config => ({
    ...config,
    icon: iconMap[config.id],
  }));

  const handleSidebarToggle = () => {
    applySolidSidebarForFullMode();
    setIsSidebarSolid(!isSidebarSolid);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Gradient Coverage</CardTitle>
        <CardDescription>
          Choose where the background gradient appears
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {modes.map((mode) => {
            const IconComponent = mode.icon;
            return (
              <Button
                key={mode.id}
                variant={gradientMode === mode.id ? "default" : "outline"}
                onClick={() => setGradientMode(mode.id)}
                className="h-auto p-4 flex flex-col items-center space-y-2 text-center transition-all duration-300 hover:scale-105"
              >
                <IconComponent className="h-5 w-5 transition-transform duration-200" />
                <div>
                  <div className="font-medium text-sm">{mode.name}</div>
                  <div className="text-xs opacity-70">{mode.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {gradientMode === 'full' && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20 animate-fade-in">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-primary transition-all duration-300">
                  {isSidebarSolid ? 'Transparent Sidebar' : 'Solid Sidebar'}
                </div>
                <div className="text-xs text-primary/80 transition-all duration-300">
                  {isSidebarSolid ? 'Make sidebar transparent' : 'Make sidebar 0% transparent'}
                </div>
              </div>
              <Button
                onClick={handleSidebarToggle}
                size="sm"
                variant={isSidebarSolid ? "outline" : "secondary"}
                className="ml-3 transition-all duration-300 hover:scale-105 group min-w-[100px]"
              >
                <div className="flex items-center transition-all duration-300">
                  {isSidebarSolid ? (
                    <EyeOff className="h-4 w-4 mr-1 transition-all duration-300 group-hover:scale-110" />
                  ) : (
                    <Eye className="h-4 w-4 mr-1 transition-all duration-300 group-hover:scale-110" />
                  )}
                  <span className="transition-all duration-300 animate-fade-in font-medium">
                    {isSidebarSolid ? 'Transparent' : 'Solid'}
                  </span>
                </div>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}