import type { Client, AIInsight, ProgressData, ClientPermission, WorkoutPlan } from '../types';

export const mockClients: Client[] = [
  {
    id: 'client-1',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@email.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    role: 'premium',
    progress: 85,
    lastLogin: '2h ago',
    lastActive: '2h ago',
    joinedAt: new Date('2024-01-14'),
    goals: ['Lose 10 lbs', 'Build muscle', 'Improve sleep'],
    orgId: undefined,
    groups: ['12-Week Shred - Cohort 1'],
    engagementType: 'in_person',
    primaryVenue: 'FitLife Downtown',
    sessionFrequency: 'weekly',
    preferredSessionDay: 1,
    metrics: {
      tdee: 2100,
      bmr: 1650,
      proteinGoal: 140,
      carbsGoal: 200,
      fatGoal: 65,
      hydrationGoal: 3000,
      bodyFatPercent: 24,
      weight: 145
    }
  },
  {
    id: 'client-2',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    status: 'active',
    role: 'client',
    progress: 72,
    lastLogin: 'Yesterday',
    lastActive: 'Yesterday',
    joinedAt: new Date('2024-02-20'),
    goals: ['Gain muscle mass', 'Increase strength'],
    orgId: 'org-1',
    groups: ['Morning Warriors', '12-Week Shred - Cohort 1'],
    engagementType: 'online_1on1',
    sessionFrequency: 'weekly',
    preferredSessionDay: 2,
    metrics: {
      tdee: 2800,
      bmr: 1950,
      proteinGoal: 180,
      carbsGoal: 300,
      fatGoal: 80,
      hydrationGoal: 4000,
      weight: 175
    }
  },
  {
    id: 'client-3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@email.com',
    status: 'inactive',
    role: 'client',
    progress: 23,
    lastLogin: '7d ago',
    lastActive: '7d ago',
    joinedAt: new Date('2024-03-01'),
    goals: ['Get back on track', 'Establish routine'],
    orgId: 'org-1',
    groups: [],
    engagementType: 'program_only',
    programIds: ['prog-1'],
    sessionFrequency: 'program_only',
  },
  {
    id: 'client-4',
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    status: 'trial',
    role: 'client',
    progress: 90,
    lastLogin: 'Just now',
    lastActive: 'Just now',
    joinedAt: new Date('2024-12-15'),
    goals: ['Train for marathon', 'Optimize nutrition'],
    orgId: undefined,
    groups: ['Marathon Prep 2025'],
    engagementType: 'in_person',
    primaryVenue: 'FitLife Downtown',
    sessionFrequency: 'biweekly',
    preferredSessionDay: 4,
    metrics: {
      tdee: 3200,
      bmr: 2100,
      proteinGoal: 160,
      carbsGoal: 400,
      fatGoal: 70,
      hydrationGoal: 4500,
      weight: 165
    }
  },
  {
    id: 'client-5',
    name: 'Lisa Park',
    email: 'lisa.park@email.com',
    status: 'active',
    role: 'enterprise',
    progress: 95,
    lastLogin: '4h ago',
    lastActive: '4h ago',
    joinedAt: new Date('2023-11-01'),
    goals: ['Maintain fitness', 'Work-life balance'],
    orgId: 'org-1',
    groups: ['Morning Warriors', 'Corporate Wellness'],
    engagementType: 'online_1on1',
    sessionFrequency: 'weekly',
    preferredSessionDay: 3,
    metrics: {
      tdee: 1900,
      bmr: 1450,
      proteinGoal: 120,
      carbsGoal: 180,
      fatGoal: 55,
      hydrationGoal: 2500,
      bodyFatPercent: 20,
      weight: 130
    }
  },
  {
    id: 'client-6',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    status: 'suspended',
    role: 'client',
    progress: 15,
    lastLogin: '5d ago',
    lastActive: '5d ago',
    joinedAt: new Date('2024-01-20'),
    orgId: 'org-1',
    groups: [],
    engagementType: 'online_1on1',
    sessionFrequency: 'monthly',
  }
];

