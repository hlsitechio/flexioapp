import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { useSettings } from '@/contexts/SettingsContext';
import { Minus } from 'lucide-react';

export function DividerControl() {
  const { hideDividers, setHideDividers } = useSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Minus className="h-4 w-4" />
          <span>Divider Visibility</span>
        </CardTitle>
        <CardDescription>
          Hide all dividers across the dashboard, sidebar, and navigation menu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="hide-dividers" className="text-sm font-medium">
            Hide All Dividers
          </Label>
          <Switch
            id="hide-dividers"
            checked={hideDividers}
            onCheckedChange={setHideDividers}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          When enabled, this will hide all border separators and dividers throughout the interface for a cleaner look.
        </p>
      </CardContent>
    </Card>
  );
}