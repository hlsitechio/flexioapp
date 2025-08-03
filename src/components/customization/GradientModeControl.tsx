import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/contexts/SettingsContext';
import { Layout, Monitor, Navigation, Sidebar } from 'lucide-react';
import { GRADIENT_MODE_CONFIGS } from '@/components/gradient-coverage/utils/gradientModeUtils';

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
      </CardContent>
    </Card>
  );
}