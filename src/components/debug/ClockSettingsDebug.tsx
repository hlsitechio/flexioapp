import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ClockSettingsDebug() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { 
    showSeconds, 
    showDate, 
    showYear, 
    use24HourFormat,
    clockPosition,
    saveSettingsToBackend 
  } = useSettings();

  const testBackendSave = async () => {
    const currentSettings = {
      showSeconds,
      showDate,
      showYear,
      use24HourFormat,
      clockPosition,
      userId: user?.id || 'Not authenticated'
    };

    if (!user) {
      console.log('No user authenticated - settings will save to localStorage only');
      toast({
        title: "No Authentication",
        description: "Settings will save to localStorage only. Sign in for cloud sync.",
        variant: "destructive"
      });
      return;
    }

    console.log('Current clock settings state:', currentSettings);
    
    toast({
      title: "Settings Test Complete ✅",
      description: `Clock settings logged to console. Auto-save: ${user ? 'Backend' : 'localStorage'}`,
    });
  };

  const handleManualSave = async () => {
    if (!user) {
      toast({
        title: "No Authentication",
        description: "Please sign in to save settings to backend.",
        variant: "destructive"
      });
      return;
    }

    try {
      await saveSettingsToBackend();
      toast({
        title: "Settings Saved! ✅",
        description: "Clock settings have been saved to Supabase backend.",
      });
    } catch (error) {
      console.error('Manual save failed:', error);
      toast({
        title: "Save Failed ❌",
        description: "Failed to save settings to backend. Check console for details.",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Database className="h-5 w-5 text-blue-500" />
          <CardTitle className="text-lg">Clock Settings Debug</CardTitle>
        </div>
        <CardDescription>
          Debug information for clock settings persistence
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <h4 className="font-medium">Current Settings</h4>
            <div className="space-y-1 text-sm">
              <div className="flex items-center gap-2">
                {showSeconds ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>Show Seconds: {showSeconds ? 'ON' : 'OFF'}</span>
              </div>
              <div className="flex items-center gap-2">
                {showDate ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>Show Date: {showDate ? 'ON' : 'OFF'}</span>
              </div>
              <div className="flex items-center gap-2">
                {showYear ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>Show Year: {showYear ? 'ON' : 'OFF'}</span>
              </div>
              <div className="flex items-center gap-2">
                {use24HourFormat ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />}
                <span>24-Hour Format: {use24HourFormat ? 'ON' : 'OFF'}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Backend Status</h4>
            <div className="space-y-2">
              <Badge variant={user ? "default" : "secondary"}>
                {user ? `Authenticated: ${user.email}` : 'Not Authenticated'}
              </Badge>
              <Badge variant={user ? "outline" : "destructive"}>
                Storage: {user ? 'Supabase Backend' : 'localStorage Only'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={testBackendSave} variant="outline" className="w-full">
            Test Backend Save & Show Toast
          </Button>
          
          <Button onClick={handleManualSave} variant="default" className="w-full" disabled={!user}>
            {user ? 'Save to Backend Now' : 'Sign In Required for Backend Save'}
          </Button>
        </div>
        
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <strong>🔧 Persistence Strategy:</strong><br/>
          • Settings save to localStorage IMMEDIATELY when changed<br/>
          • Backend sync happens 1 second later (when authenticated)<br/>
          • Page reload always loads from localStorage first<br/>
          • Backend settings only override if different from localStorage<br/>
          • Check console for detailed save/load logging
        </div>
      </CardContent>
    </Card>
  );
}