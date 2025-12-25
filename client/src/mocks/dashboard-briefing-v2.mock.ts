import { 
  DashboardBriefingV2, 
  SmartGreeting, 
  WeeklySession, 
  ProgramHealthSummary,
  ClientSegmentation,
  Client
} from '@/types';
import { mockClients, inPersonClients, online1on1Clients, programOnlyClients } from './clients.mock';
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
        count: inPersonClients.length,
        todayCount: inPersonToday.length 
      },
      online: { 
        label: 'Online 1:1', 
        count: online1on1Clients.length,
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

const mapPatStatusToSessionStatus = (status?: string): 'thriving' | 'steady' | 'struggling' => {
  if (status === 'thriving') return 'thriving';
  if (status === 'struggling' || status === 'inactive') return 'struggling';
  return 'steady';
};

const mapPatStatusColorToSessionColor = (color?: string): 'green' | 'yellow' | 'red' => {
  if (color === 'green') return 'green';
  if (color === 'red' || color === 'gray') return 'red';
  return 'yellow';
};

const clientToWeeklySession = (client: Client): WeeklySession | null => {
  if (!client.nextSession) return null;
  
  const session = client.nextSession;
  const hasAttentionFlags = client.patFlags?.some(f => 
    f.type === 'urgent' || f.type === 'attention'
  ) ?? false;
  
  return {
    id: session.id,
    date: session.date,
    dayLabel: getDayLabel(session.date),
    time: session.time,
    client,
    sessionType: session.type,
    location: session.location === 'phone' ? 'zoom' : session.location,
    venue: session.venue,
    clientStatus: mapPatStatusToSessionStatus(client.patStatus),
    statusColor: mapPatStatusColorToSessionColor(client.patStatusColor),
    needsPrep: hasAttentionFlags || (client.sessionPrepNotes?.length ?? 0) > 0,
    prepNote: client.sessionPrepNotes?.[0],
  };
};

const getNeedsAttentionCount = (): number => {
  return mockClients.filter(c => 
    c.patStatus === 'struggling' || 
    c.patFlags?.some(f => f.type === 'urgent' || f.type === 'attention')
  ).length;
};

export const mockInPersonToday: WeeklySession[] = inPersonClients
  .map(clientToWeeklySession)
  .filter((s): s is WeeklySession => s !== null && s.dayLabel === 'Today');

export const mockOnlineThisWeek: WeeklySession[] = online1on1Clients
  .map(clientToWeeklySession)
  .filter((s): s is WeeklySession => s !== null);

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
  const needsAttentionCount = getNeedsAttentionCount();
  const totalProgramMembers = mockProgramHealth.reduce((sum, p) => sum + p.memberCount, 0);
  
  const smartGreeting = generateSmartGreeting(
    mockInPersonToday,
    mockOnlineThisWeek,
    mockProgramHealth,
    mockClients.length + totalProgramMembers,
    needsAttentionCount
  );
  
  return {
    ...mockDashboardBriefing,
    smartGreeting,
    inPersonToday: mockInPersonToday,
    onlineThisWeek: mockOnlineThisWeek,
    programHealth: mockProgramHealth,
    clientSegmentation: {
      inPerson: {
        count: inPersonClients.length,
        todayCount: mockInPersonToday.length,
        clients: inPersonClients,
      },
      online1on1: {
        count: online1on1Clients.length,
        thisWeekCount: mockOnlineThisWeek.length,
        clients: online1on1Clients,
      },
      programOnly: {
        count: programOnlyClients.length + totalProgramMembers,
        activePrograms: mockProgramHealth.length,
        clients: programOnlyClients,
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
