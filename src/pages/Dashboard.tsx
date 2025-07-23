import { useState, useEffect } from "react";
import { MetricCard } from "@/components/MetricCard";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Monitor, 
  Smartphone, 
  Network, 
  Wifi, 
  Package,
  TrendingUp,
  Activity,
  Clock,
  AlertCircle
} from "lucide-react";

interface AssetMetrics {
  computadores: number;
  celulares: number;
  switches: number;
  accessPoints: number;
  coletores: number;
}

export default function Dashboard() {
  const [metrics, setMetrics] = useState<AssetMetrics>({
    computadores: 0,
    celulares: 0,
    switches: 0,
    accessPoints: 0,
    coletores: 0
  });

  // Simulação de dados dinâmicos
  useEffect(() => {
    const loadMetrics = () => {
      // Simular carregamento de dados
      setTimeout(() => {
        setMetrics({
          computadores: 45,
          celulares: 32,
          switches: 12,
          accessPoints: 28,
          coletores: 15
        });
      }, 500);
    };

    loadMetrics();
  }, []);

  const totalAssets = Object.values(metrics).reduce((sum, value) => sum + value, 0);

  const recentActivities = [
    {
      id: 1,
      action: "Novo computador cadastrado",
      asset: "Notebook Dell Latitude 5520",
      user: "João Silva",
      time: "há 2 horas",
      type: "create"
    },
    {
      id: 2,
      action: "Switch atualizado",
      asset: "Switch Cisco SG300-28",
      user: "Maria Santos",
      time: "há 4 horas",
      type: "update"
    },
    {
      id: 3,
      action: "Celular removido",
      asset: "iPhone 12 Pro",
      user: "Pedro Costa",
      time: "há 6 horas",
      type: "delete"
    },
    {
      id: 4,
      action: "Access Point instalado",
      asset: "Ubiquiti UniFi AP",
      user: "Ana Oliveira",
      time: "há 1 dia",
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
      {/* Header */}
      <div className="flex flex-col space-y-2">
        <h1 className="text-4xl font-bold text-foreground glow-text">
          Dashboard de Ativos de TI
        </h1>
        <p className="text-muted-foreground text-lg">
          Visão geral e controle centralizado dos recursos tecnológicos
        </p>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {/* Total de Ativos */}
        <div className="xl:col-span-2">
          <MetricCard
            title="Total de Ativos"
            value={totalAssets}
            icon={Package}
            change={12}
            description="Crescimento mensal"
            color="primary"
          />
        </div>

        {/* Métricas por Categoria */}
        <MetricCard
          title="Computadores"
          value={metrics.computadores}
          icon={Monitor}
          change={8}
          description="Desktops e Notebooks"
          color="primary"
        />

        <MetricCard
          title="Celulares"
          value={metrics.celulares}
          icon={Smartphone}
          change={-2}
          description="Smartphones corporativos"
          color="accent"
        />

        <MetricCard
          title="Switches"
          value={metrics.switches}
          icon={Network}
          change={5}
          description="Equipamentos de rede"
          color="secondary"
        />

        <MetricCard
          title="Access Points"
          value={metrics.accessPoints}
          icon={Wifi}
          change={15}
          description="Pontos de acesso Wi-Fi"
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
                { name: "Computadores", value: metrics.computadores, color: "bg-primary", total: totalAssets },
                { name: "Access Points", value: metrics.accessPoints, color: "bg-accent", total: totalAssets },
                { name: "Celulares", value: metrics.celulares, color: "bg-blue-500", total: totalAssets },
                { name: "Coletores", value: metrics.coletores, color: "bg-green-500", total: totalAssets },
                { name: "Switches", value: metrics.switches, color: "bg-purple-500", total: totalAssets }
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
            <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors">
              Ver todas as atividades
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}