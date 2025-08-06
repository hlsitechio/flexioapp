import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Users, Settings, Database, Eye, UserCheck, Trash2, Plus, Bug, Monitor, MessageSquare, Link, Globe } from 'lucide-react';

interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  role?: string;
  profile?: {
    full_name?: string;
  };
}

interface UserWorkspace {
  id: string;
  name: string;
  created_at: string;
  user_id: string;
  profiles_count: number;
  workspace_number?: number;
  role?: string;
  urlFormat?: string;
}

interface WorkspaceProfile {
  id: string;
  name: string;
  category: string;
  is_default: boolean;
  created_at: string;
  workspace_id: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { getWorkspaceNumber } = useWorkspace();
  const { createEmptyDemoTemplate } = useWorkspaceProfile();
  
  const [users, setUsers] = useState<User[]>([]);
  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<UserWorkspace | null>(null);
  const [workspaceProfiles, setWorkspaceProfiles] = useState<WorkspaceProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [realtimeUsers, setRealtimeUsers] = useState<any[]>([]);

  // Check if current user is admin via database
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .rpc('has_role', { _user_id: user.id, _role: 'admin' });
        
        if (!error) {
          setIsAdmin(data === true);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };
    
    checkAdminStatus();
  }, [user]);

  useEffect(() => {
    if (isAdmin) {
      loadUsers();
      loadAllWorkspaces();
    }
  }, [isAdmin]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Get all users with their profiles and roles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          created_at
        `);

      if (error) throw error;

      // Get user roles
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Transform to user format with real data
      const usersData = profiles?.map(profile => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        return {
          id: profile.user_id,
          email: profile.full_name || `user-${profile.user_id.slice(0, 8)}`, 
          created_at: profile.created_at,
          last_sign_in_at: profile.created_at,
          role: userRole?.role || 'free',
          profile: {
            full_name: profile.full_name
          }
        };
      }) || [];

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast({
        title: "Error",
        description: "Failed to load users.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getWorkspaceUrlFormat = async (workspace: UserWorkspace, userRole: string) => {
    try {
      // Get all workspaces for this user to determine the correct number
      const { data: userWorkspaces, error } = await supabase
        .from('workspaces')
        .select('id, created_at')
        .eq('user_id', workspace.user_id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      const workspaceIndex = userWorkspaces?.findIndex(w => w.id === workspace.id) ?? -1;
      const workspaceNumber = workspaceIndex >= 0 ? workspaceIndex + 1 : 1;

      // Get the default profile name for this workspace
      const { data: profiles, error: profileError } = await supabase
        .from('workspace_profiles')
        .select('name, is_default')
        .eq('workspace_id', workspace.id)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true })
        .limit(1);

      if (profileError) throw profileError;

      const profileName = profiles?.[0]?.name || workspace.name;
      const cleanProfileName = profileName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');
      
      return `WRK_${workspaceNumber.toString().padStart(5, '0')}-${cleanProfileName}-${userRole}`;
    } catch (error) {
      console.error('Error generating workspace URL format:', error);
      return `WRK_00001-${workspace.name.replace(/\s+/g, '-')}-${userRole}`;
    }
  };

  const loadAllWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          id,
          name,
          created_at,
          user_id,
          workspace_profiles (count)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get user roles for workspace URL formatting
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const workspacesData = await Promise.all(data?.map(async workspace => {
        const userRole = roles?.find(r => r.user_id === workspace.user_id)?.role || 'free';
        const profiles_count = workspace.workspace_profiles?.[0]?.count || 0;
        
        const workspaceWithCount: UserWorkspace = {
          id: workspace.id,
          name: workspace.name,
          created_at: workspace.created_at,
          user_id: workspace.user_id,
          profiles_count,
          role: userRole
        };
        
        const urlFormat = await getWorkspaceUrlFormat(workspaceWithCount, userRole);
        
        return {
          ...workspaceWithCount,
          urlFormat
        };
      }) || []);

      setWorkspaces(workspacesData);
    } catch (error) {
      console.error('Error loading all workspaces:', error);
      toast({
        title: "Error",
        description: "Failed to load workspaces.",
        variant: "destructive",
      });
    }
  };

  const loadUserWorkspaces = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          id,
          name,
          created_at,
          user_id,
          workspace_profiles (count)
        `)
        .eq('user_id', userId);

      if (error) throw error;

      // Get user role
      const { data: userRoles, error: roleError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .limit(1);

      if (roleError) throw roleError;

      const userRole = userRoles?.[0]?.role || 'free';

      const workspacesData = await Promise.all(data?.map(async workspace => {
        const profiles_count = workspace.workspace_profiles?.[0]?.count || 0;
        
        const workspaceWithCount: UserWorkspace = {
          id: workspace.id,
          name: workspace.name,
          created_at: workspace.created_at,
          user_id: workspace.user_id,
          profiles_count,
          role: userRole
        };
        
        const urlFormat = await getWorkspaceUrlFormat(workspaceWithCount, userRole);
        
        return {
          ...workspaceWithCount,
          urlFormat
        };
      }) || []);

      setWorkspaces(workspacesData);
    } catch (error) {
      console.error('Error loading workspaces:', error);
      toast({
        title: "Error",
        description: "Failed to load workspaces.",
        variant: "destructive",
      });
    }
  };

  const loadWorkspaceProfiles = async (workspaceId: string) => {
    try {
      const { data, error } = await supabase
        .from('workspace_profiles')
        .select('*')
        .eq('workspace_id', workspaceId)
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: true });

      if (error) throw error;
      setWorkspaceProfiles(data || []);
    } catch (error) {
      console.error('Error loading workspace profiles:', error);
      toast({
        title: "Error",
        description: "Failed to load workspace profiles.",
        variant: "destructive",
      });
    }
  };

  const createDemoTemplates = async (workspaceId: string, userId: string) => {
    try {
      // Create Free Tier Demo
      await supabase.from('workspace_profiles').insert({
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Demo - Free Tier',
        category: 'default',
        is_default: false,
        grid_size: '3x3',
        banner_image: '',
        show_banner: false,
        banner_height: 120,
        dashboard_background: 'bg-background',
        custom_header_title: 'Dashboard',
        custom_sidebar_title: 'Dashboard',
        show_header_title: false,
        show_sidebar_crown: false,
        top_navigation_widgets: [],
        user_navigation_order: ['Profile'],
        minimal_navigation_mode: true,
        sidebar_solid: false,
        sidebar_collapsed: true,
        gradient_mode: 'none',
        hide_dividers: true,
        use_24_hour_format: false,
        show_year: false,
        show_date: true,
        show_seconds: false,
        clock_position: 'left',
        edit_mode: false,
        quick_note: '',
        dashboard_layout: {}
      });

      // Create Pro Tier Demo
      await supabase.from('workspace_profiles').insert({
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Demo - Pro Tier',
        category: 'work',
        is_default: false,
        grid_size: '4x4',
        banner_image: '',
        show_banner: true,
        banner_height: 160,
        dashboard_background: 'bg-gradient-to-br from-background to-muted/10',
        custom_header_title: 'Pro Dashboard',
        custom_sidebar_title: 'Pro Workspace',
        show_header_title: true,
        show_sidebar_crown: false,
        top_navigation_widgets: ['TimeDisplay'],
        user_navigation_order: ['Profile', 'UserSettings'],
        minimal_navigation_mode: false,
        sidebar_solid: false,
        sidebar_collapsed: false,
        gradient_mode: 'subtle',
        hide_dividers: false,
        use_24_hour_format: false,
        show_year: true,
        show_date: true,
        show_seconds: false,
        clock_position: 'left',
        edit_mode: false,
        quick_note: '',
        dashboard_layout: {}
      });

      // Create Premium Tier Demo
      await supabase.from('workspace_profiles').insert({
        user_id: userId,
        workspace_id: workspaceId,
        name: 'Demo - Premium Tier',
        category: 'personal',
        is_default: false,
        grid_size: '5x5',
        banner_image: '',
        show_banner: true,
        banner_height: 200,
        dashboard_background: 'bg-gradient-to-br from-background to-muted/20',
        custom_header_title: 'Premium Dashboard',
        custom_sidebar_title: 'Premium Workspace',
        show_header_title: true,
        show_sidebar_crown: true,
        top_navigation_widgets: ['TimeDisplay', 'EditModeToggle'],
        user_navigation_order: ['Profile', 'UserSettings', 'NotificationButton'],
        minimal_navigation_mode: false,
        sidebar_solid: true,
        sidebar_collapsed: false,
        gradient_mode: 'full',
        hide_dividers: false,
        use_24_hour_format: false,
        show_year: true,
        show_date: true,
        show_seconds: true,
        clock_position: 'left',
        edit_mode: true,
        quick_note: 'Welcome to Premium!',
        dashboard_layout: {}
      });

      await loadWorkspaceProfiles(workspaceId);
      toast({
        title: "Success",
        description: "Demo templates created successfully.",
      });
    } catch (error) {
      console.error('Error creating demo templates:', error);
      toast({
        title: "Error",
        description: "Failed to create demo templates.",
        variant: "destructive",
      });
    }
  };

  const deleteProfile = async (profileId: string) => {
    try {
      const { error } = await supabase
        .from('workspace_profiles')
        .delete()
        .eq('id', profileId);

      if (error) throw error;

      if (selectedWorkspace) {
        await loadWorkspaceProfiles(selectedWorkspace.id);
      }
      
      toast({
        title: "Success",
        description: "Profile deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting profile:', error);
      toast({
        title: "Error",
        description: "Failed to delete profile.",
        variant: "destructive",
      });
    }
  };

  const assignRole = async (userId: string, role: 'admin' | 'premium' | 'pro' | 'free') => {
    try {
      // Remove existing roles
      await supabase
        .from('user_roles')
        .delete()
        .eq('user_id', userId);

      // Insert new role
      const { error } = await supabase
        .from('user_roles')
        .insert({ user_id: userId, role });

      if (error) throw error;

      toast({
        title: "Success",
        description: `User role updated to ${role}.`,
      });
      
      await loadUsers(); // Refresh user list
      await loadAllWorkspaces(); // Refresh workspaces to update URL formats
    } catch (error) {
      console.error('Error assigning role:', error);
      toast({
        title: "Error",
        description: "Failed to assign role.",
        variant: "destructive",
      });
    }
  };

  const loadUserRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (error) throw error;

      // Add roles to users
      const usersWithRoles = users.map(user => ({
        ...user,
        role: data?.find(r => r.user_id === user.id)?.role || 'free'
      }));
      
      setUsers(usersWithRoles);
    } catch (error) {
      console.error('Error loading user roles:', error);
    }
  };

  useEffect(() => {
    if (users.length > 0) {
      loadUserRoles();
    }
  }, [users.length]);

  // Real-time user activity monitoring
  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('admin-monitoring')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_settings'
        },
        (payload) => {
          console.log('Real-time user activity:', payload);
          if (debugMode) {
            setRealtimeUsers(prev => [payload, ...prev.slice(0, 9)]);
          }
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workspaces'
        },
        (payload) => {
          console.log('Workspace activity:', payload);
          if (payload.eventType === 'INSERT') {
            loadAllWorkspaces(); // Refresh workspaces when new ones are created
            toast({
              title: "New Workspace Created!",
              description: `A user just created a new workspace: ${payload.new.name}`,
            });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, debugMode]);

  const createDebugUser = async () => {
    try {
      // Create a test profile
      const debugUserId = crypto.randomUUID();
      const { error } = await supabase
        .from('profiles')
        .insert({
          user_id: debugUserId,
          full_name: `Debug User ${new Date().toLocaleDateString()}`
        });

      if (error) throw error;

      await loadUsers();
      toast({
        title: "Debug User Created",
        description: "A debug user has been created for testing purposes.",
      });
    } catch (error) {
      console.error('Error creating debug user:', error);
      toast({
        title: "Error",
        description: "Failed to create debug user.",
        variant: "destructive",
      });
    }
  };

  const createDebugWorkspace = async () => {
    if (users.length === 0) {
      toast({
        title: "No Users",
        description: "Create a debug user first.",
        variant: "destructive",
      });
      return;
    }

    try {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const { error } = await supabase
        .from('workspaces')
        .insert({
          name: `Debug Workspace ${new Date().toLocaleTimeString()}`,
          user_id: randomUser.id
        });

      if (error) throw error;

      await loadAllWorkspaces();
      toast({
        title: "Debug Workspace Created",
        description: "A debug workspace has been created for testing.",
      });
    } catch (error) {
      console.error('Error creating debug workspace:', error);
      toast({
        title: "Error",
        description: "Failed to create debug workspace.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <Crown className="mx-auto h-12 w-12 mb-4 opacity-50" />
              <h2 className="text-xl font-semibold mb-2">Access Denied</h2>
              <p>You don't have admin privileges to access this page.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Crown className="h-8 w-8 text-primary" />
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">Manage users, workspaces, and debug templates</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="secondary" className="px-4 py-2">
            <Crown className="h-4 w-4 mr-2" />
            Super Admin
          </Badge>
          <div className="flex items-center gap-2">
            <Button
              variant={debugMode ? "default" : "outline"}
              size="sm"
              onClick={() => setDebugMode(!debugMode)}
            >
              <Bug className="h-4 w-4 mr-2" />
              Debug Mode
            </Button>
            {debugMode && (
              <>
                <Button variant="outline" size="sm" onClick={createDebugUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Debug User
                </Button>
                <Button variant="outline" size="sm" onClick={createDebugWorkspace}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Debug Workspace
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Users
          </TabsTrigger>
          <TabsTrigger value="workspaces" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Workspaces
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          {debugMode && (
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Real-time Activity
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <Input
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Sign In</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">
                            {user.profile?.full_name || 'Unnamed User'}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            ID: {user.id.slice(0, 8)}...
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'Never'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={
                            user.role === 'admin' ? 'default' :
                            user.role === 'premium' ? 'secondary' :
                            user.role === 'pro' ? 'outline' : 'secondary'
                          }>
                            {user.role || 'free'}
                          </Badge>
                          <Select
                            value={user.role || 'free'}
                            onValueChange={(role) => assignRole(user.id, role as any)}
                          >
                            <SelectTrigger className="w-24">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Admin</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                              <SelectItem value="pro">Pro</SelectItem>
                              <SelectItem value="free">Free</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedUser(user);
                            loadUserWorkspaces(user.id);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Workspaces
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workspaces" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                All Workspaces
                <Badge variant="outline" className="ml-2">
                  New URL Format
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage all user workspaces with the new role-based URL format (WRK_00001-ProfileName-role)
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workspace Name</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>URL Format</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Profiles</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {workspaces.map((workspace) => {
                    const owner = users.find(u => u.id === workspace.user_id);
                    return (
                      <TableRow key={workspace.id}>
                        <TableCell className="font-medium">{workspace.name}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {owner?.profile?.full_name || 'Unknown User'}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {owner?.email || workspace.user_id.slice(0, 8) + '...'}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <code className="text-xs bg-muted px-2 py-1 rounded">
                              {workspace.urlFormat || `WRK_00001-${workspace.name.replace(/\s+/g, '-')}-${workspace.role || 'free'}`}
                            </code>
                            <Badge variant="secondary" className="text-xs">
                              {workspace.role || 'free'}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(workspace.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">
                            {workspace.profiles_count} profiles
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setSelectedWorkspace(workspace);
                                loadWorkspaceProfiles(workspace.id);
                              }}
                            >
                              <Settings className="h-4 w-4 mr-2" />
                              Manage Profiles
                            </Button>
                            {owner && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => createDemoTemplates(workspace.id, owner.id)}
                              >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Demo Templates
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {selectedWorkspace && (
            <Card>
              <CardHeader>
                <CardTitle>
                  Profiles in "{selectedWorkspace.name}"
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Link className="h-4 w-4" />
                  <code className="text-sm bg-muted px-2 py-1 rounded">
                    {selectedWorkspace.urlFormat}
                  </code>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Profile Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Default</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {workspaceProfiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell className="font-medium">{profile.name}</TableCell>
                        <TableCell>
                          <Badge variant={
                            profile.category === 'default' ? 'default' :
                            profile.category === 'work' ? 'secondary' :
                            profile.category === 'personal' ? 'outline' : 'default'
                          }>
                            {profile.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {profile.is_default && (
                            <Badge variant="default">
                              <Crown className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          {new Date(profile.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProfile(profile.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="outline">Free</Badge>
                  Free Tier Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 3x3 Grid Size</li>
                  <li>• Plain Background</li>
                  <li>• Collapsed Sidebar</li>
                  <li>• Minimal Navigation</li>
                  <li>• Basic Clock</li>
                  <li>• No Gradients</li>
                  <li className="font-medium text-foreground">• URL: WRK_00001-Default-free</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary">Pro</Badge>
                  Pro Tier Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 4x4 Grid Size</li>
                  <li>• Subtle Gradients</li>
                  <li>• Banner Support</li>
                  <li>• Top Navigation Widgets</li>
                  <li>• Custom Titles</li>
                  <li>• Enhanced Features</li>
                  <li className="font-medium text-foreground">• URL: WRK_00001-Default-pro</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="default">Premium</Badge>
                  Premium Tier Template
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• 5x5 Grid Size</li>
                  <li>• Full Gradients</li>
                  <li>• Premium Banners</li>
                  <li>• Crown Icons</li>
                  <li>• Edit Mode</li>
                  <li>• All Features</li>
                  <li className="font-medium text-foreground">• URL: WRK_00001-Default-premium</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {debugMode && (
          <TabsContent value="realtime" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="h-5 w-5" />
                  Real-time User Activity Monitor
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Live monitoring of user actions and workspace changes for remote assistance
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Recent Activity</h3>
                    <Badge variant="secondary">
                      {realtimeUsers.length} events tracked
                    </Badge>
                  </div>
                  
                  {realtimeUsers.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Monitor className="mx-auto h-12 w-12 mb-4 opacity-50" />
                      <p>No real-time activity detected yet.</p>
                      <p className="text-sm">User actions will appear here when debug mode is active.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {realtimeUsers.map((activity, index) => (
                        <div key={index} className="p-3 border rounded-lg bg-muted/50">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">
                              {activity.eventType} on {activity.table}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {new Date().toLocaleTimeString()}
                            </span>
                          </div>
                          <pre className="text-xs mt-2 bg-background p-2 rounded overflow-x-auto">
                            {JSON.stringify(activity.new || activity.old, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Remote Assistance Tools</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <MessageSquare className="h-4 w-4" />
                            <span className="font-medium">User Communication</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            Send direct messages to users for assistance
                          </p>
                          <Button size="sm" variant="outline" className="w-full">
                            Open Chat Interface
                          </Button>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardContent className="pt-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Eye className="h-4 w-4" />
                            <span className="font-medium">User Session View</span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            View user's current dashboard and settings
                          </p>
                          <Button size="sm" variant="outline" className="w-full">
                            View Active Sessions
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
