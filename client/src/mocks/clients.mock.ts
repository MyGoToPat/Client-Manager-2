import type { Client, AIInsight, ProgressData, ClientPermission, WorkoutPlan, ClientSession, PatFlag } from '../types';

const daysFromNow = (days: number): Date => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};

const todayAt = (hours: number, minutes: number = 0): Date => {
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
};

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
    engagementTypeId: 'et-in-person',
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
    },
    patStatus: 'thriving',
    patStatusColor: 'green',
    compliancePercent: 92,
    daysSinceActivity: 0,
    patFlags: [
      {
        id: 'flag-1',
        type: 'positive',
        category: 'milestone',
        headline: 'New PR! Bench Press 135 lbs',
        details: 'Up 10 lbs from previous best - consistent progressive overload paying off',
        patSuggestion: 'Celebrate this win! Consider increasing weight by 5 lbs next session.',
        createdAt: new Date(),
        acknowledged: false
      }
    ],
    sessionPrepNotes: ['Ready to push - consider progressive overload on compound lifts', 'Energy levels high this week'],
    nextSession: {
      id: 'session-1',
      clientId: 'client-1',
      date: todayAt(10, 0),
      time: '10:00 AM',
      type: 'Upper Body Strength',
      location: 'in_person',
      venue: 'FitLife Downtown',
      status: 'scheduled'
    },
    macroGoals: { protein: 140, carbs: 180, fat: 65 }
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
    engagementType: 'in_person',
    engagementTypeId: 'et-in-person',
    primaryVenue: 'FitLife Downtown',
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
    },
    patStatus: 'steady',
    patStatusColor: 'yellow',
    compliancePercent: 75,
    daysSinceActivity: 1,
    patFlags: [
      {
        id: 'flag-2',
        type: 'attention',
        category: 'workout',
        headline: 'Knee discomfort mentioned',
        details: 'Client mentioned right knee feels tight after squats in last session notes',
        clientSaid: 'My right knee has been a bit sore after heavy leg days',
        patSuggestion: 'Consider lighter weight or substitute leg press. Ask about warm-up routine.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        acknowledged: false
      }
    ],
    sessionPrepNotes: ['Check in about knee - may need form adjustment', 'Consider mobility work before heavy lifts'],
    nextSession: {
      id: 'session-2',
      clientId: 'client-2',
      date: todayAt(14, 0),
      time: '2:00 PM',
      type: 'Lower Body Focus',
      location: 'in_person',
      venue: 'FitLife Downtown',
      status: 'scheduled'
    },
    macroGoals: { protein: 180, carbs: 300, fat: 80 }
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
    engagementType: 'in_person',
    engagementTypeId: 'et-in-person',
    primaryVenue: 'FitLife Downtown',
    programIds: ['prog-1'],
    sessionFrequency: 'weekly',
    preferredSessionDay: 3,
    patStatus: 'struggling',
    patStatusColor: 'red',
    compliancePercent: 15,
    daysSinceActivity: 7,
    patFlags: [
      {
        id: 'flag-3',
        type: 'urgent',
        category: 'engagement',
        headline: '7 days inactive - risk of churn',
        details: 'No workouts logged, no app activity. Last message was about feeling overwhelmed with work.',
        clientSaid: 'Work has been crazy, I just cant find the time right now',
        patSuggestion: 'Send a supportive check-in. Offer a 15-min express workout option or reschedule.',
        createdAt: new Date(),
        acknowledged: false
      },
      {
        id: 'flag-3b',
        type: 'attention',
        category: 'nutrition',
        headline: 'Nutrition logging stopped',
        details: 'No meals logged in 10 days after previously logging 80% of meals',
        patSuggestion: 'When reaching out, dont mention nutrition - focus on reconnecting first.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        acknowledged: false
      }
    ],
    sessionPrepNotes: [],
    nextSession: undefined,
    macroGoals: { protein: 120, carbs: 150, fat: 50 }
  },
  {
    id: 'client-4',
    name: 'David Thompson',
    email: 'david.thompson@email.com',
    status: 'active',
    role: 'client',
    progress: 90,
    lastLogin: 'Just now',
    lastActive: 'Just now',
    joinedAt: new Date('2024-12-15'),
    goals: ['Train for marathon', 'Optimize nutrition'],
    orgId: undefined,
    groups: ['Marathon Prep 2025'],
    engagementType: 'in_person',
    engagementTypeId: 'et-in-person',
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
    },
    patStatus: 'thriving',
    patStatusColor: 'green',
    compliancePercent: 95,
    daysSinceActivity: 0,
    patFlags: [
      {
        id: 'flag-4',
        type: 'positive',
        category: 'milestone',
        headline: 'Weight goal achieved! Down 12 lbs',
        details: 'Reached target weight of 165 lbs from starting 177 lbs over 6 weeks',
        patSuggestion: 'Major celebration! Discuss transitioning to maintenance phase.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        acknowledged: false
      },
      {
        id: 'flag-4b',
        type: 'positive',
        category: 'workout',
        headline: 'Marathon training ahead of schedule',
        details: 'Completed 18-mile long run, 2 weeks ahead of training plan',
        patSuggestion: 'Great progress! Remind about recovery importance with increased mileage.',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        acknowledged: true
      }
    ],
    sessionPrepNotes: ['Celebrate weight milestone!', 'Discuss race-day nutrition strategy', 'Review taper plan for upcoming race'],
    nextSession: {
      id: 'session-4',
      clientId: 'client-4',
      date: todayAt(16, 30),
      time: '4:30 PM',
      type: 'Endurance Training',
      location: 'in_person',
      venue: 'FitLife Downtown',
      status: 'scheduled'
    },
    macroGoals: { protein: 160, carbs: 400, fat: 70 }
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
    engagementTypeId: 'et-online',
    preferredPlatform: 'zoom',
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
    },
    patStatus: 'thriving',
    patStatusColor: 'green',
    compliancePercent: 98,
    daysSinceActivity: 0,
    patFlags: [
      {
        id: 'flag-5',
        type: 'positive',
        category: 'milestone',
        headline: '30-day workout streak!',
        details: 'Completed 30 consecutive days of workouts - longest streak ever',
        patSuggestion: 'Huge milestone! I already sent her a celebration message. Consider a small reward or recognition.',
        createdAt: new Date(),
        acknowledged: false
      },
      {
        id: 'flag-5b',
        type: 'positive',
        category: 'nutrition',
        headline: 'Perfect macro adherence this week',
        details: 'Hit protein goal every day and stayed within calorie range',
        patSuggestion: 'Mention this consistency - it shows great discipline.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        acknowledged: true
      }
    ],
    sessionPrepNotes: ['Celebrate 30-day streak!', 'Discuss next phase of training', 'She mentioned interest in strength focus'],
    nextSession: {
      id: 'session-5',
      clientId: 'client-5',
      date: daysFromNow(1),
      time: '7:00 AM',
      type: 'Full Body Strength',
      location: 'zoom',
      status: 'scheduled'
    },
    macroGoals: { protein: 120, carbs: 180, fat: 55 }
  },
  {
    id: 'client-6',
    name: 'James Wilson',
    email: 'james.wilson@email.com',
    status: 'active',
    role: 'client',
    progress: 45,
    lastLogin: '1d ago',
    lastActive: '1d ago',
    joinedAt: new Date('2024-01-20'),
    goals: ['Build consistency', 'Improve strength'],
    orgId: 'org-1',
    groups: [],
    engagementType: 'online_1on1',
    engagementTypeId: 'et-online',
    preferredPlatform: 'google_meet',
    sessionFrequency: 'weekly',
    preferredSessionDay: 5,
    patStatus: 'steady',
    patStatusColor: 'yellow',
    compliancePercent: 65,
    daysSinceActivity: 1,
    patFlags: [
      {
        id: 'flag-6',
        type: 'monitor',
        category: 'compliance',
        headline: 'Workout consistency dropping',
        details: 'Completed 3 of 5 scheduled workouts last week, down from 5 of 5 the previous week',
        patSuggestion: 'Check in about schedule - may need to adjust workout days.',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        acknowledged: false
      }
    ],
    sessionPrepNotes: ['Discuss schedule adjustments', 'Review workout plan complexity'],
    nextSession: {
      id: 'session-6',
      clientId: 'client-6',
      date: daysFromNow(2),
      time: '6:00 PM',
      type: 'Upper Body',
      location: 'google_meet',
      status: 'scheduled'
    },
    macroGoals: { protein: 150, carbs: 200, fat: 60 }
  },
  {
    id: 'client-7',
    name: 'Amanda Foster',
    email: 'amanda.foster@email.com',
    status: 'active',
    role: 'client',
    progress: 60,
    lastLogin: '6h ago',
    lastActive: '6h ago',
    joinedAt: new Date('2024-06-01'),
    goals: ['Post-pregnancy fitness', 'Core strength'],
    orgId: undefined,
    groups: ['12-Week Shred - Cohort 1'],
    engagementType: 'program_only',
    engagementTypeId: 'et-program',
    programIds: ['prog-2'],
    sessionFrequency: 'program_only',
    patStatus: 'steady',
    patStatusColor: 'yellow',
    compliancePercent: 70,
    daysSinceActivity: 0,
    patFlags: [
      {
        id: 'flag-7',
        type: 'monitor',
        category: 'workout',
        headline: 'Skipping core exercises',
        details: 'Has been marking core exercises as skipped in 3 of last 5 workouts',
        patSuggestion: 'May need modified core exercises for postpartum. Consider checking in about diastasis recti.',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        acknowledged: false
      }
    ],
    sessionPrepNotes: [],
    nextSession: undefined,
    macroGoals: { protein: 110, carbs: 160, fat: 50 }
  },
  {
    id: 'client-8',
    name: 'Robert Kim',
    email: 'robert.kim@email.com',
    status: 'active',
    role: 'client',
    progress: 80,
    lastLogin: '12h ago',
    lastActive: '12h ago',
    joinedAt: new Date('2024-04-15'),
    goals: ['Build muscle', 'Improve nutrition habits'],
    orgId: 'org-1',
    groups: ['Morning Warriors'],
    engagementType: 'program_only',
    engagementTypeId: 'et-program',
    programIds: ['prog-1', 'prog-3'],
    sessionFrequency: 'program_only',
    patStatus: 'thriving',
    patStatusColor: 'green',
    compliancePercent: 88,
    daysSinceActivity: 0,
    patFlags: [
      {
        id: 'flag-8',
        type: 'positive',
        category: 'workout',
        headline: 'Completed all week 6 workouts',
        details: 'Perfect completion of program week 6 with all exercises logged',
        patSuggestion: 'Great momentum! Week 7 introduces new exercises - he seems ready.',
        createdAt: new Date(),
        acknowledged: false
      }
    ],
    sessionPrepNotes: [],
    nextSession: undefined,
    macroGoals: { protein: 170, carbs: 250, fat: 70 }
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

export const inPersonClients = mockClients.filter(c => c.engagementType === 'in_person');
export const online1on1Clients = mockClients.filter(c => c.engagementType === 'online_1on1');
export const programOnlyClients = mockClients.filter(c => c.engagementType === 'program_only');
