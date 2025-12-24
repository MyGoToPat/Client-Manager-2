import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Header } from '../components/header';
import { MetricCard } from '../components/metric-card';
import { ClientTable } from '../components/client-table';
import { ClientDrawer } from '../components/client-drawer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useStore } from '../store/useStore';
import { clientsService, organizationsService } from '../services';
import { useAskPat } from '../App';
import type { Client, Organization } from '../types';

interface TeamMentor {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  clientCount: number;
  lastActive: string;
  specializations: string[];
  sessionCount?: number;
  avgCompliance?: number;
  revenue?: number;
}

export default function OrganizationDashboard() {
  const params = useParams<{ id: string }>();
  const orgId = params.id || 'org-1';
  const { setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [org, setOrg] = useState<Organization | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [mentors, setMentors] = useState<TeamMentor[]>([]);
  const [mentorFilter, setMentorFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  
  const getInitialTab = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('tab') || 'overview';
  };
  const [activeTab, setActiveTab] = useState(getInitialTab);

  useEffect(() => {
    loadData();
  }, [orgId]);

  const loadData = async () => {
    try {
      const [orgData, clientsData, mentorsData] = await Promise.all([
        organizationsService.getOrganization(orgId),
        clientsService.getClients('mentor-1'),
        organizationsService.getTeamMentors(orgId),
      ]);
      setOrg(orgData);
      setClients(clientsData.filter(c => c.orgId === orgId));
      setMentors(mentorsData);
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
    totalMentors: mentors.length,
    totalClients: clients.length,
    sessionsPerMonth: 47,
    revenue: 12500,
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">Owner</Badge>;
      case 'manager':
        return <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20">Manager</Badge>;
      default:
        return <Badge variant="secondary">Mentor</Badge>;
    }
  };

  if (!org && !isLoading) {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title={org?.name || 'Organization'} 
        onAskPat={openAskPat}
      />
      
      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted">
              <span className="material-symbols-outlined text-2xl">business</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold">{org?.name || 'Organization'}</h1>
              <Badge variant="secondary" className="capitalize">{org?.type}</Badge>
            </div>
          </div>
          <Button variant="outline" data-testid="button-org-settings">
            <span className="material-symbols-outlined text-base mr-2">settings</span>
            Settings
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="team" data-testid="tab-team">Team</TabsTrigger>
            <TabsTrigger value="clients" data-testid="tab-clients">All Clients</TabsTrigger>
            <TabsTrigger value="reports" data-testid="tab-reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                  <Skeleton className="h-28" />
                </>
              ) : (
                <>
                  <MetricCard
                    label="Mentors"
                    value={metrics.totalMentors}
                    icon={<span className="material-symbols-outlined text-xl">group</span>}
                  />
                  <MetricCard
                    label="Total Clients"
                    value={metrics.totalClients}
                    trend={15}
                    trendLabel="this month"
                    icon={<span className="material-symbols-outlined text-xl">how_to_reg</span>}
                  />
                  <MetricCard
                    label="Sessions/Month"
                    value={metrics.sessionsPerMonth}
                    icon={<span className="material-symbols-outlined text-xl">calendar_month</span>}
                  />
                  <MetricCard
                    label="Revenue"
                    value={`$${metrics.revenue.toLocaleString()}`}
                    trend={8}
                    icon={<span className="material-symbols-outlined text-xl">attach_money</span>}
                  />
                </>
              )}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Mentor Performance</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <Skeleton className="h-48" />
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Mentor</TableHead>
                        <TableHead>Clients</TableHead>
                        <TableHead>Sessions</TableHead>
                        <TableHead>Compliance</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mentors.map((mentor) => (
                        <TableRow key={mentor.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback className="text-xs">
                                  {mentor.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium">{mentor.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>{mentor.clientCount}</TableCell>
                          <TableCell>{mentor.sessionCount || 15}</TableCell>
                          <TableCell>{mentor.avgCompliance || 78}%</TableCell>
                          <TableCell>${(mentor.revenue || 4200).toLocaleString()}</TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm">View</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6 mt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Team Members</h2>
                <p className="text-sm text-muted-foreground">Manage your organization's mentors</p>
              </div>
              <Button data-testid="button-invite-mentor">
                <span className="material-symbols-outlined text-base mr-2">person_add</span>
                Invite Mentor
              </Button>
            </div>

            <div className="grid gap-4">
              {isLoading ? (
                <>
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                  <Skeleton className="h-24" />
                </>
              ) : (
                mentors.map((mentor) => (
                  <Card key={mentor.id} className="hover-elevate">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <Avatar className="w-12 h-12">
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {mentor.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{mentor.name}</span>
                              {getRoleBadge(mentor.role)}
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">group</span>
                                {mentor.clientCount} clients
                              </span>
                              <span>Last active: {mentor.lastActive}</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                              {mentor.specializations.map((spec) => (
                                <Badge key={spec} variant="outline" className="text-xs">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" data-testid={`button-mentor-menu-${mentor.id}`}>
                              <span className="material-symbols-outlined text-base">more_vert</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <span className="material-symbols-outlined text-base">person</span>
                              View Profile
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <span className="material-symbols-outlined text-base">group</span>
                              View Clients
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <span className="material-symbols-outlined text-base">shield</span>
                              Change Role
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-6 mt-6">
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <h2 className="text-lg font-semibold">All Clients</h2>
              <div className="flex items-center gap-4">
                <Select value={mentorFilter} onValueChange={setMentorFilter}>
                  <SelectTrigger className="w-[180px]" data-testid="select-mentor-filter">
                    <SelectValue placeholder="Filter by mentor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Mentors</SelectItem>
                    {mentors.map((mentor) => (
                      <SelectItem key={mentor.id} value={mentor.id}>{mentor.name}</SelectItem>
                    ))}
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
                <span className="material-symbols-outlined text-5xl mx-auto mb-4 opacity-50 block">group</span>
                <p className="text-lg font-medium">No organization clients</p>
                <p className="text-sm">Invite clients to your organization</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="reports" className="space-y-6 mt-6">
            <div className="text-center py-12 text-muted-foreground">
              <span className="material-symbols-outlined text-5xl mx-auto mb-4 opacity-50 block">monitoring</span>
              <p className="text-lg font-medium">Reports Coming Soon</p>
              <p className="text-sm">Organization-level analytics and reports will be available here.</p>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <ClientDrawer />
    </div>
  );
}
