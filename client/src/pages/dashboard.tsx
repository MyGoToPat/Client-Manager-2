import { useState, useEffect, useMemo } from 'react';
import { Users, UserCheck, UserPlus, AlertTriangle } from 'lucide-react';
import { Header } from '../components/header';
import { MetricCard } from '../components/metric-card';
import { ClientTable } from '../components/client-table';
import { ClientDrawer } from '../components/client-drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useStore } from '../store/useStore';
import { clientsService } from '../services';
import type { Client } from '../types';

type StatusFilter = 'all' | Client['status'];

export default function Dashboard() {
  const { clients, setClients, setSelectedClientId } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

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

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        client.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [clients, searchQuery, statusFilter]);

  const metrics = useMemo(() => {
    const total = clients.length;
    const active = clients.filter(c => c.status === 'active').length;
    const trial = clients.filter(c => c.status === 'trial').length;
    const atRisk = clients.filter(c => c.status === 'inactive' || c.status === 'suspended').length;
    return { total, active, trial, atRisk };
  }, [clients]);

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const handleStatusChange = async (clientId: string, status: Client['status']) => {
    try {
      await clientsService.updateClientStatus(clientId, status);
      await loadClients();
    } catch (error) {
      console.error('Failed to update client status:', error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Dashboard" 
        showInvite 
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
              <Skeleton className="h-32" />
            </>
          ) : (
            <>
              <MetricCard
                label="Total Clients"
                value={metrics.total}
                trend={12}
                trendLabel="this month"
                icon={<Users className="w-5 h-5" />}
              />
              <MetricCard
                label="Active"
                value={metrics.active}
                trend={8}
                trendLabel="this month"
                icon={<UserCheck className="w-5 h-5" />}
              />
              <MetricCard
                label="Trial"
                value={metrics.trial}
                trend={25}
                trendLabel="conversion rate"
                icon={<UserPlus className="w-5 h-5" />}
              />
              <MetricCard
                label="At Risk"
                value={metrics.atRisk}
                trend={-15}
                trendLabel="from last week"
                icon={<AlertTriangle className="w-5 h-5" />}
              />
            </>
          )}
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="text-lg font-semibold">Clients</h2>
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <TabsList>
                <TabsTrigger value="all" data-testid="filter-all">All</TabsTrigger>
                <TabsTrigger value="active" data-testid="filter-active">Active</TabsTrigger>
                <TabsTrigger value="trial" data-testid="filter-trial">Trial</TabsTrigger>
                <TabsTrigger value="inactive" data-testid="filter-inactive">Inactive</TabsTrigger>
                <TabsTrigger value="suspended" data-testid="filter-suspended">Suspended</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>
          ) : filteredClients.length > 0 ? (
            <ClientTable 
              clients={filteredClients} 
              onClientClick={handleClientClick}
              onStatusChange={handleStatusChange}
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No clients found</p>
              <p className="text-sm">
                {searchQuery 
                  ? 'Try adjusting your search or filters'
                  : 'Invite your first client to get started'}
              </p>
            </div>
          )}
        </div>
      </main>

      <ClientDrawer />
    </div>
  );
}
