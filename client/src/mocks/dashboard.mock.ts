import type { ClientActivity, BusinessStats, NeedsAttentionClient, Booking } from '../types';
import { mockClients } from './clients.mock';

export const mockRecentActivity: ClientActivity[] = [
  {
    id: 'act-1',
    clientId: 'client-1',
    clientName: 'Sarah Johnson',
    type: 'workout_completed',
    description: 'Completed "Upper Body Strength"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'act-2',
    clientId: 'client-2',
    clientName: 'Michael Chen',
    type: 'meal_logged',
    description: 'Logged 3,200 calories',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
  },
  {
    id: 'act-3',
    clientId: 'client-2',
    clientName: 'Michael Chen',
    type: 'message_sent',
    description: 'Sent you a message: "Hey coach, quick question..."',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'act-4',
    clientId: 'client-5',
    clientName: 'Lisa Park',
    type: 'streak_milestone',
    description: 'Hit a 30-day workout streak',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
  },
  {
    id: 'act-5',
    clientId: 'client-4',
    clientName: 'David Thompson',
    type: 'check_in',
    description: 'Completed weekly check-in',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'act-6',
    clientId: 'client-1',
    clientName: 'Sarah Johnson',
    type: 'joined_group',
    description: 'Joined "12-Week Shred" program',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
];

export const mockNeedsAttention: NeedsAttentionClient[] = [
  {
    client: mockClients[2],
    complianceDrop: 45,
    previousCompliance: 68,
    currentCompliance: 23,
    daysSinceActive: 7,
    reason: 'No workouts logged for 7 days',
  },
  {
    client: mockClients[5],
    complianceDrop: 30,
    previousCompliance: 45,
    currentCompliance: 15,
    daysSinceActive: 5,
    reason: 'Account suspended, may need follow-up',
  },
];

export const mockBusinessStats: BusinessStats = {
  mrr: 4250,
  mrrChange: 12,
  newClients: 3,
  churnedClients: 1,
  avgCompliance: 78,
  complianceChange: 5,
  revenuePerClient: 708,
};

export const mockTodaysSessions: Booking[] = [
  {
    id: 'booking-today-1',
    mentorId: 'mentor-1',
    clientId: 'client-1',
    clientName: 'Sarah Johnson',
    scheduledAt: new Date(new Date().setHours(10, 0, 0, 0)),
    durationMinutes: 60,
    status: 'scheduled',
    notes: '1:1 Training - Focus on legs',
  },
  {
    id: 'booking-today-2',
    mentorId: 'mentor-1',
    clientId: 'client-2',
    clientName: 'Michael Chen',
    scheduledAt: new Date(new Date().setHours(14, 30, 0, 0)),
    durationMinutes: 45,
    status: 'scheduled',
    notes: 'Progress check-in',
  },
  {
    id: 'booking-today-3',
    mentorId: 'mentor-1',
    clientId: 'client-5',
    clientName: 'Lisa Park',
    scheduledAt: new Date(new Date().setHours(17, 0, 0, 0)),
    durationMinutes: 60,
    status: 'scheduled',
    notes: 'Upper body strength',
  },
];

export const mockDueSoonPrograms = [
  {
    id: 'due-1',
    clientName: 'Sarah Johnson',
    programName: '12-Week Shred',
    daysRemaining: 5,
    completionPercent: 92,
  },
  {
    id: 'due-2',
    clientName: 'David Thompson',
    programName: 'Marathon Prep',
    daysRemaining: 12,
    completionPercent: 75,
  },
];

export const mockUnreadMessages = 4;
