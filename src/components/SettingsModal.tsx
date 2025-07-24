import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Settings, 
  Moon, 
  Sun, 
  Monitor, 
  Bell, 
  Eye, 
  Database,
  Palette,
  Languages,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "@/contexts/ThemeContext";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const { profile } = useAuth();
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  // Estados para as configurações
  const [settings, setSettings] = useState({
    notifications: true,
    autoSave: true,
    compactView: false,
    showTooltips: true,
    language: "pt-BR",
    itemsPerPage: "10",
  });

  const handleSave = () => {
    // Aqui você pode salvar as configurações no localStorage ou banco de dados
    localStorage.setItem('userSettings', JSON.stringify(settings));
    
    toast({
      title: "Configurações salvas",
      description: "Suas preferências foram atualizadas com sucesso.",
    });
    
    onOpenChange(false);
  };

  const handleReset = () => {
    const defaultSettings = {
      notifications: true,
      autoSave: true,
      compactView: false,
      showTooltips: true,
      language: "pt-BR",
      itemsPerPage: "10",
    };
    
    setSettings(defaultSettings);
    localStorage.removeItem('userSettings');
    
    toast({
      title: "Configurações resetadas",
      description: "Todas as configurações foram restauradas para o padrão.",
    });
  };

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun className="h-4 w-4" />;
      case 'dark':
        return <Moon className="h-4 w-4" />;
      default:
        return <Sun className="h-4 w-4" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações
          </DialogTitle>
          <DialogDescription>
            Personalize a experiência do sistema de acordo com suas preferências.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Aparência */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              <h3 className="text-lg font-medium">Aparência</h3>
            </div>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Tema</Label>
                  <p className="text-sm text-muted-foreground">
                    Escolha entre tema claro, escuro ou automático
                  </p>
                </div>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-32">
                    <SelectValue>
                      <div className="flex items-center gap-2">
                        {getThemeIcon()}
                        <span className="capitalize">{theme === 'light' ? 'Claro' : 'Escuro'}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        Claro
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        Escuro
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Visualização compacta</Label>
                  <p className="text-sm text-muted-foreground">
                    Reduz o espaçamento entre elementos
                  </p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, compactView: checked })
                  }
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Interface */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              <h3 className="text-lg font-medium">Interface</h3>
            </div>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Mostrar dicas</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe tooltips explicativos nos elementos
                  </p>
                </div>
                <Switch
                  checked={settings.showTooltips}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, showTooltips: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Itens por página</Label>
                  <p className="text-sm text-muted-foreground">
                    Número de registros exibidos nas tabelas
                  </p>
                </div>
                <Select 
                  value={settings.itemsPerPage} 
                  onValueChange={(value) => 
                    setSettings({ ...settings, itemsPerPage: value })
                  }
                >
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Sistema */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4" />
              <h3 className="text-lg font-medium">Sistema</h3>
            </div>
            
            <div className="space-y-4 pl-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Notificações</Label>
                  <p className="text-sm text-muted-foreground">
                    Receber alertas sobre atualizações e eventos
                  </p>
                </div>
                <Switch
                  checked={settings.notifications}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, notifications: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Salvamento automático</Label>
                  <p className="text-sm text-muted-foreground">
                    Salva automaticamente as alterações nos formulários
                  </p>
                </div>
                <Switch
                  checked={settings.autoSave}
                  onCheckedChange={(checked) => 
                    setSettings({ ...settings, autoSave: checked })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Idioma</Label>
                  <p className="text-sm text-muted-foreground">
                    Idioma da interface do sistema
                  </p>
                </div>
                <Select 
                  value={settings.language} 
                  onValueChange={(value) => 
                    setSettings({ ...settings, language: value })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">Português</SelectItem>
                    <SelectItem value="en-US">English</SelectItem>
                    <SelectItem value="es-ES">Español</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Informações de Permissão */}
          {profile?.role === 'admin' && (
            <>
              <Separator />
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <h3 className="text-lg font-medium">Administrador</h3>
                </div>
                
                <div className="pl-6">
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <p className="text-sm">
                      <strong>Permissões de Administrador:</strong> Você tem acesso total 
                      ao sistema, incluindo gerenciamento de usuários e configurações avançadas.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handleReset}>
            Restaurar Padrão
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>
              Salvar Configurações
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