export const mockProgressData: ProgressData[] = [
  { date: 'Week 1', workouts: 80, nutrition: 75, sleep: 70 },
  { date: 'Week 2', workouts: 85, nutrition: 80, sleep: 75 },
  { date: 'Week 3', workouts: 75, nutrition: 85, sleep: 80 },
  { date: 'Week 4', workouts: 90, nutrition: 88, sleep: 85 },
];

export const mockInsights: AIInsight[] = [
  {
    id: 'insight-1',
    type: 'pattern',
    title: 'Consistency Breakthrough',
    description: 'Client has maintained a 12-day workout streak, their longest this year. This represents a 40% improvement in consistency compared to last month.',
    confidence: 95,
    category: 'Fitness',
    priority: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actionable: true,
    suggestedAction: 'Celebrate the milestone and set next target at 21 days'
  },
  {
    id: 'insight-2',
    type: 'alert',
    title: 'Protein Intake Declining',
    description: 'Protein intake has dropped 15% over the past week, averaging 145g vs target of 180g. This could impact recovery and muscle protein synthesis.',
    confidence: 88,
    category: 'Nutrition',
    priority: 'medium',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    actionable: true,
    suggestedAction: 'Add post-workout protein shake recommendation'
  },
  {
    id: 'insight-3',
    type: 'pattern',
    title: 'Sleep-Performance Correlation',
    description: 'Strong correlation detected: workouts following 7.5+ hours of sleep show 23% higher volume and 18% better RPE scores.',
    confidence: 92,
    category: 'Sleep',
    priority: 'medium',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
  },
  {
    id: 'insight-4',
    type: 'suggestion',
    title: 'Optimize Tuesday Workouts',
    description: 'Tuesday workouts consistently underperform (avg RPE 8.2 vs 7.1 other days). Consider adjusting Monday recovery or Tuesday workout intensity.',
    confidence: 85,
    category: 'Fitness',
    priority: 'low',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
  },
  {
    id: 'insight-5',
    type: 'achievement',
    title: 'Goal Achievement Forecast',
    description: 'Based on current trajectory, client is 87% likely to achieve their 6-month strength goals. Maintaining current consistency is key.',
    confidence: 79,
    category: 'Overall',
    priority: 'high',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
  }
];

export const mockPermissions: ClientPermission[] = [
  { id: 'perm-1', clientId: 'client-1', mentorId: 'mentor-1', dataCategory: 'workout', accessLevel: 'full' },
  { id: 'perm-2', clientId: 'client-1', mentorId: 'mentor-1', dataCategory: 'nutrition', accessLevel: 'view' },
  { id: 'perm-3', clientId: 'client-1', mentorId: 'mentor-1', dataCategory: 'sleep', accessLevel: 'view' },
  { id: 'perm-4', clientId: 'client-1', mentorId: 'mentor-1', dataCategory: 'chat', accessLevel: 'view_edit' },
  { id: 'perm-5', clientId: 'client-1', mentorId: 'mentor-1', dataCategory: 'progress_photos', accessLevel: 'view' },
  { id: 'perm-6', clientId: 'client-1', mentorId: 'mentor-1', dataCategory: 'body_metrics', accessLevel: 'none' },
];

export const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: 'plan-1',
    name: 'Strength Foundation',
    difficulty: 'intermediate',
    durationWeeks: 8,
    completionPercent: 62,
    assignedDays: ['Monday', 'Wednesday', 'Friday'],
    status: 'active'
  },
  {
    id: 'plan-2',
    name: 'HIIT Cardio Blast',
    difficulty: 'advanced',
    durationWeeks: 4,
    completionPercent: 100,
    assignedDays: ['Tuesday', 'Thursday'],
    status: 'completed'
  },
  {
    id: 'plan-3',
    name: 'Core & Mobility',
    difficulty: 'beginner',
    durationWeeks: 6,
    completionPercent: 35,
    assignedDays: ['Saturday'],
    status: 'active'
  }
];
