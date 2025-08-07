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
import { Crown, Users, Settings, Database, Eye, UserCheck, Trash2, Plus, Bug, Monitor, MessageSquare, Link, Globe, Archive, RotateCcw, Copy, ArrowLeft, Mail, Send, CheckCircle, AlertCircle } from 'lucide-react';
import UserCommunication from '@/components/admin/UserCommunication';
import UserSessionView from '@/components/admin/UserSessionView';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useWorkspaceUrl } from '@/hooks/useWorkspaceUrl';
import { useNavigate } from 'react-router-dom';

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
  archived_at?: string | null;
}

interface ArchivedWorkspace {
  id: string;
  name: string;
  created_at: string;
  archived_at: string;
  user_id: string;
  profiles_count: number;
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
  const { buildWorkspaceUrl } = useWorkspaceUrl();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState<User[]>([]);
  const [workspaces, setWorkspaces] = useState<UserWorkspace[]>([]);
  const [archivedWorkspaces, setArchivedWorkspaces] = useState<ArchivedWorkspace[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedWorkspace, setSelectedWorkspace] = useState<UserWorkspace | null>(null);
  const [workspaceProfiles, setWorkspaceProfiles] = useState<WorkspaceProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [debugMode, setDebugMode] = useState(false);
  const [realtimeUsers, setRealtimeUsers] = useState<any[]>([]);
  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [selectedUserForWorkspace, setSelectedUserForWorkspace] = useState<string>('');
  
