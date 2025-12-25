import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '@/components/header';
import { ClientDrawer } from '@/components/client-drawer';
import { useStore } from '@/store/useStore';
import { useAskPat } from '@/App';
import { 
  SmartGreetingComponent,
  InPersonSessions,
  OnlineSessionsWeek,
  ProgramHealth,
  TodaysSessions,
  NeedsAttention,
  Celebrations,
  ActivitySummary 
} from '@/components/dashboard';
import { DashboardBriefingV2 } from '@/types';
import { getDashboardBriefingV2 } from '@/mocks/dashboard-briefing-v2.mock';

export default function Dashboard() {
  const { setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [, setLocation] = useLocation();
  const [briefing, setBriefing] = useState<DashboardBriefingV2 | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);

  useEffect(() => {
    const loadBriefing = async () => {
      setIsLoading(true);
      const data = await getDashboardBriefingV2();
      setBriefing(data);
      setIsLoading(false);
    };
    loadBriefing();
  }, []);

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleMessageClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleAdjustPlan = (clientId: string, _type: 'macros' | 'workout') => {
    setSelectedClientId(clientId);
  };

  const handleExpandSession = (sessionId: string) => {
    setExpandedSessionId(expandedSessionId === sessionId ? null : sessionId);
  };

  const handleViewProgram = (programId: string) => {
    setLocation(`/groups/${programId}`);
  };

  const handleViewFlagged = (programId: string) => {
    setLocation(`/groups/${programId}?filter=flagged`);
  };

  const handleCelebrate = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  if (!briefing) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header title="Dashboard" onAskPat={openAskPat} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
              <div className="h-48 bg-slate-200 dark:bg-slate-800 rounded-lg"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const hasInPersonToday = briefing.inPersonToday.length > 0;
  const hasOnlineThisWeek = briefing.onlineThisWeek.length > 0;
  const hasPrograms = briefing.programHealth.length > 0;
  const hasNeedsAttention = briefing.needsAttention.length > 0;
  const hasCelebrations = briefing.celebrations.length > 0;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" onAskPat={openAskPat} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <SmartGreetingComponent 
            greeting={briefing.smartGreeting}
            isLoading={isLoading}
          />

          {hasInPersonToday && (
            <InPersonSessions 
              sessions={briefing.inPersonToday}
              onViewClient={handleViewClient}
              onExpandSession={handleExpandSession}
            />
          )}

          {expandedSessionId && (
            <TodaysSessions 
              sessions={briefing.todaysSessions.filter(s => s.id === expandedSessionId)}
              onViewClient={handleViewClient}
              onAdjustPlan={handleAdjustPlan}
              onMessageClient={handleMessageClient}
            />
          )}

          {hasOnlineThisWeek && (
            <OnlineSessionsWeek 
              sessions={briefing.onlineThisWeek}
              onViewClient={handleViewClient}
              onExpandSession={handleExpandSession}
            />
          )}

          {hasNeedsAttention && (
            <NeedsAttention 
              items={briefing.needsAttention}
              onViewClient={handleViewClient}
              onMessageClient={handleMessageClient}
              onAdjustPlan={handleAdjustPlan}
            />
          )}

          {hasPrograms && (
            <ProgramHealth 
              programs={briefing.programHealth}
              onViewProgram={handleViewProgram}
              onViewFlagged={handleViewFlagged}
            />
          )}

          {hasCelebrations && (
            <Celebrations 
              items={briefing.celebrations}
              onViewClient={handleViewClient}
              onCelebrate={handleCelebrate}
            />
          )}

          <ActivitySummary 
            summary={briefing.activitySummary}
          />

        </div>
      </main>

      <ClientDrawer />
    </div>
  );
}
