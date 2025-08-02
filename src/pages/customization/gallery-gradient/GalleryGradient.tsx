import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';
import { gradients } from './gradients';

export function GalleryGradient() {
  const { dashboardBackground, setDashboardBackground } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gallery Gradient</CardTitle>
        <CardDescription>
          Select a background gradient for your dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {gradients.map((gradient) => (
            <button
              key={gradient.id}
              onClick={() => {
                if ('style' in gradient && gradient.style) {
                  // For mesh gradients, just set the ID - the useEffect in Dashboard will handle styling
                  setDashboardBackground(gradient.id);
                } else {
                  setDashboardBackground(gradient.class);
                }
              }}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                dashboardBackground === gradient.class || dashboardBackground === gradient.id
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-muted hover:border-muted-foreground/30'
              }`}
            >
              <div
                className="w-full h-16 rounded-md mb-2 relative overflow-hidden"
                style={{ background: gradient.preview }}
              />
              <p className="text-sm font-medium text-center">{gradient.name}</p>
              {(dashboardBackground === gradient.class || dashboardBackground === gradient.id) && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}