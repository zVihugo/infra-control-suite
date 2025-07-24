import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Monitor, 
  Smartphone, 
  Network, 
  Wifi, 
  Package,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle,
  Users
} from "lucide-react";
import { useAssetCounts } from "@/hooks/useAssets";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { counts, isLoading } = useAssetCounts();
  const { profile, isAdmin } = useAuth();

  const totalAssets = Object.values(counts).reduce((sum, value) => sum + value, 0);

  const recentActivities = [
    {
      id: 1,
      action: "Sistema inicializado",
      asset: "Dashboard principal",
      user: profile?.full_name || "Sistema",
      time: "agora",
      type: "create"
    }
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "create":
        return <TrendingUp className="w-4 h-4 text-accent" />;
      case "update":
        return <Activity className="w-4 h-4 text-primary" />;
      case "delete":
        return <AlertCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
     
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-4xl font-bold text-foreground glow-text">
            Dashboard de Ativos de TI
          </h1>
          <p className="text-muted-foreground text-lg">
            Visão geral e controle centralizado dos recursos tecnológicos
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <ThemeToggle />
          <Card className="border-border/50 bg-card/50">
            <div className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium">
                  Perfil: {isAdmin ? 'Administrador' : 'Usuário'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>

      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        
        <div className="xl:col-span-2">
          <MetricCard
            title="Total de Ativos"
            value={isLoading ? 0 : totalAssets}
            icon={Package}
            description="Total de dispositivos"
            color="primary"
          />
        </div>

        {/* Métricas por Categoria */}
        <MetricCard
          title="Computadores"
          value={isLoading ? 0 : counts.computadores}
          icon={Monitor}
          description="Desktops e Notebooks"
          color="primary"
        />

        <MetricCard
          title="Celulares"
          value={isLoading ? 0 : counts.celulares}
          icon={Smartphone}
          description="Smartphones corporativos"
          color="accent"
        />

        <MetricCard
          title="Switches"
          value={isLoading ? 0 : counts.switches}
          icon={Network}
          description="Equipamentos de rede"
          color="secondary"
        />

        <MetricCard
          title="Access Points"
          value={isLoading ? 0 : counts.accessPoints}
          icon={Wifi}
          description="Pontos de acesso Wi-Fi"
          color="accent"
        />

          <MetricCard
          title="Coletores"
          value={isLoading ? 0 : counts.coletores}
          icon={Wifi}
          description="Coletores de dados"
          color="accent"
        />
      </div>

      {/* Seção Inferior - Gráficos e Atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Distribuição de Ativos */}
        <div className="lg:col-span-2">
          <Card className="tech-card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-foreground">Distribuição de Ativos</h3>
              <Badge variant="outline" className="text-xs">Tempo Real</Badge>
            </div>

            <div className="space-y-4">
              {[
                { name: "Computadores", value: counts.computadores, color: "bg-primary", total: totalAssets },
                { name: "Access Points", value: counts.accessPoints, color: "bg-accent", total: totalAssets },
                { name: "Celulares", value: counts.celulares, color: "bg-blue-500", total: totalAssets },
                { name: "Coletores", value: counts.coletores, color: "bg-green-500", total: totalAssets },
                { name: "Switches", value: counts.switches, color: "bg-purple-500", total: totalAssets }
              ].map((item) => {
                const percentage = totalAssets > 0 ? (item.value / item.total) * 100 : 0;
                return (
                  <div key={item.name} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{item.name}</span>
                      <span className="text-muted-foreground">{item.value} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Atividades Recentes */}
        <Card className="tech-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Atividades Recentes</h3>
            <Clock className="w-5 h-5 text-muted-foreground" />
          </div>

          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div className="flex-shrink-0 mt-1">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.asset}
                  </p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">
                      por {activity.user}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {activity.time}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <div className="text-center text-sm text-muted-foreground">
              {isAdmin ? 'Todas as operações estão disponíveis' : 'Modo somente leitura'}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}