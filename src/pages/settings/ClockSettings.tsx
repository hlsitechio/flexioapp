import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Clock } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';

export function ClockSettings() {
  const { 
    showSeconds, 
    setShowSeconds, 
    showDate, 
    setShowDate, 
    showYear, 
    setShowYear, 
    use24HourFormat, 
    setUse24HourFormat 
  } = useSettings();

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-primary" />
          <CardTitle>Clock Display</CardTitle>
        </div>
        <CardDescription>
          Customize how the clock appears in the navigation
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-seconds">Show Seconds</Label>
            <div className="text-sm text-muted-foreground">
              Display seconds in the time format
            </div>
          </div>
          <Switch
            id="show-seconds"
            checked={showSeconds}
            onCheckedChange={setShowSeconds}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-date">Show Date</Label>
            <div className="text-sm text-muted-foreground">
              Display the current date with weekday and month
            </div>
          </div>
          <Switch
            id="show-date"
            checked={showDate}
            onCheckedChange={setShowDate}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="show-year">Show Year</Label>
            <div className="text-sm text-muted-foreground">
              Include the year in the date display (requires date to be enabled)
            </div>
          </div>
          <Switch
            id="show-year"
            checked={showYear}
            onCheckedChange={setShowYear}
            disabled={!showDate}
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="24-hour-format">24-Hour Format</Label>
            <div className="text-sm text-muted-foreground">
              Use 24-hour time format instead of 12-hour with AM/PM
            </div>
          </div>
          <Switch
            id="24-hour-format"
            checked={use24HourFormat}
            onCheckedChange={setUse24HourFormat}
          />
        </div>
      </CardContent>
    </Card>
  );
}