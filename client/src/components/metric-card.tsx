import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: string;
  className?: string;
}

export function MetricCard({ label, value, trend, trendLabel, icon, className }: MetricCardProps) {
  const getTrendIcon = () => {
    if (!trend) return 'remove';
    if (trend > 0) return 'trending_up';
    return 'trending_down';
  };

  const getTrendColor = () => {
    if (!trend) return 'text-muted-foreground';
    if (trend > 0) return 'text-chart-4';
    return 'text-destructive';
  };

  return (
    <Card className={cn('hover-elevate transition-shadow', className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs uppercase tracking-wide text-muted-foreground font-medium">
              {label}
            </span>
            <span className="text-4xl font-bold font-mono text-foreground">
              {value}
            </span>
            {(trend !== undefined || trendLabel) && (
              <div className={cn('flex items-center gap-1 text-xs', getTrendColor())}>
                <span className="material-symbols-outlined text-sm">{getTrendIcon()}</span>
                <span>
                  {trend !== undefined && `${trend > 0 ? '+' : ''}${trend}%`}
                  {trendLabel && ` ${trendLabel}`}
                </span>
              </div>
            )}
          </div>
          {icon && (
            <div className="flex items-center justify-center w-10 h-10 rounded-md bg-muted text-muted-foreground">
              <span className="material-symbols-outlined text-xl">{icon}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
