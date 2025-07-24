import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Outlet, useNavigate } from "react-router-dom";
import { Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileModal } from "@/components/ProfileModal";
import { SettingsModal } from "@/components/SettingsModal";
import { useState } from "react";

export function Layout() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <header className="h-16 border-b border-border bg-gradient-to-r from-background to-background/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
            <div className="flex items-center justify-between px-6 h-full">
              <div className="flex items-center space-x-4">
                <SidebarTrigger className="text-foreground hover:bg-muted/70 transition-colors duration-200" />
                <div className="hidden md:block">
                  <h2 className="text-lg font-semibold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Sistema de Gestão de Ativos de TI
                  </h2>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {/* Toggle de Tema */}
                <ThemeToggle />
                
                {/* Menu do Usuário */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-3 hover:bg-muted/70 transition-all duration-200 border border-transparent hover:border-border/50">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-md">
                        <User className="w-4 h-4 text-primary-foreground" />
                      </div>
                      <span className="hidden md:block font-medium text-foreground">{profile?.full_name || user?.email}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 shadow-xl border-border/50">
                    <DropdownMenuItem 
                      className="hover:bg-muted/70 transition-colors duration-200 cursor-pointer"
                      onClick={() => setProfileModalOpen(true)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="hover:bg-muted/70 transition-colors duration-200 cursor-pointer"
                      onClick={() => setSettingsModalOpen(true)}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive cursor-pointer hover:bg-destructive/10 transition-colors duration-200"
                      onClick={handleLogout}
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>
          
          {/* Conteúdo Principal */}
          <main className="flex-1 overflow-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <ProfileModal 
        open={profileModalOpen} 
        onOpenChange={setProfileModalOpen} 
      />
      <SettingsModal 
        open={settingsModalOpen} 
        onOpenChange={setSettingsModalOpen} 
      />
    </SidebarProvider>
  );
}