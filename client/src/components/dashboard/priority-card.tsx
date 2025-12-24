import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PriorityCardProps {
  title: string;
  count: number;
  subtitle: string;
  icon: string;
  variant?: 'default' | 'warning' | 'success' | 'info';
  onClick?: () => void;
}

const variantStyles = {
  default: 'text-muted-foreground',
  warning: 'text-chart-3',
  success: 'text-chart-2',
  info: 'text-chart-1',
};

export function PriorityCard({ 
  title, 
  count, 
  subtitle, 
  icon, 
  variant = 'default',
  onClick 
}: PriorityCardProps) {
  return (
    <Card 
      className={cn("hover-elevate", onClick && "cursor-pointer")}
      onClick={onClick}
      data-testid={`card-priority-${title.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{count}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
          <div className={cn("p-2 rounded-md bg-muted", variantStyles[variant])}>
            <span className="material-symbols-outlined text-xl">{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
