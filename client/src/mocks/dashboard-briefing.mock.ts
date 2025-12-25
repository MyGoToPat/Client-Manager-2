import { DashboardBriefing } from '@/types';
import { mockClients } from './clients.mock';

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getMentorName = (): string => 'Coach Alex';

export const mockDashboardBriefing: DashboardBriefing = {
  greeting: `${getTimeGreeting()}, ${getMentorName()}.`,
  subGreeting: "You have 47 clients. 38 are doing great, but I need your eyes on 3.",
  clientSummary: {
    total: 47,
    healthy: 38,
    needsAttention: 3,
  },
  todaysSessions: [
    {
      id: 'session-1',
      time: '10:00 AM',
      client: mockClients[0],
      sessionType: 'Upper Body Strength',
      location: 'in_person',
      clientStatus: 'thriving',
      statusColor: 'green',
      recentHighlights: [
        '7-day workout streak',
        'Hit bench PR yesterday (135 lbs, +10 lbs)',
        'Nutrition compliance: 92%'
      ],
      patSuggestions: [
        'She\'s ready to push. Consider progressive overload on compound lifts.',
        'Perfect day to test overhead press progression.'
      ],
      todaysWorkout: {
        name: 'Upper Body A',
        exercises: [
          { name: 'Bench Press', sets: 4, reps: 6, weight: '115 lbs' },
          { name: 'Overhead Press', sets: 3, reps: 8, weight: '65 lbs' },
          { name: 'Barbell Row', sets: 4, reps: 8, weight: '95 lbs' },
          { name: 'Lateral Raises', sets: 3, reps: 12, weight: '15 lbs' },
          { name: 'Tricep Pushdowns', sets: 3, reps: 12 },
        ]
      }
    },
    {
      id: 'session-2',
      time: '2:30 PM',
      client: mockClients[1],
      sessionType: 'Progress Check-in',
      location: 'zoom',
      clientStatus: 'struggling',
      statusColor: 'yellow',
      recentHighlights: [],
      concerns: [
        'Missed 2 of 4 planned workouts this week',
        'Protein averaging 120g (target: 160g)',
        'Told Pat on Tuesday: "Work has been crazy"'
      ],
      patSuggestions: [
        'Consider reducing workout frequency from 4x to 3x per week temporarily.',
        'Discuss quick protein wins: Greek yogurt, ready-to-drink shakes.',
        'Help him set a realistic schedule for the next 2 weeks.'
      ],
    },
    {
      id: 'session-3',
      time: '5:00 PM',
      client: mockClients[3] || mockClients[0],
      sessionType: 'Lower Body',
      location: 'in_person',
      clientStatus: 'thriving',
      statusColor: 'green',
      recentHighlights: [
        '30-day workout streak!',
        'Most consistent client this month',
        'Readiness score: High (good sleep, low stress)'
      ],
      patSuggestions: [
        'Perfect day to test her squat 1RM if she\'s interested.',
        'Last tested 3 months ago: 185 lbs'
      ],
      todaysWorkout: {
        name: 'Lower Body A',
        exercises: [
          { name: 'Barbell Squat', sets: 4, reps: 5, weight: '155 lbs' },
          { name: 'Romanian Deadlift', sets: 3, reps: 8, weight: '135 lbs' },
          { name: 'Walking Lunges', sets: 3, reps: 12 },
          { name: 'Leg Curl', sets: 3, reps: 12 },
        ]
      }
    }
  ],
  needsAttention: [
    {
      id: 'attention-1',
      client: mockClients[2],
      urgency: 'urgent',
      urgencyColor: 'red',
      headline: 'No activity in 7 days',
      observation: 'Emily hasn\'t logged a workout in 7 days. This is unusual - she typically misses 1-2 days maximum.',
      clientSaid: 'I\'m feeling overwhelmed with work, might need to take a break',
      pattern: 'Her last period of inactivity (5 days) was followed by her dropping off entirely for a month before returning.',
      patSuggestion: 'A quick voice note or text might help. Something supportive, not pressuring. She responds well to understanding.',
      suggestedActions: [
        { label: 'Send Voice Note', action: 'message', primary: true },
        { label: 'Send Text', action: 'message' },
        { label: 'View Profile', action: 'view' },
        { label: 'Adjust Plan', action: 'adjust_workout' },
      ],
      daysInactive: 7,
      compliancePercent: 23,
    },
    {
      id: 'attention-2',
      client: mockClients[4] || mockClients[1],
      urgency: 'attention',
      urgencyColor: 'yellow',
      headline: 'Protein intake 40% below target',
      observation: 'James has been under his protein target for 5 consecutive days. I noticed he\'s been eating out frequently - 4 restaurant meals yesterday alone.',
      clientSaid: undefined,
      pattern: 'When I suggested meal prep, he said he doesn\'t have time to cook. His compliance drops every time he travels for work.',
      patSuggestion: 'His current protein target (180g) might be too aggressive for his lifestyle. Consider lowering to 150g - more achievable and he\'ll feel less like he\'s failing.',
      suggestedActions: [
        { label: 'Adjust Macros', action: 'adjust_macros', primary: true },
        { label: 'Message James', action: 'message' },
        { label: 'View Nutrition Log', action: 'view' },
      ],
      compliancePercent: 58,
    },
    {
      id: 'attention-3',
      client: mockClients[5] || mockClients[0],
      urgency: 'monitor',
      urgencyColor: 'blue',
      headline: 'Declining readiness scores',
      observation: 'Marcus\'s readiness scores have dropped from 8 to 5 over the past week. Sleep quality is declining.',
      pattern: 'He hasn\'t mentioned anything specific, but the pattern suggests stress or life changes affecting his recovery.',
      patSuggestion: 'Worth checking in casually. Could be work stress, relationship issues, or just a tough week. Don\'t make it about fitness.',
      suggestedActions: [
        { label: 'Casual Check-in', action: 'message', primary: true },
        { label: 'View Readiness History', action: 'view' },
      ],
    }
  ],
  celebrations: [
    {
      id: 'celebration-1',
      client: mockClients[0],
      type: 'pr',
      icon: 'emoji_events',
      headline: 'New PR! Bench Press: 135 lbs',
      details: 'Up 10 lbs from her previous best. She\'s been working toward this for 6 weeks.',
      patAlreadyDid: 'I sent her a celebration message and updated her PR log.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    },
    {
      id: 'celebration-2',
      client: mockClients[3] || mockClients[1],
      type: 'streak',
      icon: 'local_fire_department',
      headline: '30-day workout streak!',
      details: 'Lisa hasn\'t missed a single planned workout in a month. She\'s your most consistent client.',
      patAlreadyDid: 'I acknowledged her streak and gave her a virtual high-five.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    },
    {
      id: 'celebration-3',
      client: mockClients[4] || mockClients[2],
      type: 'goal_progress',
      icon: 'trending_down',
      headline: 'Lost 8 lbs this month!',
      details: 'David is on track for his 20 lb weight loss goal. At this pace, he\'ll hit it in 5 weeks.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8),
    }
  ],
  activitySummary: {
    workouts: {
      completed: 12,
      remaining: 6,
      skipped: 3,
    },
    nutrition: {
      logged: 28,
      expected: 47,
      onTarget: 24,
    },
    recentActivity: [
      {
        clientId: 'client-1',
        clientName: 'Sarah Johnson',
        action: 'completed "Upper Body Strength"',
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
      },
      {
        clientId: 'client-2',
        clientName: 'Michael Chen',
        action: 'logged breakfast (520 cal)',
        timestamp: new Date(Date.now() - 1000 * 60 * 120),
      },
      {
        clientId: 'client-3',
        clientName: 'Lisa Park',
        action: 'hit 30-day workout streak!',
        timestamp: new Date(Date.now() - 1000 * 60 * 180),
      },
      {
        clientId: 'client-4',
        clientName: 'David Thompson',
        action: 'asked Pat about protein timing',
        timestamp: new Date(Date.now() - 1000 * 60 * 240),
      },
    ]
  },
  generatedAt: new Date(),
};

export const getDashboardBriefing = (): Promise<DashboardBriefing> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const updatedBriefing = {
        ...mockDashboardBriefing,
        greeting: `${getTimeGreeting()}, ${getMentorName()}.`,
        generatedAt: new Date(),
      };
      resolve(updatedBriefing);
    }, 500);
  });
};
