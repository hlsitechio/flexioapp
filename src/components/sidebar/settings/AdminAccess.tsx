import React, { useState, useEffect } from 'react';
import { Crown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SidebarMenuButton, SidebarMenuItem, useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export function AdminAccess() {
  const { state } = useSidebar();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const isCollapsed = state === 'collapsed';
  
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
  
  if (!isAdmin) return null;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        onClick={() => navigate('/admin')}
        className={`
          group/button data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground 
          transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer
          ${isCollapsed ? 'justify-center p-2' : 'justify-start px-3 py-2'}
        `}
      >
        <Crown className={`${isCollapsed ? 'h-5 w-5' : 'h-4 w-4'} text-primary`} />
        {!isCollapsed && (
          <div className="flex-1 ml-3">
            <div className="text-sm font-medium text-sidebar-foreground group-hover/button:text-sidebar-accent-foreground">
              Admin Dashboard
            </div>
            <div className="text-xs text-sidebar-foreground/60 group-hover/button:text-sidebar-accent-foreground/80">
              Super Admin Access
            </div>
          </div>
        )}
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}