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
import { Crown, Users, Settings, Database, Eye, UserCheck, Trash2, Plus } from 'lucide-react';

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
}

interface WorkspaceProfile {
  id: string;
  name: string;
  category: string;
  is_default: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { createEmptyDemoTemplate } = useWorkspaceProfile();
  
  const [users, setUsers] = useState<User[]>([]);
  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<UserWorkspace | null>(null);
  const [workspaceProfiles, setWorkspaceProfiles] = useState<WorkspaceProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

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
      // Get all users with their profiles
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          user_id,
          full_name,
          created_at
        `);

      if (error) throw error;

      // Transform to user format and add demo users
      const usersData = profiles?.map(profile => ({
        id: profile.user_id,
        email: profile.full_name || `user-${profile.user_id}`, // Use full_name as email fallback
        created_at: profile.created_at,
        last_sign_in_at: profile.created_at,
        profile: {
          full_name: profile.full_name
        }
      })) || [];

      // Add demo users for demonstration
      const demoUsers = [
        {
          id: 'demo-user-1',
          email: 'demo@example.com',
          created_at: '2025-01-01T00:00:00Z',
          last_sign_in_at: '2025-01-15T00:00:00Z',
          profile: {
            full_name: 'Demo User'
          }
        },
        {
          id: 'demo-user-2',
          email: 'admin@example.com',
          created_at: '2025-01-01T00:00:00Z',
          last_sign_in_at: '2025-01-15T00:00:00Z',
          profile: {
            full_name: 'Demo Admin'
          }
        }
      ];

      setUsers([...usersData, ...demoUsers]);
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

      const workspacesData = data?.map(workspace => ({
        ...workspace,
        profiles_count: workspace.workspace_profiles?.[0]?.count || 0
      })) || [];

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

      const workspacesData = data?.map(workspace => ({
        ...workspace,
        profiles_count: workspace.workspace_profiles?.[0]?.count || 0
      })) || [];

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
  }, [users.length]); // Only run when users are loaded

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
        <Badge variant="secondary" className="px-4 py-2">
          <Crown className="h-4 w-4 mr-2" />
          Super Admin
        </Badge>
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
              <CardTitle>All Workspaces</CardTitle>
              <p className="text-sm text-muted-foreground">
                View and manage all user workspaces in the system
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Workspace Name</TableHead>
                    <TableHead>Owner</TableHead>
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
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}