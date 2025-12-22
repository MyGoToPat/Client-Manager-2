import type { AnalyticsData } from '../types';
import { mockClients } from './clients.mock';

export const mockAnalyticsData: AnalyticsData = {
  mrr: 4250,
  mrrChange: 12,
  revenueByMonth: [
    { month: 'Jul', revenue: 3200 },
    { month: 'Aug', revenue: 3400 },
    { month: 'Sep', revenue: 3600 },
    { month: 'Oct', revenue: 3800 },
    { month: 'Nov', revenue: 4000 },
    { month: 'Dec', revenue: 4250 },
  ],
  revenueBySource: [
    { source: '1:1 Training', amount: 2500, percentage: 59 },
    { source: 'Group Programs', amount: 1200, percentage: 28 },
    { source: 'Nutrition Plans', amount: 550, percentage: 13 },
  ],
  totalClients: 6,
  activeClients: 4,
  newClientsThisMonth: 3,
  churnedClientsThisMonth: 1,
  churnRate: 5.2,
  retentionRate: 94.8,
  avgClientLifespan: 8.5,
  revenuePerClient: 708,
  ltv: 6018,
  avgCompliance: 78,
  complianceChange: 5,
  sessionsCompleted: 47,
  directivesTriggered: 156,
  avgDirectiveEffectiveness: 83.57,
  complianceByGroup: [
    { groupName: '12-Week Shred', compliance: 85 },
    { groupName: 'Morning Warriors', compliance: 92 },
    { groupName: 'Nutrition Reset', compliance: 72 },
  ],
  retentionCohort: [
    { month: 'Month 1', retained: 100 },
    { month: 'Month 2', retained: 95 },
    { month: 'Month 3', retained: 88 },
    { month: 'Month 4', retained: 82 },
    { month: 'Month 5', retained: 78 },
    { month: 'Month 6', retained: 75 },
  ],
  topClientsByLtv: [
    { client: mockClients[4], ltv: 8500 },
    { client: mockClients[0], ltv: 6200 },
    { client: mockClients[1], ltv: 4800 },
    { client: mockClients[3], ltv: 2100 },
  ],
  atRiskClients: [
    { client: mockClients[2], compliance: 23 },
    { client: mockClients[5], compliance: 15 },
  ],
};
