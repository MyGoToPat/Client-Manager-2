import { 
  DashboardBriefingV2, 
  SmartGreeting, 
  WeeklySession, 
  ProgramHealthSummary,
  ClientSegmentation,
  Client
} from '@/types';
import { mockClients } from './clients.mock';
import { mockDashboardBriefing } from './dashboard-briefing.mock';

const getTimeGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const getMentorName = (): string => 'Coach Alex';

const getDayLabel = (date: Date): string => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
  
  return date.toLocaleDateString('en-US', { weekday: 'long' });
};

const getNextSessionContext = (sessions: WeeklySession[]): string | undefined => {
  if (sessions.length === 0) return undefined;
  
  const now = new Date();
  const todaySessions = sessions.filter(s => getDayLabel(s.date) === 'Today');
  
  if (todaySessions.length > 0) {
    const nextSession = todaySessions[0];
    const sessionTime = new Date(nextSession.date);
    const hoursUntil = Math.round((sessionTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (hoursUntil <= 0) {
      return `Your session with ${nextSession.client.name} starts soon.`;
    } else if (hoursUntil === 1) {
      return `Your first session is in 1 hour with ${nextSession.client.name}.`;
    } else if (hoursUntil <= 3) {
      return `Your first session is in ${hoursUntil} hours with ${nextSession.client.name}.`;
    }
  }
  
  return undefined;
};

export const generateSmartGreeting = (
  inPersonToday: WeeklySession[],
  onlineThisWeek: WeeklySession[],
  programHealth: ProgramHealthSummary[],
  totalClients: number,
  needsAttentionCount: number
): SmartGreeting => {
  const greeting = `${getTimeGreeting()}, ${getMentorName()}.`;
  
  let contextLine = '';
  const totalProgramMembers = programHealth.reduce((sum, p) => sum + p.memberCount, 0);
  const oneOnOneCount = totalClients - totalProgramMembers;
  
  if (inPersonToday.length > 0) {
    contextLine = `You have ${inPersonToday.length} in-person session${inPersonToday.length > 1 ? 's' : ''} today`;
    if (needsAttentionCount > 0) {
      contextLine += ` and ${needsAttentionCount} client${needsAttentionCount > 1 ? 's' : ''} need${needsAttentionCount === 1 ? 's' : ''} attention.`;
    } else {
      contextLine += '.';
    }
  } else if (onlineThisWeek.length > 0) {
    contextLine = `No in-person sessions today. You have ${onlineThisWeek.length} online check-in${onlineThisWeek.length > 1 ? 's' : ''} this week.`;
  } else {
    contextLine = `You have ${oneOnOneCount} 1:1 clients and ${totalProgramMembers} in programs.`;
    if (needsAttentionCount > 0) {
      contextLine += ` ${needsAttentionCount} need${needsAttentionCount === 1 ? 's' : ''} your attention.`;
    }
  }
  
  return {
    greeting,
    contextLine,
    urgentContext: getNextSessionContext([...inPersonToday, ...onlineThisWeek]),
    segments: {
      inPerson: { 
        label: 'In-Person', 
        count: 20,
        todayCount: inPersonToday.length 
      },
      online: { 
        label: 'Online 1:1', 
        count: 50,
        thisWeekCount: onlineThisWeek.length 
      },
      programs: { 
        label: 'Programs', 
        groupCount: programHealth.length,
        memberCount: totalProgramMembers
      },
    }
  };
};

export const mockInPersonToday: WeeklySession[] = [
  {
    id: 'ip-1',
    date: new Date(new Date().setHours(10, 0, 0, 0)),
    dayLabel: 'Today',
    time: '10:00 AM',
    client: {
      ...mockClients[0],
      engagementType: 'in_person',
      primaryVenue: 'FitLife Downtown'
    },
    sessionType: 'Upper Body Strength',
    location: 'in_person',
    venue: 'FitLife Downtown',
    clientStatus: 'thriving',
    statusColor: 'green',
    needsPrep: false,
  },
  {
    id: 'ip-2',
    date: new Date(new Date().setHours(11, 30, 0, 0)),
    dayLabel: 'Today',
    time: '11:30 AM',
    client: {
      ...mockClients[1],
      engagementType: 'in_person',
      primaryVenue: 'FitLife Downtown'
    },
    sessionType: 'Legs & Core',
    location: 'in_person',
    venue: 'FitLife Downtown',
    clientStatus: 'steady',
    statusColor: 'yellow',
    needsPrep: true,
    prepNote: 'Check knee - mentioned discomfort last session',
  },
  {
    id: 'ip-3',
    date: new Date(new Date().setHours(14, 0, 0, 0)),
    dayLabel: 'Today',
    time: '2:00 PM',
    client: {
      ...mockClients[2],
      engagementType: 'in_person',
      primaryVenue: 'FitLife Downtown'
    },
    sessionType: 'Full Body',
    location: 'in_person',
    venue: 'FitLife Downtown',
    clientStatus: 'thriving',
    statusColor: 'green',
    needsPrep: false,
  },
  {
    id: 'ip-4',
    date: new Date(new Date().setHours(16, 0, 0, 0)),
    dayLabel: 'Today',
    time: '4:00 PM',
    client: {
      ...mockClients[3] || mockClients[0],
      engagementType: 'in_person',
      primaryVenue: 'FitLife Downtown'
    },
    sessionType: 'Push Day',
    location: 'in_person',
    venue: 'FitLife Downtown',
    clientStatus: 'thriving',
    statusColor: 'green',
    needsPrep: false,
  },
];

export const mockOnlineThisWeek: WeeklySession[] = [
  {
    id: 'ol-1',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    dayLabel: 'Tomorrow',
    time: '9:00 AM',
    client: {
      ...mockClients[1],
      engagementType: 'online_1on1',
    },
    sessionType: 'Progress Check-in',
    location: 'zoom',
    clientStatus: 'struggling',
    statusColor: 'red',
    needsPrep: true,
    prepNote: 'Review nutrition logs - protein consistently low',
  },
  {
    id: 'ol-2',
    date: new Date(new Date().setDate(new Date().getDate() + 1)),
    dayLabel: 'Tomorrow',
    time: '2:00 PM',
    client: {
      ...mockClients[3] || mockClients[0],
      engagementType: 'online_1on1',
    },
    sessionType: 'Weekly Review',
    location: 'zoom',
    clientStatus: 'thriving',
    statusColor: 'green',
    needsPrep: false,
  },
  {
    id: 'ol-3',
    date: new Date(new Date().setDate(new Date().getDate() + 2)),
    dayLabel: getDayLabel(new Date(new Date().setDate(new Date().getDate() + 2))),
    time: '10:00 AM',
    client: {
      ...mockClients[4] || mockClients[1],
      engagementType: 'online_1on1',
    },
    sessionType: 'Nutrition Review',
    location: 'google_meet',
    clientStatus: 'steady',
    statusColor: 'yellow',
    needsPrep: true,
    prepNote: 'Prep macro adjustment proposal',
  },
  {
    id: 'ol-4',
    date: new Date(new Date().setDate(new Date().getDate() + 3)),
    dayLabel: getDayLabel(new Date(new Date().setDate(new Date().getDate() + 3))),
    time: '11:00 AM',
    client: {
      ...mockClients[5] || mockClients[2],
      engagementType: 'online_1on1',
    },
    sessionType: 'Monthly Review',
    location: 'zoom',
    clientStatus: 'thriving',
    statusColor: 'green',
    needsPrep: false,
  },
  {
    id: 'ol-5',
    date: new Date(new Date().setDate(new Date().getDate() + 4)),
    dayLabel: getDayLabel(new Date(new Date().setDate(new Date().getDate() + 4))),
    time: '3:00 PM',
    client: {
      ...mockClients[0],
      engagementType: 'online_1on1',
    },
    sessionType: 'Goal Setting',
    location: 'zoom',
    clientStatus: 'steady',
    statusColor: 'yellow',
    needsPrep: false,
  },
];

const createProgramClient = (id: string, name: string, email: string): Client => ({
  id,
  name,
  email,
  status: 'active',
  role: 'client',
  progress: 50,
  lastLogin: 'Recently',
  lastActive: 'Recently',
  joinedAt: new Date(),
  goals: ['Complete program'],
  engagementType: 'program_only',
});

export const mockProgramHealth: ProgramHealthSummary[] = [
  {
    id: 'group-cohort-1',
    name: '12-Week Shred',
    type: 'cohort',
    currentWeek: 6,
    totalWeeks: 12,
    memberCount: 85,
    onTrackPercent: 92,
    flaggedCount: 3,
    flaggedMembers: [
      {
        client: createProgramClient('prog-client-1', 'Emily Rodriguez', 'emily@example.com'),
        reason: 'No activity in 7 days',
        urgency: 'urgent'
      },
      {
        client: createProgramClient('prog-client-2', 'Tom Stevens', 'tom@example.com'),
        reason: 'Nutrition compliance dropped to 45%',
        urgency: 'attention'
      },
      {
        client: createProgramClient('prog-client-3', 'Ana Martinez', 'ana@example.com'),
        reason: 'Asked Pat about quitting',
        urgency: 'urgent'
      },
    ],
    recentWins: [
      { type: 'milestone', count: 15, description: '15 members completed Week 6' },
      { type: 'streak', count: 8, description: '8 members on 7+ day streaks' },
    ],
    status: 'needs_attention',
  },
  {
    id: 'group-cohort-2',
    name: 'Beginner Strength',
    type: 'course',
    currentWeek: 3,
    totalWeeks: 8,
    memberCount: 95,
    onTrackPercent: 88,
    flaggedCount: 0,
    flaggedMembers: [],
    recentWins: [
      { type: 'completion', count: 92, description: '92 members completed Week 2' },
    ],
    status: 'healthy',
  },
  {
    id: 'group-promo-1',
    name: 'Summer Cut Challenge',
    type: 'challenge',
    currentWeek: 8,
    totalWeeks: 10,
    memberCount: 50,
    onTrackPercent: 78,
    flaggedCount: 7,
    flaggedMembers: [
      {
        client: createProgramClient('prog-client-4', 'Group (7 members)', ''),
        reason: 'Compliance dropping as challenge nears end',
        urgency: 'attention'
      },
    ],
    recentWins: [
      { type: 'milestone', count: 12, description: '12 members hit 10+ lb loss goal' },
    ],
    status: 'needs_attention',
  },
];

export const generateDashboardBriefingV2 = (): DashboardBriefingV2 => {
  const needsAttentionCount = 3;
  
  const smartGreeting = generateSmartGreeting(
    mockInPersonToday,
    mockOnlineThisWeek,
    mockProgramHealth,
    300,
    needsAttentionCount
  );
  
  const totalProgramMembers = mockProgramHealth.reduce((sum, p) => sum + p.memberCount, 0);
  
  return {
    ...mockDashboardBriefing,
    smartGreeting,
    inPersonToday: mockInPersonToday,
    onlineThisWeek: mockOnlineThisWeek,
    programHealth: mockProgramHealth,
    clientSegmentation: {
      inPerson: {
        count: 20,
        todayCount: mockInPersonToday.length,
        clients: mockInPersonToday.map(s => s.client),
      },
      online1on1: {
        count: 50,
        thisWeekCount: mockOnlineThisWeek.length,
        clients: mockOnlineThisWeek.map(s => s.client),
      },
      programOnly: {
        count: 230,
        activePrograms: mockProgramHealth.length,
        clients: [],
      },
    },
  };
};

export const getDashboardBriefingV2 = (): Promise<DashboardBriefingV2> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateDashboardBriefingV2());
    }, 500);
  });
};
