import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspaceProfile } from '@/contexts/WorkspaceProfileContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Briefcase, Home, User, Settings, Plus } from 'lucide-react';
import { motion } from 'framer-motion';

const categoryIcons = {
  personal: Home,
  work: Briefcase,
  fun: Settings,
  default: User,
};

export function WorkspaceSelectionPage() {
  const { profiles, currentProfile, loading, switchToProfile, createProfile } = useWorkspaceProfile();
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Only redirect if we have a current profile AND we're not in a loading state
  // But allow users to manually navigate to workspace selection to switch profiles
  useEffect(() => {
    if (currentProfile && !loading && profiles.length > 0) {
      // Only auto-redirect if there's a persisted profile preference
      const persistedProfileId = localStorage.getItem('currentWorkspaceProfile');
      if (persistedProfileId && currentProfile.id === persistedProfileId) {
        // Use setTimeout to avoid immediate redirect during initial load
        const timer = setTimeout(() => {
          navigate('/', { replace: true });
        }, 500); // Increased delay to allow profile switching
        return () => clearTimeout(timer);
      }
    }
  }, [currentProfile, loading, profiles.length, navigate]);

  const handleSelectWorkspace = async (profileId: string) => {
    setIsLoading(true);
    setSelectedProfileId(profileId);
    
    try {
      await switchToProfile(profileId);
      // Use setTimeout to ensure state has settled before navigating
      setTimeout(() => {
        toast({
          title: "Workspace loaded",
          description: "Welcome to your workspace!",
        });
        navigate('/', { replace: true });
      }, 200);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setSelectedProfileId(null);
    }
  };

  const handleCreateNew = async () => {
    setIsLoading(true);
    
    try {
      const newProfile = await createProfile('New Workspace', 'personal');
      if (newProfile) {
        await switchToProfile(newProfile.id);
        // Use setTimeout to ensure state has settled before navigating
        setTimeout(() => {
          toast({
            title: "Workspace created",
            description: "Welcome to your new workspace!",
          });
          navigate('/', { replace: true });
        }, 200);
      } else {
        throw new Error('Failed to create profile');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create workspace. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Group profiles by category
  const groupedProfiles = profiles.reduce((acc, profile) => {
    const category = profile.category || 'default';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(profile);
    return acc;
  }, {} as Record<string, typeof profiles>);

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/20 p-6">
      <div className="w-full max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold tracking-tight mb-2">Select Your Workspace</h1>
          <p className="text-muted-foreground">
            Choose a workspace to continue or create a new one
          </p>
        </motion.div>

        <div className="space-y-6">
          {Object.entries(groupedProfiles).map(([category, categoryProfiles]) => {
            const IconComponent = categoryIcons[category as keyof typeof categoryIcons] || categoryIcons.default;
            
            return (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <IconComponent className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-lg font-semibold capitalize">{category}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categoryProfiles.map((profile) => (
                    <Card
                      key={profile.id}
                      className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105"
                      onClick={() => handleSelectWorkspace(profile.id)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{profile.name}</CardTitle>
                          {profile.is_default && (
                            <Badge variant="secondary" className="text-xs">
                              Default
                            </Badge>
                          )}
                        </div>
                        <CardDescription className="text-sm">
                          Last updated {new Date(profile.updated_at).toLocaleDateString()}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <Button
                          className="w-full"
                          disabled={isLoading}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectWorkspace(profile.id);
                          }}
                        >
                          {isLoading && selectedProfileId === profile.id ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Loading...
                            </>
                          ) : (
                            'Enter Workspace'
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </motion.div>
            );
          })}

          {/* Create new workspace option */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
          >
            <Card 
              className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 border-dashed border-2"
              onClick={handleCreateNew}
            >
              <CardHeader className="text-center">
                <div className="flex justify-center mb-2">
                  <Plus className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-lg">Create New Workspace</CardTitle>
                <CardDescription>
                  Start fresh with a new workspace configuration
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <Button
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateNew();
                  }}
                >
                  {isLoading && selectedProfileId === null ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Create Workspace
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}