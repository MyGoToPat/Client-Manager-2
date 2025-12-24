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
  icon: string;
  invertColors?: boolean;
}

function MetricItem({ label, value, change, changeLabel, icon, invertColors }: MetricItemProps) {
  const isPositive = invertColors ? (change ?? 0) < 0 : (change ?? 0) > 0;
  const changeDisplay = changeLabel || (change !== undefined ? `${change > 0 ? '+' : ''}${change}%` : null);

  return (
    <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50">
      <div className="p-2 rounded-md bg-background">
        <span className="material-symbols-outlined text-base text-muted-foreground">{icon}</span>
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
          <span className="material-symbols-outlined text-base">
            {isPositive ? 'trending_up' : 'trending_down'}
          </span>
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
          <span className="material-symbols-outlined text-lg">attach_money</span>
          Business Snapshot
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricItem
            label="Monthly Revenue"
            value={`$${stats.mrr.toLocaleString()}`}
            change={stats.mrrChange}
            icon="attach_money"
          />
          <MetricItem
            label="Revenue/Client"
            value={`$${stats.revenuePerClient}`}
            icon="group"
          />
          <MetricItem
            label="New Clients"
            value={`+${stats.newClients}`}
            icon="person_add"
          />
          <MetricItem
            label="Churned"
            value={stats.churnedClients}
            icon="person_remove"
          />
          <MetricItem
            label="Avg Compliance"
            value={`${stats.avgCompliance}%`}
            change={stats.complianceChange}
            icon="target"
          />
        </div>
      </CardContent>
    </Card>
  );
}
