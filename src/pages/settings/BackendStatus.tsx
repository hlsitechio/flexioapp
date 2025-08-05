import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Server, Database, Wifi, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { ClockSettingsDebug } from '@/components/debug/ClockSettingsDebug';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';

export function BackendStatus() {
  const { user } = useAuth();
  const { workspace } = useWorkspace();
  
  const getConnectionStatus = () => {
    if (user && workspace) {
      return { status: 'connected', color: 'bg-green-500', text: 'Connected' };
    }
    return { status: 'disconnected', color: 'bg-red-500', text: 'Disconnected' };
  };

  const connectionStatus = getConnectionStatus();

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Server className="h-5 w-5 text-primary" />
            <CardTitle>Backend Connection</CardTitle>
          </div>
          <CardDescription>
            Current status of your connection to Supabase backend services
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${connectionStatus.color}`}></div>
              <div>
                <div className="font-medium">Database Connection</div>
                <div className="text-sm text-muted-foreground">Supabase PostgreSQL</div>
              </div>
            </div>
            <Badge variant={connectionStatus.status === 'connected' ? 'default' : 'destructive'}>
              {connectionStatus.text}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${user ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <div>
                <div className="font-medium">Authentication</div>
                <div className="text-sm text-muted-foreground">User session status</div>
              </div>
            </div>
            <Badge variant={user ? 'default' : 'destructive'}>
              {user ? 'Authenticated' : 'Not authenticated'}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${workspace ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
              <div>
                <div className="font-medium">Workspace</div>
                <div className="text-sm text-muted-foreground">Current workspace context</div>
              </div>
            </div>
            <Badge variant={workspace ? 'default' : 'secondary'}>
              {workspace ? workspace.name : 'No workspace'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* User Information */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Database className="h-5 w-5 text-primary" />
            <CardTitle>Session Information</CardTitle>
          </div>
          <CardDescription>
            Details about your current session and user data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {user && (
            <>
              <div className="flex items-center justify-between">
                <div className="font-medium">User ID</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {user.id.slice(0, 8)}...{user.id.slice(-8)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Email</div>
                <div className="text-sm text-muted-foreground">{user.email}</div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Account Created</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </>
          )}
          {workspace && (
            <>
              <div className="flex items-center justify-between">
                <div className="font-medium">Workspace ID</div>
                <div className="text-sm text-muted-foreground font-mono">
                  {workspace.id.slice(0, 8)}...{workspace.id.slice(-8)}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="font-medium">Workspace Created</div>
                <div className="text-sm text-muted-foreground">
                  {new Date(workspace.created_at).toLocaleDateString()}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Debug Information */}
      <Card className="animate-fade-in">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Clock className="h-5 w-5 text-primary" />
            <CardTitle>Debug Information</CardTitle>
          </div>
          <CardDescription>
            Technical details for debugging and troubleshooting
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ClockSettingsDebug />
        </CardContent>
      </Card>
    </div>
  );
}