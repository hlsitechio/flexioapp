import React, { useState } from 'react';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  ChevronDown, 
  Plus, 
  Briefcase, 
  Heart, 
  Folder, 
  Settings as SettingsIcon,
  Star,
  Check
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const categoryIcons = {
  work: Briefcase,
  personal: Heart,
  fun: Folder,
  default: SettingsIcon,
};

export function WorkspaceSwitcher() {
  const {
    profiles,
    currentProfile,
    loading,
    createProfile,
    switchToProfile,
  } = useWorkspaceProfile();

  const { toast } = useToast();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
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
      await switchToProfile(created.id);
    }
  };

  const handleSwitchProfile = async (profileId: string) => {
    await switchToProfile(profileId);
  };

  if (loading || !currentProfile) {
    return (
      <Button variant="outline" size="sm" disabled>
        <SettingsIcon className="h-4 w-4 mr-2" />
        Loading...
      </Button>
    );
  }

  const CurrentIcon = categoryIcons[currentProfile.category as keyof typeof categoryIcons];
  
  // Sort profiles to get consistent numbering
  const sortedProfiles = [...profiles].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  const currentWorkspaceNumber = sortedProfiles.findIndex(p => p.id === currentProfile.id) + 1;

  // Group profiles by category
  const groupedProfiles = profiles.reduce((acc, profile) => {
    if (!acc[profile.category]) {
      acc[profile.category] = [];
    }
    acc[profile.category].push(profile);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="flex items-center gap-2 min-w-[180px] justify-between">
            <div className="flex items-center gap-2">
              <CurrentIcon className="h-4 w-4" />
              <span className="truncate">#{currentWorkspaceNumber} {currentProfile.name}</span>
              {currentProfile.is_default && (
                <Star className="h-3 w-3 text-primary" />
              )}
            </div>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[240px]">
          <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          {Object.entries(groupedProfiles).map(([category, categoryProfiles]) => {
            const CategoryIcon = categoryIcons[category as keyof typeof categoryIcons];
            
            return (
              <DropdownMenuGroup key={category}>
                <DropdownMenuLabel className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                  <CategoryIcon className="h-3 w-3" />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </DropdownMenuLabel>
                {categoryProfiles.map((profile) => {
                  const ProfileIcon = categoryIcons[profile.category as keyof typeof categoryIcons];
                  const isActive = currentProfile.id === profile.id;
                  const workspaceNumber = sortedProfiles.findIndex(p => p.id === profile.id) + 1;
                  
                  return (
                    <DropdownMenuItem
                      key={profile.id}
                      onClick={() => !isActive && handleSwitchProfile(profile.id)}
                      className={`flex items-center gap-2 ${isActive ? 'bg-primary/10' : ''}`}
                    >
                      <ProfileIcon className="h-4 w-4" />
                      <span className="flex-1 truncate">#{workspaceNumber} {profile.name}</span>
                      <div className="flex items-center gap-1">
                        {profile.is_default && (
                          <Star className="h-3 w-3 text-primary" />
                        )}
                        {isActive && (
                          <Check className="h-3 w-3 text-primary" />
                        )}
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuGroup>
            );
          })}
          
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Profile
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create Profile Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Workspace Profile</DialogTitle>
            <DialogDescription>
              Create a new profile to save your current dashboard configuration.
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
                  <SelectItem value="work">
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      Work
                    </div>
                  </SelectItem>
                  <SelectItem value="personal">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Personal
                    </div>
                  </SelectItem>
                  <SelectItem value="fun">
                    <div className="flex items-center gap-2">
                      <Folder className="h-4 w-4" />
                      Fun
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateProfile}>Create & Switch</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}