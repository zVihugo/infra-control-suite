import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  change?: number;
  description?: string;
  color?: "primary" | "accent" | "secondary";
}

export function MetricCard({ 
  title, 
  value, 
  icon: Icon, 
  change, 
  description,
  color = "primary" 
}: MetricCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case "accent":
        return "from-accent/10 to-accent/5 border-accent/20 text-accent";
      case "secondary":
        return "from-secondary/10 to-secondary/5 border-secondary/20 text-secondary";
      default:
        return "from-primary/10 to-primary/5 border-primary/20 text-primary";
    }
  };

  return (
    <Card className={`metric-card border bg-gradient-to-br ${getColorClasses()} hover:scale-105 transition-all duration-300 group`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <div className="flex items-baseline space-x-2">
            <h3 className="text-3xl font-bold text-foreground glow-text">{value}</h3>
            {change !== undefined && (
              <span className={`text-sm font-medium ${
                change >= 0 ? "text-accent" : "text-destructive"
              }`}>
                {change >= 0 ? "+" : ""}{change}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
        
        <div className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses()} group-hover:animate-pulse`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      
      <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getColorClasses()} animate-pulse`}
          style={{ width: `${Math.min(value, 100)}%` }}
        />
      </div>
    </Card>
  );
}