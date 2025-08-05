
import { LogIn, LogOut } from 'lucide-react';
import { SidebarMenuItem, SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export function SignInOut() {
  const { state } = useSidebar();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isCollapsed = state === 'collapsed';

  const handleClick = async () => {
    if (user) {
      // User is signed in, sign them out
      await signOut();
      // Clear workspace state to force workspace selection on next login
      localStorage.removeItem('currentWorkspaceProfile');
      localStorage.removeItem('workspaceId');
      navigate('/auth');
    } else {
      // User is not signed in, navigate to auth page
      navigate('/auth');
    }
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        onClick={handleClick}
        className={`w-full ${
          isCollapsed ? 'w-10 h-10 p-0 justify-center mx-auto flex items-center' : 'justify-start'
        } hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200 rounded-lg cursor-pointer`}
      >
        {user ? <LogOut className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
        {!isCollapsed && (
          <span className="ml-2">
            {user ? 'Sign Out' : 'Sign In'}
          </span>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}