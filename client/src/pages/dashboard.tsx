import { useState, useEffect } from 'react';
import { ExportDropdown } from '@/components/export-dropdown';
import { exportClients, type ExportFormat } from '@/lib/export-utils';
import { Header } from '../components/header';
import { ClientDrawer } from '../components/client-drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useStore } from '../store/useStore';
import { clientsService } from '../services';
import { useAskPat } from '../App';
import {
  NeedsAttentionSection,
  TodaysSessionsSection,
  ActivityFeedSection,
  BusinessSnapshotSection,
} from '../components/dashboard';
import {
  mockRecentActivity,
  mockNeedsAttention,
  mockBusinessStats,
  mockTodaysSessions,
} from '../mocks/dashboard.mock';
import { mockAnalyticsData } from '../mocks/analytics.mock';

function KPICard({
  icon,
  iconBgClass,
  iconTextClass,
  label,
  value,
  change,
  changePositive = true,
}: {
  icon: string;
  iconBgClass: string;
  iconTextClass: string;
  label: string;
  value: string | number;
  change?: string;
  changePositive?: boolean;
}) {
  return (
    <div className="p-5 rounded-xl bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-800 shadow-sm">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-lg ${iconBgClass} ${iconTextClass}`}>
          <span className="material-symbols-outlined text-2xl">{icon}</span>
        </div>
        {change && (
          <span
            className={`text-xs font-medium px-2 py-1 rounded-full ${
              changePositive
                ? 'text-green-500 bg-green-50 dark:bg-green-900/20'
                : 'text-slate-500 bg-slate-100 dark:bg-slate-800'
            }`}
          >
            {change}
          </span>
        )}
      </div>
      <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{value}</h3>
    </div>
  );
}

function ChurnRiskPanel({ atRiskClients }: { atRiskClients: typeof mockAnalyticsData.atRiskClients }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">Churn Risk Radar</h3>
        <button className="text-primary text-xs font-medium hover:underline" data-testid="link-view-all-churn">
          View All
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {atRiskClients.map((item, index) => {
          const isHighRisk = item.compliance < 25;
          return (
            <div
              key={item.client.id}
              className={`flex items-center justify-between p-3 rounded-lg bg-white dark:bg-[#1e293b] shadow-sm pl-4 border-l-4 ${
                isHighRisk ? 'border-l-red-500' : 'border-l-amber-500'
              }`}
              data-testid={`churn-risk-${item.client.id}`}
            >
              <div className="flex items-center gap-3">
                <Avatar className="size-8">
                  <AvatarFallback className="text-xs">
                    {item.client.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    {item.client.name}
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {isHighRisk ? `Last session: ${7 + index * 5} days ago` : 'Declining engagement'}
                  </span>
                </div>
              </div>
              <span className={`text-xs font-bold ${isHighRisk ? 'text-red-500' : 'text-amber-500'}`}>
                {isHighRisk ? 'High Risk' : 'Medium Risk'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function RevenueForecastPanel() {
  const projectedRevenue = 14200;
  const growthPercent = 14;
  const barHeights = [40, 55, 45, 70, 85, 95];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
          Revenue Forecast (Next 30 Days)
        </h3>
      </div>
      <div className="flex-1 bg-white dark:bg-[#1e293b] rounded-lg p-4 shadow-sm flex flex-col justify-end relative h-40">
        <div className="absolute top-4 left-4">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            ${projectedRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-green-500 font-medium">
            <span className="material-symbols-outlined text-xs align-middle">arrow_upward</span>
            Projected +{growthPercent}% growth
          </p>
        </div>
        <div className="flex items-end justify-between h-24 gap-2 mt-auto w-full px-2">
          {barHeights.map((height, index) => {
            const isPredicted = index >= 4;
            return (
              <div
                key={index}
                className={`w-1/6 rounded-t-sm transition-all ${
                  isPredicted
                    ? 'bg-indigo-400 dark:bg-indigo-500'
                    : 'bg-blue-300 dark:bg-blue-700'
                }`}
                style={{ height: `${height}%` }}
                title={isPredicted ? 'Predicted' : 'Actual'}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

function DirectiveEffectivenessPanel() {
  const directives = [
    { name: 'Goal Setting', percentage: 92, color: 'bg-emerald-500' },
    { name: 'Career Mapping', percentage: 78, color: 'bg-blue-500' },
    { name: 'Skill Audits', percentage: 64, color: 'bg-amber-500' },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-800 dark:text-slate-200 font-semibold text-sm">
          Directive Effectiveness
        </h3>
      </div>
      <div className="flex flex-col gap-3 bg-white dark:bg-[#1e293b] rounded-lg p-4 shadow-sm h-full justify-center">
        {directives.map((directive) => (
          <div key={directive.name} className="flex flex-col gap-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-600 dark:text-slate-400">{directive.name}</span>
              <span className="text-slate-900 dark:text-white font-medium">{directive.percentage}%</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${directive.color} rounded-full transition-all`}
                style={{ width: `${directive.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { clients, setClients, setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsService.getClients('mentor-1');
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleMessageClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const activeClients = clients.filter((c) => c.status === 'active').length || mockAnalyticsData.activeClients;
  const monthlyRevenue = mockAnalyticsData.mrr;
  const avgRating = 4.9;
  const mentorScore = 94;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" showInvite onAskPat={openAskPat} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 space-y-6 overflow-auto">
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap gap-2 items-center">
            <a
              className="text-slate-500 dark:text-[#92a4c9] text-sm font-medium hover:text-primary transition-colors"
              href="#"
              data-testid="link-dashboard-breadcrumb"
            >
              Dashboard
            </a>
            <span className="text-slate-300 dark:text-slate-600 text-sm">/</span>
            <span className="text-slate-900 dark:text-white text-sm font-medium">Analytics</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1
              className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-tight"
              data-testid="text-analytics-title"
            >
              Analytics Dashboard
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Button variant="outline" data-testid="button-date-range">
                <span className="material-symbols-outlined text-lg mr-2">calendar_today</span>
                Last 30 Days
                <span className="material-symbols-outlined text-lg ml-2">expand_more</span>
              </Button>
              <ExportDropdown
                onExport={(format: ExportFormat) => exportClients(clients, format)}
                disabled={clients.length === 0}
                label="Export Report"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-64" />
            <Skeleton className="h-48" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <KPICard
                icon="group"
                iconBgClass="bg-blue-50 dark:bg-blue-900/20"
                iconTextClass="text-blue-600 dark:text-blue-400"
                label="Active Clients"
                value={activeClients}
                change="+12%"
                changePositive={true}
              />
              <KPICard
                icon="attach_money"
                iconBgClass="bg-emerald-50 dark:bg-emerald-900/20"
                iconTextClass="text-emerald-600 dark:text-emerald-400"
                label="Monthly Revenue"
                value={`$${monthlyRevenue.toLocaleString()}`}
                change={`+${mockAnalyticsData.mrrChange}%`}
                changePositive={true}
              />
              <KPICard
                icon="star"
                iconBgClass="bg-amber-50 dark:bg-amber-900/20"
                iconTextClass="text-amber-600 dark:text-amber-400"
                label="Avg Session Rating"
                value={avgRating}
                change="0%"
                changePositive={false}
              />
              <KPICard
                icon="bolt"
                iconBgClass="bg-purple-50 dark:bg-purple-900/20"
                iconTextClass="text-purple-600 dark:text-purple-400"
                label="Mentor Score"
                value={mentorScore}
                change="+5%"
                changePositive={true}
              />
            </div>

            <div className="rounded-xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/50 dark:bg-[#151b2d] overflow-hidden">
              <div className="p-5 border-b border-indigo-100 dark:border-indigo-900/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-indigo-50/80 dark:bg-indigo-950/20">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                    <span className="material-symbols-outlined text-white text-2xl">auto_awesome</span>
                  </div>
                  <div>
                    <h2 className="text-slate-900 dark:text-white text-lg font-bold">
                      Pat's AI Forecasting
                    </h2>
                    <p className="text-slate-500 dark:text-indigo-300 text-sm">
                      Predictive insights based on your last 300 sessions
                    </p>
                  </div>
                </div>
                <Badge variant="secondary" data-testid="badge-confidence">
                  High Confidence
                </Badge>
              </div>
              <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
                <ChurnRiskPanel atRiskClients={mockAnalyticsData.atRiskClients} />
                <RevenueForecastPanel />
                <DirectiveEffectivenessPanel />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <NeedsAttentionSection
                  clients={mockNeedsAttention}
                  onMessageClient={handleMessageClient}
                  onViewClient={handleViewClient}
                />
                <TodaysSessionsSection sessions={mockTodaysSessions} />
              </div>

              <div className="space-y-6">
                <ActivityFeedSection activities={mockRecentActivity} onViewClient={handleViewClient} />
                <BusinessSnapshotSection stats={mockBusinessStats} />
              </div>
            </div>
          </>
        )}
      </main>

      <ClientDrawer />
    </div>
  );
}
