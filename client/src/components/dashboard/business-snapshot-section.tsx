import { DollarSign, TrendingUp, TrendingDown, Users, Target, UserPlus, UserMinus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { BusinessStats } from '../../types';

interface BusinessSnapshotSectionProps {
  stats: BusinessStats;
}

interface MetricItemProps {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ElementType;
  invertColors?: boolean;
}

function MetricItem({ label, value, change, changeLabel, icon: Icon, invertColors }: MetricItemProps) {
  const isPositive = invertColors ? (change ?? 0) < 0 : (change ?? 0) > 0;
  const changeDisplay = changeLabel || (change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : null);

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
      <div className="p-2 rounded-md bg-background">
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-lg font-semibold">{value}</p>
      </div>
      {changeDisplay && (
        <div className={cn(
          "flex items-center gap-1 text-sm font-medium",
          isPositive ? "text-chart-2" : "text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          {changeDisplay}
        </div>
      )}
    </div>
  );
}

export function BusinessSnapshotSection({ stats }: BusinessSnapshotSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <DollarSign className="w-4 h-4" />
          Business Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricItem
            label="Monthly Revenue"
            value={`$${stats.mrr.toLocaleString()}`}
            change={stats.mrrChange}
            icon={DollarSign}
          />
          <MetricItem
            label="Revenue/Client"
            value={`$${stats.revenuePerClient}`}
            icon={Users}
          />
          <MetricItem
            label="New Clients"
            value={`+${stats.newClients}`}
            icon={UserPlus}
          />
          <MetricItem
            label="Churned"
            value={stats.churnedClients}
            icon={UserMinus}
          />
          <MetricItem
            label="Avg Compliance"
            value={`${stats.avgCompliance}%`}
            change={stats.complianceChange}
            icon={Target}
          />
        </div>
      </CardContent>
    </Card>
  );
}
