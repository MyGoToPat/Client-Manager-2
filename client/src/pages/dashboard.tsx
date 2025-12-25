import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { ClientDrawer } from '@/components/client-drawer';
import { useStore } from '@/store/useStore';
import { useAskPat } from '@/App';
import { 
  PatGreeting,
  TodaysSessions,
  NeedsAttention,
  Celebrations,
  ActivitySummary 
} from '@/components/dashboard';
import { 
  mockDashboardBriefing,
  getDashboardBriefing 
} from '@/mocks/dashboard-briefing.mock';

export default function Dashboard() {
  const { setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [briefing, setBriefing] = useState(mockDashboardBriefing);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadBriefing = async () => {
      setIsLoading(true);
      const data = await getDashboardBriefing();
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

  const handleCelebrate = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" onAskPat={openAskPat} />

      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-8">
          
          <PatGreeting 
            briefing={briefing}
            isLoading={isLoading}
          />

          {briefing.todaysSessions.length > 0 && (
            <TodaysSessions 
              sessions={briefing.todaysSessions}
              onViewClient={handleViewClient}
              onAdjustPlan={handleAdjustPlan}
              onMessageClient={handleMessageClient}
            />
          )}

          {briefing.needsAttention.length > 0 && (
            <NeedsAttention 
              items={briefing.needsAttention}
              onViewClient={handleViewClient}
              onMessageClient={handleMessageClient}
              onAdjustPlan={handleAdjustPlan}
            />
          )}

          {briefing.celebrations.length > 0 && (
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
