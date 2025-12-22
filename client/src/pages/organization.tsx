import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Users, UserCheck, Activity, Bot } from 'lucide-react';
import { Header } from '../components/header';
import { MetricCard } from '../components/metric-card';
import { ClientTable } from '../components/client-table';
import { ClientDrawer } from '../components/client-drawer';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useStore } from '../store/useStore';
import { clientsService, organizationsService } from '../services';
import { useAskPat } from '../App';
import type { Client, Organization } from '../types';

export default function OrganizationDashboard() {
  const params = useParams<{ id: string }>();
  const orgId = params.id || 'org-1';
  const { setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [org, setOrg] = useState<Organization | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [mentorFilter, setMentorFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [orgId]);

  const loadData = async () => {
    try {
      const [orgData, clientsData] = await Promise.all([
        organizationsService.getOrganization(orgId),
        clientsService.getClients('mentor-1'),
      ]);
      setOrg(orgData);
      setClients(clientsData.filter(c => c.orgId === orgId));
    } catch (error) {
      console.error('Failed to load organization data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const metrics = {
    totalMentors: 3,
    totalClients: clients.length,
    activeSessions: 12,
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={org?.name || 'Organization'} 
        onAskPat={openAskPat}
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{org?.type}</Badge>
          <span className="text-sm text-muted-foreground">Organization Dashboard</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                label="Total Mentors"
                value={metrics.totalMentors}
                icon={<Users className="w-5 h-5" />}
              />
              <MetricCard
                label="Total Clients"
                value={metrics.totalClients}
                trend={15}
                trendLabel="this month"
                icon={<UserCheck className="w-5 h-5" />}
              />
              <MetricCard
                label="Active Sessions"
                value={metrics.activeSessions}
                icon={<Activity className="w-5 h-5" />}
              />
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold">Organization Clients</h2>
            <div className="flex items-center gap-4">
              <Select value={mentorFilter} onValueChange={setMentorFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-mentor-filter">
                  <SelectValue placeholder="Filter by mentor" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Mentors</SelectItem>
                  <SelectItem value="mentor-1">Coach Alex</SelectItem>
                  <SelectItem value="mentor-2">Dr. Sarah</SelectItem>
                  <SelectItem value="mentor-3">Dr. Mike</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : clients.length > 0 ? (
            <ClientTable 
              clients={clients} 
              onClientClick={handleClientClick}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No organization clients</p>
              <p className="text-sm">Invite clients to your organization</p>
            </div>
          )}
        </div>
      </main>

      <ClientDrawer />
    </div>
  );
}