  // Email test state
  const [emailTestResult, setEmailTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [emailTestLoading, setEmailTestLoading] = useState(false);
  const [testEmailData, setTestEmailData] = useState({
    to: 'hlarosesurprenant@gmail.com',
    fromAlias: 'support',
    subject: 'Admin Dashboard Email Test',
    message: 'This is a test email from the admin dashboard to verify email integration.',
  });

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
      loadArchivedWorkspaces();
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

  const createDemoUser = async () => {
    try {
      // Create demo user profile
      const demoUserId = crypto.randomUUID();
      
      // Insert demo user profile
      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          user_id: demoUserId,
          full_name: 'Demo User'
        });

      if (profileError) throw profileError;

      // Assign premium role to demo user
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert({
          user_id: demoUserId,
          role: 'premium'
        });

      if (roleError) throw roleError;

      // Create demo workspace
      const { data: workspaceData, error: workspaceError } = await supabase
        .from('workspaces')
        .insert({
          name: 'Demo Workspace',
          user_id: demoUserId
        })
        .select()
        .single();

      if (workspaceError) throw workspaceError;

      // Create demo templates for the workspace
      await createDemoTemplates(workspaceData.id, demoUserId);

      await loadUsers();
      await loadAllWorkspaces();
      
      toast({
        title: "Demo User Created Successfully!",
        description: "Demo user with premium role and demo templates has been created.",
      });
    } catch (error) {
      console.error('Error creating demo user:', error);
      toast({
        title: "Error",
        description: "Failed to create demo user.",
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

  const loadArchivedWorkspaces = async () => {
    try {
      const { data, error } = await supabase
        .from('workspaces')
        .select(`
          id,
          name,
          created_at,
          archived_at,
          user_id,
          workspace_profiles (count)
        `)
        .not('archived_at', 'is', null)
        .order('archived_at', { ascending: false });

      if (error) throw error;

      // Get user roles for workspace URL formatting
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      const archivedData = data?.map(workspace => {
        const userRole = roles?.find(r => r.user_id === workspace.user_id)?.role || 'free';
        return {
          id: workspace.id,
          name: workspace.name,
          created_at: workspace.created_at,
          archived_at: workspace.archived_at!,
          user_id: workspace.user_id,
          profiles_count: workspace.workspace_profiles?.[0]?.count || 0,
          role: userRole
        };
      }) || [];

      setArchivedWorkspaces(archivedData);
    } catch (error) {
      console.error('Error loading archived workspaces:', error);
      toast({
        title: "Error",
        description: "Failed to load archived workspaces.",
        variant: "destructive",
      });
    }
  };

  const archiveWorkspace = async (workspaceId: string) => {
    try {
      const { error } = await supabase
        .rpc('archive_workspace', { _workspace_id: workspaceId });

      if (error) throw error;

      await loadAllWorkspaces();
      await loadArchivedWorkspaces();
      
      toast({
        title: "Success",
        description: "Workspace archived successfully. It can be restored within 30 days.",
      });
    } catch (error) {
      console.error('Error archiving workspace:', error);
      toast({
        title: "Error",
        description: "Failed to archive workspace.",
        variant: "destructive",
      });
    }
  };

  const restoreWorkspace = async (workspaceId: string) => {
    try {
      const { error } = await supabase
        .rpc('restore_workspace', { _workspace_id: workspaceId });

      if (error) throw error;

      await loadAllWorkspaces();
      await loadArchivedWorkspaces();
      
      toast({
        title: "Success",
        description: "Workspace restored successfully.",
      });
    } catch (error) {
      console.error('Error restoring workspace:', error);
      toast({
        title: "Error",
        description: "Failed to restore workspace.",
        variant: "destructive",
      });
    }
  };

  const createWorkspaceForUser = async () => {
    if (!selectedUserForWorkspace || !newWorkspaceName) {
      toast({
        title: "Missing Information",
        description: "Please select a user and enter a workspace name.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('workspaces')
        .insert({
          name: newWorkspaceName,
          user_id: selectedUserForWorkspace
        });

      if (error) throw error;

      await loadAllWorkspaces();
      setNewWorkspaceName('');
      setSelectedUserForWorkspace('');
      
      toast({
        title: "Success",
        description: `Workspace "${newWorkspaceName}" created for user.`,
      });
    } catch (error) {
      console.error('Error creating workspace:', error);
      toast({
        title: "Error",
        description: "Failed to create workspace.",
        variant: "destructive",
      });
    }
  };

  const copyUserId = async (userId: string) => {
    try {
      await navigator.clipboard.writeText(userId);
      toast({
        title: "Copied!",
        description: "User ID copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy user ID.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.profile?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const demoUsers = users.filter(user => 
    user.profile?.full_name?.toLowerCase().includes('demo')
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
              variant="outline"
              size="sm"
              onClick={() => navigate(buildWorkspaceUrl())}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
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
            <Button variant="default" size="sm" onClick={createDemoUser}>
              <UserCheck className="h-4 w-4 mr-2" />
              Create Demo User
            </Button>
            {debugMode && (
              <>
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
          <TabsTrigger value="archives" className="flex items-center gap-2">
            <Archive className="h-4 w-4" />
            Archives
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          {debugMode && (
            <TabsTrigger value="realtime" className="flex items-center gap-2">
              <Monitor className="h-4 w-4" />
              Real-time Activity
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {demoUsers.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCheck className="h-5 w-5" />
                  Demo Users ({demoUsers.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  {demoUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{user.profile?.full_name}</div>
                          <div className="text-sm text-muted-foreground">
                            Role: {user.role} • Created: {new Date(user.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Demo User</Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Management</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Workspace for User
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create Workspace for Specific User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="user-select">Select User</Label>
                        <Select value={selectedUserForWorkspace} onValueChange={setSelectedUserForWorkspace}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a user..." />
                          </SelectTrigger>
                          <SelectContent>
                            {users.map((user) => (
                              <SelectItem key={user.id} value={user.id}>
                                <div className="flex flex-col">
                                  <span>{user.profile?.full_name || 'Unnamed User'}</span>
                                  <span className="text-xs text-muted-foreground">ID: {user.id}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="workspace-name">Workspace Name</Label>
                        <Input
                          id="workspace-name"
                          value={newWorkspaceName}
                          onChange={(e) => setNewWorkspaceName(e.target.value)}
                          placeholder="Enter workspace name..."
                        />
                      </div>
                      <Button onClick={createWorkspaceForUser} className="w-full">
                        Create Workspace
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
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
                    <TableHead>Full User ID</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Created</TableHead>
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
                            {user.email}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                            {user.id}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyUserId(user.id)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {new Date(user.created_at).toLocaleDateString()}
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
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-orange-600 hover:text-orange-700"
                                >
                                  <Archive className="h-4 w-4 mr-2" />
                                  Archive
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Archive Workspace</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to archive "{workspace.name}"? 
                                    The workspace will be hidden from users but can be restored within 30 days.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => archiveWorkspace(workspace.id)}>
                                    Archive Workspace
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
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

        <TabsContent value="archives" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5" />
                Archived Workspaces
                <Badge variant="outline" className="ml-2">
                  30-Day Recovery
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Workspaces archived by users or admins. They can be restored within 30 days before permanent deletion.
              </p>
            </CardHeader>
            <CardContent>
              {archivedWorkspaces.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <h3 className="text-lg font-semibold mb-2">No Archived Workspaces</h3>
                  <p>When workspaces are deleted, they'll appear here for 30 days recovery period.</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Workspace Name</TableHead>
                      <TableHead>Owner</TableHead>
                      <TableHead>Archived Date</TableHead>
                      <TableHead>Days Remaining</TableHead>
                      <TableHead>Profiles</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {archivedWorkspaces.map((workspace) => {
                      const owner = users.find(u => u.id === workspace.user_id);
                      const archivedDate = new Date(workspace.archived_at);
                      const daysRemaining = Math.max(0, 30 - Math.floor((Date.now() - archivedDate.getTime()) / (1000 * 60 * 60 * 24)));
                      
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
                            {archivedDate.toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge variant={daysRemaining > 7 ? 'secondary' : daysRemaining > 3 ? 'outline' : 'destructive'}>
                              {daysRemaining} days left
                            </Badge>
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
                                onClick={() => restoreWorkspace(workspace.id)}
                                className="text-green-600 hover:text-green-700"
                              >
                                <RotateCcw className="h-4 w-4 mr-2" />
                                Restore
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete Permanently
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Permanently Delete Workspace</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to permanently delete "{workspace.name}"? 
                                      This action cannot be undone and all data will be lost forever.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={async () => {
                                        try {
                                          const { error } = await supabase
                                            .from('workspaces')
                                            .delete()
                                            .eq('id', workspace.id);
                                          
                                          if (error) throw error;
                                          
                                          await loadArchivedWorkspaces();
                                          toast({
                                            title: "Success",
                                            description: "Workspace permanently deleted.",
                                          });
                                        } catch (error) {
                                          console.error('Error deleting workspace:', error);
                                          toast({
                                            title: "Error",
                                            description: "Failed to delete workspace.",
                                            variant: "destructive",
                                          });
                                        }
                                      }}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete Forever
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
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

                  <div className="pt-4 border-t space-y-6">
                    <UserCommunication users={users} />
                    <UserSessionView users={users} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {/* Integrations Tab */}
        <TabsContent value="integrations">
          <div className="space-y-6">
            {/* Email Integration Test */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Integration Test
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-6 md:grid-cols-2">
                  {/* Email Test Form */}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="admin-email-to">To Email</Label>
                      <Input
                        id="admin-email-to"
                        value={testEmailData.to}
                        onChange={(e) => setTestEmailData({ ...testEmailData, to: e.target.value })}
                        placeholder="recipient@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="admin-email-alias">From Alias</Label>
                      <Select
                        value={testEmailData.fromAlias}
                        onValueChange={(value) => setTestEmailData({ ...testEmailData, fromAlias: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="support">FlexIO Support</SelectItem>
                          <SelectItem value="sales">FlexIO Sales</SelectItem>
                          <SelectItem value="contact">FlexIO Contact</SelectItem>
                          <SelectItem value="info">FlexIO Info</SelectItem>
                          <SelectItem value="noreply">FlexIO No-Reply</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="admin-email-subject">Subject</Label>
                      <Input
                        id="admin-email-subject"
                        value={testEmailData.subject}
                        onChange={(e) => setTestEmailData({ ...testEmailData, subject: e.target.value })}
                        placeholder="Test subject"
                      />
                    </div>

                    <div>
                      <Label htmlFor="admin-email-message">Message</Label>
                      <textarea
                        id="admin-email-message"
                        className="w-full min-h-[100px] p-3 border border-input bg-background rounded-md text-sm"
                        value={testEmailData.message}
                        onChange={(e) => setTestEmailData({ ...testEmailData, message: e.target.value })}
                        placeholder="Test message content"
                      />
                    </div>

                    <Button
                      onClick={async () => {
                        setEmailTestLoading(true);
                        setEmailTestResult(null);

                        try {
                          const getFromAddress = (alias: string) => {
                            switch (alias) {
                              case 'sales': return 'FlexIO Sales <sales@yourdomain.com>';
                              case 'contact': return 'FlexIO Contact <contact@yourdomain.com>';
                              case 'info': return 'FlexIO Info <info@yourdomain.com>';
                              case 'noreply': return 'FlexIO <noreply@yourdomain.com>';
                              default: return 'FlexIO Support <support@yourdomain.com>';
                            }
                          };

                          const { data, error } = await supabase.functions.invoke('send-email', {
                            body: {
                              to: testEmailData.to,
                              from: getFromAddress(testEmailData.fromAlias),
                              subject: testEmailData.subject,
                              html: `
                                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                                  <h2 style="color: #333; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
                                    Admin Dashboard Email Test
                                  </h2>
                                  
                                  <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                                    <h3 style="color: #64748b; margin-top: 0;">Test Details</h3>
                                    <p><strong>From Alias:</strong> ${getFromAddress(testEmailData.fromAlias)}</p>
                                    <p><strong>Sent by Admin:</strong> ${user?.email || 'Admin User'}</p>
                                    <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
                                  </div>

                                  <div style="background: #fff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px;">
                                    <h3 style="color: #64748b; margin-top: 0;">Message</h3>
                                    <p style="line-height: 1.6; white-space: pre-line;">${testEmailData.message}</p>
                                  </div>

                                  <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 8px;">
                                    <p style="color: #166534; margin: 0; font-weight: 500;">
                                      ✅ Admin email system is working correctly!
                                    </p>
                                  </div>
                                </div>
                              `,
                              tags: ['admin-test', 'system-verification'],
                            },
                          });

                          if (error) throw error;

                          setEmailTestResult({
                            success: true,
                            message: `Admin test email sent successfully! Email ID: ${data?.id || 'Unknown'}`,
                          });

                          toast({
                            title: "Admin Test Email Sent!",
                            description: "Check the recipient inbox for the test email.",
                          });

                        } catch (error: any) {
                          console.error('Admin email test error:', error);
                          setEmailTestResult({
                            success: false,
                            message: `Failed to send admin test email: ${error.message || 'Unknown error'}`,
                          });

                          toast({
                            title: "Admin Test Failed",
                            description: "Failed to send admin test email. Check the console for details.",
                            variant: "destructive",
                          });
                        } finally {
                          setEmailTestLoading(false);
                        }
                      }}
                      disabled={emailTestLoading}
                      className="w-full"
                    >
                      {emailTestLoading ? (
                        <>
                          <Send className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Admin Test Email
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Integration Status */}
                  <div className="space-y-4">
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium mb-3">Integration Status</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Resend API</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Connected</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Email Routing</span>
                          <span className="text-sm text-muted-foreground">→ hlarosesurprenant@gmail.com</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Contact Forms</span>
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-muted-foreground">Active</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                      <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                        Email Aliases Available:
                      </h4>
                      <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                        <div>• support@yourdomain.com</div>
                        <div>• sales@yourdomain.com</div>
                        <div>• contact@yourdomain.com</div>
                        <div>• info@yourdomain.com</div>
                        <div>• noreply@yourdomain.com</div>
                      </div>
                      <p className="text-xs text-blue-600 dark:text-blue-300 mt-2">
                        All emails are routed to the configured Gmail address.
                      </p>
                    </div>

                    {/* Test Result */}
                    {emailTestResult && (
                      <div className={`p-4 rounded-lg ${
                        emailTestResult.success 
                          ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800' 
                          : 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {emailTestResult.success ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`font-medium ${
                            emailTestResult.success ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                          }`}>
                            {emailTestResult.success ? 'Success' : 'Error'}
                          </span>
                        </div>
                        <p className={`text-sm ${
                          emailTestResult.success ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                        }`}>
                          {emailTestResult.message}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future Integrations */}
            <Card>
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Stripe</h4>
                    <p className="text-sm text-muted-foreground mb-2">Payment processing</p>
                    <Button size="sm" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">OpenAI</h4>
                    <p className="text-sm text-muted-foreground mb-2">AI-powered features</p>
                    <Button size="sm" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-medium mb-2">Zapier</h4>
                    <p className="text-sm text-muted-foreground mb-2">Workflow automation</p>
                    <Button size="sm" variant="outline" disabled>
                      Coming Soon
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
