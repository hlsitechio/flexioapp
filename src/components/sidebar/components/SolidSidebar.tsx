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
  Menu,
  BarChart3
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useWorkspaceUrl } from "@/hooks/useWorkspaceUrl";
import { useScrollVisibility } from "@/hooks/useScrollVisibility";

const mainItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Components", url: "/components", icon: Layout },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
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
  const { buildWorkspaceUrl } = useWorkspaceUrl();

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

  const { atTop, scrollingDown, progress } = useScrollVisibility();
  const intensity = atTop ? 0 : progress;
  const blurPx = Math.round(intensity * (scrollingDown ? 14 : 8));
  const opacity = 1 - intensity * (scrollingDown ? 0.45 : 0.25);
  const x = scrollingDown && !atTop ? -6 : 0;

  return (
    <motion.div
      initial={false}
      animate={{ filter: `blur(${blurPx}px)`, opacity, x }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
      style={{ willChange: 'filter, opacity, transform' }}
    >
      <Sidebar
        className={`${
          collapsed ? "w-14" : "w-60"
        } bg-background border-r border-border`}
        collapsible="icon"
        style={{
          backgroundColor: 'hsl(var(--background))',
          backdropFilter: 'none',
          opacity: 1
        }}
      >
        <SidebarHeader className="p-4 border-b border-border bg-background">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Star className="h-4 w-4 text-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-semibold text-sm text-foreground">Solid Dashboard</span>
                <span className="text-xs text-muted-foreground">Premium UI</span>
              </div>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent className="bg-background">
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
                        to={buildWorkspaceUrl(item.url === "/" ? "" : item.url)} 
                        end={item.url === "/"}
                        className={getNavCls}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="ml-2">{item.title}</span>}
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
                        to={buildWorkspaceUrl(item.url)} 
                        className={getNavCls}
                      >
                        <item.icon className="h-4 w-4" />
                        {!collapsed && <span className="ml-2">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4 border-t border-border bg-background">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-medium text-foreground">User Name</span>
                <span className="text-xs text-muted-foreground">user@example.com</span>
              </div>
            )}
          </div>
        </SidebarFooter>
      </Sidebar>
    </motion.div>
  );
}