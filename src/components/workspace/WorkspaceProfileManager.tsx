import React, { useState } from 'react';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Copy, Star, Folder, Briefcase, Heart, Settings, RotateCcw, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryIcons = {
  work: Briefcase,
  personal: Heart,
  fun: Folder,
  default: Settings,
};

const categoryColors = {
  work: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  personal: 'bg-green-500/10 text-green-600 border-green-500/20',
  fun: 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  default: 'bg-gray-500/10 text-gray-600 border-gray-500/20',
};

export function WorkspaceProfileManager() {
  const {
    profiles,
    currentProfile,
    loading,
    createProfile,
    updateProfile,
    deleteProfile,
    switchToProfile,
    duplicateProfile,
    saveCurrentConfiguration,
    setAsDefault,
    resetToDefaults,
    saveDefaultConfiguration,
  } = useWorkspaceProfile();

  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newProfileCategory, setNewProfileCategory] = useState<'work' | 'personal' | 'fun' | 'default'>('personal');

  const handleCreateProfile = async () => {
    if (!newProfileName.trim()) {
      toast({
        title: "Error",
        description: "Profile name is required.",
        variant: "destructive",
      });
      return;
    }

    const created = await createProfile(newProfileName.trim(), newProfileCategory);
    if (created) {
      setIsCreateDialogOpen(false);
      setNewProfileName('');
      setNewProfileCategory('personal');
    }
  };

  const handleEditProfile = async () => {
    if (!editingProfile || !newProfileName.trim()) return;

    await updateProfile(editingProfile.id, {
      name: newProfileName.trim(),
      category: newProfileCategory,
    });

    setIsEditDialogOpen(false);
    setEditingProfile(null);
    setNewProfileName('');
    setNewProfileCategory('personal');
  };

  const handleDuplicateProfile = async (profileId: string) => {
    const sourceProfile = profiles.find(p => p.id === profileId);
    if (!sourceProfile) return;

    const newName = `${sourceProfile.name} (Copy)`;
    await duplicateProfile(profileId, newName);
  };

  const openEditDialog = (profile: any) => {
    setEditingProfile(profile);
    setNewProfileName(profile.name);
    setNewProfileCategory(profile.category);
    setIsEditDialogOpen(true);
  };

  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.category]) {
      acc[profile.category] = [];
    }
    acc[profile.category].push(profile);
    return acc;
  }, {} as Record<string, any[]>);

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <div className="text-muted-foreground">Loading workspace profiles...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Workspace Profiles
              </CardTitle>
              <CardDescription>
                Save and manage different dashboard configurations for different use cases.
              </CardDescription>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  New Profile
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Profile</DialogTitle>
                  <DialogDescription>
                    Create a new workspace profile to save your current dashboard configuration.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="profileName">Profile Name</Label>
                    <Input
                      id="profileName"
                      value={newProfileName}
                      onChange={(e) => setNewProfileName(e.target.value)}
                      placeholder="Enter profile name..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="profileCategory">Category</Label>
                    <Select value={newProfileCategory} onValueChange={(value: any) => setNewProfileCategory(value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="fun">Fun</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateProfile}>Create Profile</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {currentProfile && (
            <div className="mb-6 space-y-4">
              {/* Current Profile Info */}
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="h-5 w-5 text-primary" />
                    <div>
                      <div className="font-medium">Current Profile: {currentProfile.name}</div>
                      <div className="text-sm text-muted-foreground">
                        Category: {currentProfile.category}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveCurrentConfiguration(currentProfile.id)}
                    >
                      <Save className="h-3 w-3 mr-1" />
                      Save Changes
                    </Button>
                  </div>
                </div>
              </div>

              {/* Default Configuration Actions */}
              <div className="p-4 rounded-lg bg-muted/30 border border-muted">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Default Configuration</div>
                    <div className="text-xs text-muted-foreground">
                      Reset everything to clean state or save current defaults
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset to Defaults
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Reset to Defaults</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will reset your current profile to the default configuration. All customizations will be lost. Are you sure?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={resetToDefaults}>
                            Reset Dashboard
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={saveDefaultConfiguration}
                    >
                      <Settings className="h-3 w-3 mr-1" />
                      Save as Clean Slate
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="work">Work</TabsTrigger>
              <TabsTrigger value="personal">Personal</TabsTrigger>
              <TabsTrigger value="fun">Fun</TabsTrigger>
              <TabsTrigger value="default">Default</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              {Object.entries(groupedProfiles).map(([category, categoryProfiles]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-muted-foreground mb-3 capitalize">
                    {category} ({categoryProfiles.length})
                  </h3>
                  <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                    {categoryProfiles.map((profile) => (
                      <ProfileCard
                        key={profile.id}
                        profile={profile}
                        isActive={currentProfile?.id === profile.id}
                        onSwitch={() => switchToProfile(profile.id)}
                        onEdit={() => openEditDialog(profile)}
                        onDelete={() => deleteProfile(profile.id)}
                        onDuplicate={() => handleDuplicateProfile(profile.id)}
                        onSetDefault={() => setAsDefault(profile.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>

            {(['work', 'personal', 'fun', 'default'] as const).map((category) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                  {(groupedProfiles[category] || []).map((profile) => (
                    <ProfileCard
                      key={profile.id}
                      profile={profile}
                      isActive={currentProfile?.id === profile.id}
                      onSwitch={() => switchToProfile(profile.id)}
                      onEdit={() => openEditDialog(profile)}
                      onDelete={() => deleteProfile(profile.id)}
                      onDuplicate={() => handleDuplicateProfile(profile.id)}
                      onSetDefault={() => setAsDefault(profile.id)}
                    />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Profile Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update the name and category of your workspace profile.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editProfileName">Profile Name</Label>
              <Input
                id="editProfileName"
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Enter profile name..."
              />
            </div>
            <div>
              <Label htmlFor="editProfileCategory">Category</Label>
              <Select value={newProfileCategory} onValueChange={(value: any) => setNewProfileCategory(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="work">Work</SelectItem>
                  <SelectItem value="personal">Personal</SelectItem>
                  <SelectItem value="fun">Fun</SelectItem>
                  <SelectItem value="default">Default</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProfile}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ProfileCardProps {
  profile: any;
  isActive: boolean;
  onSwitch: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onDuplicate: () => void;
  onSetDefault: () => void;
}

function ProfileCard({
  profile,
  isActive,
  onSwitch,
  onEdit,
  onDelete,
  onDuplicate,
  onSetDefault,
}: ProfileCardProps) {
  const Icon = categoryIcons[profile.category as keyof typeof categoryIcons];
  const colorClass = categoryColors[profile.category as keyof typeof categoryColors];

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${isActive ? 'ring-2 ring-primary' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Icon className="h-4 w-4" />
            <CardTitle className="text-sm font-medium">{profile.name}</CardTitle>
          </div>
          {profile.is_default && (
            <Badge variant="secondary" className="text-xs">
              Default
            </Badge>
          )}
        </div>
        <Badge variant="outline" className={`w-fit text-xs ${colorClass}`}>
          {profile.category}
        </Badge>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center gap-2">
          <Button
            variant={isActive ? "default" : "outline"}
            size="sm"
            onClick={onSwitch}
            className="flex-1"
          >
            {isActive ? 'Active' : 'Switch'}
          </Button>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Edit className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDuplicate}>
            <Copy className="h-3 w-3" />
          </Button>
          {!profile.is_default && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Profile</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete "{profile.name}"? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={onDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
        {!profile.is_default && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onSetDefault}
            className="w-full mt-2 text-xs"
          >
            Set as Default
          </Button>
        )}
      </CardContent>
    </Card>
  );
}