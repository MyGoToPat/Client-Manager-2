import { useState, useEffect } from 'react';
import { ExportDropdown } from '@/components/export-dropdown';
import { exportClients, type ExportFormat } from '@/lib/export-utils';
import { Header } from '../components/header';
import { ClientDrawer } from '../components/client-drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { useStore } from '../store/useStore';
import { clientsService } from '../services';
import { useAskPat } from '../App';
import {
  PriorityCard,
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
  mockDueSoonPrograms,
  mockUnreadMessages,
} from '../mocks/dashboard.mock';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
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

  const mentorName = 'Coach';

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard" 
        showInvite 
        onAskPat={openAskPat}
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold" data-testid="text-greeting">
              {getGreeting()}, {mentorName}!
            </h1>
            <p className="text-muted-foreground">
              Here's what needs your attention today.
            </p>
          </div>
          <ExportDropdown 
            onExport={(format: ExportFormat) => exportClients(clients, format)}
            disabled={clients.length === 0}
            label="Export Clients"
          />
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
              <Skeleton className="h-28" />
            </div>
            <Skeleton className="h-48" />
            <Skeleton className="h-48" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <PriorityCard
                title="Needs Attention"
                count={mockNeedsAttention.length}
                subtitle="Compliance dropped"
                icon="warning"
                variant="warning"
              />
              <PriorityCard
                title="Unread Messages"
                count={mockUnreadMessages}
                subtitle="Respond to clients"
                icon="chat"
                variant="info"
              />
              <PriorityCard
                title="Today's Sessions"
                count={mockTodaysSessions.length}
                subtitle="Scheduled today"
                icon="calendar_month"
              />
              <PriorityCard
                title="Due Soon"
                count={mockDueSoonPrograms.length}
                subtitle="Programs ending"
                icon="schedule"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <NeedsAttentionSection
                  clients={mockNeedsAttention}
                  onMessageClient={handleMessageClient}
                  onViewClient={handleViewClient}
                />
                <TodaysSessionsSection
                  sessions={mockTodaysSessions}
                />
              </div>
              
              <div className="space-y-6">
                <ActivityFeedSection
                  activities={mockRecentActivity}
                  onViewClient={handleViewClient}
                />
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
