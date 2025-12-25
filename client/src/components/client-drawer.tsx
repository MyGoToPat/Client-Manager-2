import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '../store/useStore';
import { clientsService, directivesService } from '../services';
import type { Client, AIInsight, ProgressData, ClientPermission, MentorDirective, WorkoutPlan } from '../types';
import { ClientOverviewTab } from './client-drawer/overview-tab';
import { ClientProgressTab } from './client-drawer/progress-tab';
import { ClientInsightsTab } from './client-drawer/insights-tab';
import { ClientDirectivesTab } from './client-drawer/directives-tab';
import { ClientWorkoutPlansTab } from './client-drawer/workout-plans-tab';
import { ClientPermissionsTab } from './client-drawer/permissions-tab';
import { cn } from '@/lib/utils';

const statusColors: Record<Client['status'], string> = {
  active: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
  pending: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  trial: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
};

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function getAvatarColor(name: string): string {
  const colors = [
    'bg-chart-1 text-white',
    'bg-chart-2 text-white',
    'bg-chart-3 text-black',
    'bg-chart-4 text-white',
    'bg-chart-5 text-white',
  ];
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return colors[hash % colors.length];
}

export function ClientDrawer() {
  const { selectedClientId, clientDrawerOpen, setClientDrawerOpen, setSelectedClientId, updateClient } = useStore();
  const [client, setClient] = useState<Client | null>(null);
  const [progress, setProgress] = useState<ProgressData[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [permissions, setPermissions] = useState<ClientPermission[]>([]);
  const [directives, setDirectives] = useState<MentorDirective[]>([]);
  const [workoutPlans, setWorkoutPlans] = useState<WorkoutPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'active' as Client['status'],
    engagementType: 'in_person' as 'in_person' | 'online_1on1' | 'program_only',
    primaryVenue: '',
    preferredPlatform: 'zoom' as 'zoom' | 'google_meet' | 'phone',
  });

  useEffect(() => {
    if (selectedClientId && clientDrawerOpen) {
      loadClientData();
    }
  }, [selectedClientId, clientDrawerOpen]);

  const loadClientData = async () => {
    if (!selectedClientId) return;
    setIsLoading(true);
    try {
      const [clientData, progressData, insightsData, permissionsData, directivesData, workoutPlansData] = await Promise.all([
        clientsService.getClient(selectedClientId),
        clientsService.getClientProgress(selectedClientId, 28),
        clientsService.getClientInsights(selectedClientId),
        clientsService.getClientPermissions(selectedClientId, 'mentor-1'),
        directivesService.getDirectivesByClient(selectedClientId),
        clientsService.getWorkoutPlans(selectedClientId),
      ]);
      setClient(clientData);
      setProgress(progressData);
      setInsights(insightsData);
      setPermissions(permissionsData);
      setDirectives(directivesData);
      setWorkoutPlans(workoutPlansData);
    } catch (error) {
      console.error('Failed to load client data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setClientDrawerOpen(false);
    setSelectedClientId(null);
    setActiveTab('overview');
  };

  const handleDirectiveToggle = async (directiveId: string) => {
    try {
      const updated = await directivesService.toggleDirectiveActive(directiveId);
      setDirectives(directives.map(d => d.id === directiveId ? updated : d));
    } catch (error) {
      console.error('Failed to toggle directive:', error);
    }
  };

  useEffect(() => {
    if (client) {
      setEditForm({
        name: client.name,
        email: client.email,
        phone: client.phone || '',
        status: client.status,
        engagementType: client.engagementType || 'in_person',
        primaryVenue: client.primaryVenue || '',
        preferredPlatform: client.preferredPlatform || 'zoom',
      });
    }
  }, [client]);

  const handleSaveEdit = () => {
    if (client) {
      const updates = {
        name: editForm.name,
        email: editForm.email,
        phone: editForm.phone,
        status: editForm.status,
        engagementType: editForm.engagementType,
        primaryVenue: editForm.primaryVenue,
        preferredPlatform: editForm.preferredPlatform,
      };
      setClient({ ...client, ...updates });
      updateClient(client.id, updates);
    }
    setIsEditModalOpen(false);
  };

  if (!clientDrawerOpen) return null;

  return (
    <Sheet open={clientDrawerOpen} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0">
        {isLoading ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : client ? (
          <>
            <SheetHeader className="p-6 pb-4 border-b border-border">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className={cn('text-lg font-medium', getAvatarColor(client.name))}>
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-1">
                    <SheetTitle className="text-xl font-semibold text-left">
                      {client.name}
                    </SheetTitle>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={cn('capitalize', statusColors[client.status])}
                      >
                        {client.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground capitalize">{client.role}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-base">mail</span>
                        {client.email}
                      </span>
                      {client.phone && (
                        <span className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-base">phone</span>
                          {client.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={() => setIsEditModalOpen(true)}
                    data-testid="button-edit-client"
                  >
                    <span className="material-symbols-outlined text-base">edit</span>
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleClose} data-testid="button-close-drawer">
                    <span className="material-symbols-outlined text-base">close</span>
                  </Button>
                </div>
              </div>
            </SheetHeader>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="px-6 pt-4 border-b border-border">
                <TabsList className="w-full justify-start h-auto p-0 bg-transparent gap-4">
                  <TabsTrigger 
                    value="overview" 
                    className="pb-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-overview"
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger 
                    value="progress" 
                    className="pb-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-progress"
                  >
                    Progress
                  </TabsTrigger>
                  <TabsTrigger 
                    value="insights" 
                    className="pb-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-insights"
                  >
                    AI Summary
                  </TabsTrigger>
                  <TabsTrigger 
                    value="directives" 
                    className="pb-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-directives"
                  >
                    Directives
                  </TabsTrigger>
                  <TabsTrigger 
                    value="workouts" 
                    className="pb-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-workouts"
                  >
                    Workouts
                  </TabsTrigger>
                  <TabsTrigger 
                    value="permissions" 
                    className="pb-3 px-0 data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none"
                    data-testid="tab-permissions"
                  >
                    Permissions
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="overview" className="mt-0">
                  <ClientOverviewTab client={client} />
                </TabsContent>
                <TabsContent value="progress" className="mt-0">
                  <ClientProgressTab progress={progress} />
                </TabsContent>
                <TabsContent value="insights" className="mt-0">
                  <ClientInsightsTab insights={insights} />
                </TabsContent>
                <TabsContent value="directives" className="mt-0">
                  <ClientDirectivesTab 
                    directives={directives} 
                    onToggle={handleDirectiveToggle}
                  />
                </TabsContent>
                <TabsContent value="workouts" className="mt-0">
                  <ClientWorkoutPlansTab workoutPlans={workoutPlans} />
                </TabsContent>
                <TabsContent value="permissions" className="mt-0">
                  <ClientPermissionsTab permissions={permissions} />
                </TabsContent>
              </div>
            </Tabs>
          </>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            Client not found
          </div>
        )}
      </SheetContent>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Client</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                data-testid="input-edit-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input
                id="edit-email"
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                data-testid="input-edit-email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input
                id="edit-phone"
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                data-testid="input-edit-phone"
              />
            </div>

            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={editForm.status}
                onValueChange={(value: Client['status']) => setEditForm({ ...editForm, status: value })}
              >
                <SelectTrigger data-testid="select-edit-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="trial">Trial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Engagement Type</Label>
              <Select
                value={editForm.engagementType}
                onValueChange={(value: 'in_person' | 'online_1on1' | 'program_only') => 
                  setEditForm({ ...editForm, engagementType: value })}
              >
                <SelectTrigger data-testid="select-edit-engagement">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in_person">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">fitness_center</span>
                      In-Person Training
                    </span>
                  </SelectItem>
                  <SelectItem value="online_1on1">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">videocam</span>
                      Online 1:1 Coaching
                    </span>
                  </SelectItem>
                  <SelectItem value="program_only">
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-sm">school</span>
                      Program Only
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editForm.engagementType === 'in_person' && (
              <div className="space-y-2">
                <Label htmlFor="edit-venue">Primary Venue</Label>
                <Input
                  id="edit-venue"
                  value={editForm.primaryVenue}
                  onChange={(e) => setEditForm({ ...editForm, primaryVenue: e.target.value })}
                  placeholder="e.g., FitLife Downtown"
                  data-testid="input-edit-venue"
                />
              </div>
            )}

            {editForm.engagementType === 'online_1on1' && (
              <div className="space-y-2">
                <Label>Preferred Platform</Label>
                <Select
                  value={editForm.preferredPlatform}
                  onValueChange={(value: 'zoom' | 'google_meet' | 'phone') => 
                    setEditForm({ ...editForm, preferredPlatform: value })}
                >
                  <SelectTrigger data-testid="select-edit-platform">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zoom">Zoom</SelectItem>
                    <SelectItem value="google_meet">Google Meet</SelectItem>
                    <SelectItem value="phone">Phone Call</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)} data-testid="button-cancel-edit">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} data-testid="button-save-edit">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Sheet>
  );
}
