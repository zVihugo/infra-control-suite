import { useState } from "react";
import { 
  LayoutDashboard, 
  Monitor, 
  Smartphone, 
  Network, 
  Wifi, 
  Package,
  ChevronRight
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
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Dashboard", 
    url: "/", 
    icon: LayoutDashboard,
    description: "Visão geral dos ativos"
  },
  { 
    title: "Computadores", 
    url: "/computadores", 
    icon: Monitor,
    description: "Gestão de computadores"
  },
  { 
    title: "Celulares", 
    url: "/celulares", 
    icon: Smartphone,
    description: "Gestão de smartphones"
  },
  { 
    title: "Switches", 
    url: "/switches", 
    icon: Network,
    description: "Gestão de switches"
  },
  { 
    title: "Access Points", 
    url: "/access-points", 
    icon: Wifi,
    description: "Gestão de APs wireless"
  },
  { 
    title: "Coletores", 
    url: "/coletores", 
    icon: Package,
    description: "Gestão de coletores"
  },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;

  return (
    <Sidebar
      className={`${collapsed ? "w-16" : "w-72"} transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center animate-glow">
                <Monitor className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-sidebar-foreground">IT Assets</h2>
                <p className="text-sm text-sidebar-foreground/70">Sistema de Gestão</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center animate-glow">
                <Monitor className="w-6 h-6 text-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        <SidebarGroup className="px-3">
          <SidebarGroupLabel className="text-sidebar-foreground/50 text-xs uppercase tracking-wider px-3 py-2">
            {!collapsed && "Módulos do Sistema"}
          </SidebarGroupLabel>
          
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    className={`group transition-all duration-300 ${
                      isActive(item.url) 
                        ? "bg-sidebar-accent text-sidebar-primary border-l-4 border-sidebar-primary" 
                        : "hover:bg-sidebar-accent/50 text-sidebar-foreground/80 hover:text-sidebar-foreground"
                    }`}
                  >
                    <NavLink to={item.url} className="flex items-center space-x-3 px-3 py-3 rounded-lg">
                      <item.icon className={`w-5 h-5 ${isActive(item.url) ? 'text-sidebar-primary' : 'text-sidebar-foreground/60'}`} />
                      {!collapsed && (
                        <>
                          <div className="flex-1">
                            <span className="font-medium">{item.title}</span>
                            <p className="text-xs text-sidebar-foreground/50 mt-0.5">{item.description}</p>
                          </div>
                          {isActive(item.url) && (
                            <ChevronRight className="w-4 h-4 text-sidebar-primary" />
                          )}
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Footer da Sidebar */}
        {!collapsed && (
          <div className="mt-auto p-6 border-t border-sidebar-border">
            <div className="bg-sidebar-accent/30 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <span className="text-xs font-bold text-accent-foreground">IT</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-sidebar-foreground">Sistema Ativo</p>
                  <p className="text-xs text-sidebar-foreground/50">Versão 1.0</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}