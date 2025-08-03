import { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Layout, Monitor, Navigation, Sidebar, Eye, EyeOff } from 'lucide-react';
import { GRADIENT_MODE_CONFIGS } from '@/components/gradient-coverage/utils/gradientModeUtils';
import { useGradientCoverage } from '@/hooks/useGradientCoverage';
import { useSidebarState } from '@/hooks/useSidebarState';

export function GradientModeControl() {
  const { gradientMode, changeGradientMode } = useGradientCoverage();
  const { isSidebarSolid, toggleSidebarTransparency, syncWithActualState } = useSidebarState();

  // Sync sidebar state when gradient mode changes
  useEffect(() => {
    syncWithActualState();
  }, [gradientMode, syncWithActualState]);

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
                onClick={() => changeGradientMode(mode.id)}
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
                onClick={toggleSidebarTransparency}
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