import { useState } from "react";
import { 
  Home, 
  Settings, 
  User, 
  Layout, 
  Palette, 
  Code, 
  BookOpen,
  Star,
  Bell,
  Menu
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Components", url: "/components", icon: Layout },
  { title: "Customization", url: "/customization", icon: Palette },
  { title: "Code Snippets", url: "/code-snippets", icon: Code },
  { title: "Prompts Gallery", url: "/prompts-gallery", icon: BookOpen },
];

const settingsItems = [
  { title: "Profile", url: "/profile", icon: User },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function SolidSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/") {
      return currentPath === "/";
    }
    return currentPath.startsWith(path);
  };

  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-primary text-primary-foreground font-medium" 
      : "hover:bg-muted/80 text-foreground";

  const isMainExpanded = mainItems.some((item) => isActive(item.url));
  const isSettingsExpanded = settingsItems.some((item) => isActive(item.url));

  return (
    <Sidebar
      className={`${
        collapsed ? "w-12" : "w-48"
      }`}
      collapsible="icon"
      style={{
        backgroundColor: 'transparent',
        backdropFilter: 'none'
      }}
    >
      <SidebarHeader className="p-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
            <Star className="h-3 w-3 text-primary-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="font-medium text-xs text-foreground">Dashboard</span>
              <span className="text-[10px] text-muted-foreground">Premium</span>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {!collapsed && "Navigation"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/"}
                      className={getNavCls}
                     >
                       <item.icon className="h-3 w-3" />
                       {!collapsed && <span className="ml-2 text-xs">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-muted-foreground">
            {!collapsed && "Account"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      className={getNavCls}
                     >
                       <item.icon className="h-3 w-3" />
                       {!collapsed && <span className="ml-2 text-xs">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-muted rounded-full flex items-center justify-center">
            <User className="h-3 w-3 text-muted-foreground" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xs font-medium text-foreground">User</span>
              <span className="text-[10px] text-muted-foreground">user@app.com</span>
            </div>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}