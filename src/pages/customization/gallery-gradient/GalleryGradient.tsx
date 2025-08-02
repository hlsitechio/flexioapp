import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSettings } from '@/contexts/SettingsContext';

const gradients = [
  {
    id: 'default',
    name: 'Default',
    class: 'bg-gradient-to-br from-background to-muted/20',
    preview: 'linear-gradient(135deg, hsl(var(--background)), hsl(var(--muted) / 0.2))'
  },
  {
    id: 'ocean',
    name: 'Ocean Depths',
    class: 'bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-950',
    preview: 'linear-gradient(135deg, #eff6ff, #e0e7ff)'
  },
  {
    id: 'sunset',
    name: 'Sunset Glow',
    class: 'bg-gradient-to-br from-orange-50 to-pink-100 dark:from-orange-950 dark:to-pink-950',
    preview: 'linear-gradient(135deg, #fff7ed, #fce7f3)'
  },
  {
    id: 'forest',
    name: 'Forest Mist',
    class: 'bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950',
    preview: 'linear-gradient(135deg, #f0fdf4, #d1fae5)'
  },
  {
    id: 'lavender',
    name: 'Lavender Dream',
    class: 'bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950 dark:to-violet-950',
    preview: 'linear-gradient(135deg, #faf5ff, #ede9fe)'
  },
  {
    id: 'golden',
    name: 'Golden Hour',
    class: 'bg-gradient-to-br from-yellow-50 to-amber-100 dark:from-yellow-950 dark:to-amber-950',
    preview: 'linear-gradient(135deg, #fefce8, #fef3c7)'
  },
  {
    id: 'rose',
    name: 'Rose Garden',
    class: 'bg-gradient-to-br from-rose-50 to-red-100 dark:from-rose-950 dark:to-red-950',
    preview: 'linear-gradient(135deg, #fff1f2, #fecaca)'
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    class: 'bg-gradient-to-br from-sky-50 to-cyan-100 dark:from-sky-950 dark:to-cyan-950',
    preview: 'linear-gradient(135deg, #f0f9ff, #cffafe)'
  },
  {
    id: 'stone',
    name: 'Stone Elegance',
    class: 'bg-gradient-to-br from-stone-50 to-gray-100 dark:from-stone-950 dark:to-gray-950',
    preview: 'linear-gradient(135deg, #fafaf9, #f3f4f6)'
  },
  {
    id: 'cosmic',
    name: 'Cosmic Dust',
    class: 'bg-gradient-to-br from-slate-50 to-zinc-100 dark:from-slate-950 dark:to-zinc-950',
    preview: 'linear-gradient(135deg, #f8fafc, #f4f4f5)'
  }
];

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
              onClick={() => setDashboardBackground(gradient.class)}
              className={`relative p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                dashboardBackground === gradient.class
                  ? 'border-primary ring-2 ring-primary/20'
                  : 'border-muted hover:border-muted-foreground/30'
              }`}
            >
              <div
                className="w-full h-16 rounded-md mb-2"
                style={{ background: gradient.preview }}
              />
              <p className="text-sm font-medium text-center">{gradient.name}</p>
              {dashboardBackground === gradient.class && (
                <div className="absolute top-2 right-2 w-3 h-3 bg-primary rounded-full" />
              )}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}