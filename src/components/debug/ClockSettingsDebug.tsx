import { useSettings } from '@/contexts/SettingsContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Database } from 'lucide-react';

export function ClockSettingsDebug() {
  const { user } = useAuth();
  const { 
    showSeconds, 
    showDate, 
    showYear, 
    use24HourFormat,
    clockPosition 
  } = useSettings();

  const testBackendSave = async () => {
    if (!user) {
      console.log('No user authenticated - settings will save to localStorage only');
      return;
    }

    console.log('Current clock settings state:', {
      showSeconds,
      showDate,
      showYear,
      use24HourFormat,
      clockPosition,
      userId: user.id
    });
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

        <Button onClick={testBackendSave} variant="outline" className="w-full">
          Test Backend Save (Check Console)
        </Button>
        
        <div className="text-xs text-muted-foreground bg-muted p-3 rounded">
          <strong>How it works:</strong><br/>
          • Settings auto-save 1 second after changes<br/>
          • When authenticated: saves to Supabase database<br/>
          • When not authenticated: saves to localStorage<br/>
          • Settings sync across devices when logged in
        </div>
      </CardContent>
    </Card>
  );
}