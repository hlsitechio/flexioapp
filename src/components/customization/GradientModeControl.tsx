import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { Layout, Monitor, Navigation, Sidebar, CheckCircle } from 'lucide-react';
import { GRADIENT_MODE_CONFIGS, applySolidSidebarForFullMode } from '@/components/gradient-coverage/utils/gradientModeUtils';

export function GradientModeControl() {
  const { gradientMode, setGradientMode } = useSettings();

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
                onClick={() => setGradientMode(mode.id)}
                className="h-auto p-4 flex flex-col items-center space-y-2 text-center"
              >
                <IconComponent className="h-5 w-5" />
                <div>
                  <div className="font-medium text-sm">{mode.name}</div>
                  <div className="text-xs opacity-70">{mode.description}</div>
                </div>
              </Button>
            );
          })}
        </div>
        
        {gradientMode === 'full' && (
          <div className="mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium text-primary">Solid Sidebar Option</div>
                <div className="text-xs text-primary/80">Make sidebar 0% transparent</div>
              </div>
              <Button
                onClick={applySolidSidebarForFullMode}
                size="sm"
                variant="secondary"
                className="ml-3"
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Apply
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}