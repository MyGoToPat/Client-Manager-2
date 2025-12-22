import { useState, useEffect, useMemo } from 'react';
import { Plus, Zap, Search, BarChart2, MoreVertical, Pencil, Copy, Trash2, Users, User, FolderOpen } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Header } from '../components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { directivesService, clientsService, groupsService } from '../services';
import { DirectiveModal } from '../components/directive-modal';
import { DeleteDirectiveDialog } from '../components/delete-directive-dialog';
import { useToast } from '@/hooks/use-toast';
import type { MentorDirective, Client, ClientGroup } from '../types';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | MentorDirective['category'];
type StatusFilter = 'all' | 'active' | 'inactive';

const categoryColors: Record<MentorDirective['category'], string> = {
  nutrition: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  workout: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  recovery: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  motivation: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  general: 'bg-muted text-muted-foreground border-muted',
};

const priorityColors: Record<MentorDirective['priority'], string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

export default function Directives() {
  const { toast } = useToast();
  const [directives, setDirectives] = useState<MentorDirective[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [groups, setGroups] = useState<ClientGroup[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [assignmentFilter, setAssignmentFilter] = useState<string>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingDirective, setEditingDirective] = useState<MentorDirective | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDirective, setDeletingDirective] = useState<MentorDirective | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [directivesData, clientsData, groupsData] = await Promise.all([
        directivesService.getDirectives('mentor-1'),
        clientsService.getClients('mentor-1'),
        groupsService.getGroups('mentor-1'),
      ]);
      setDirectives(directivesData);
      setClients(clientsData);
      setGroups(groupsData);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast({ title: 'Error', description: 'Failed to load directives', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (directiveId: string) => {
    try {
      const updated = await directivesService.toggleDirectiveActive(directiveId);
      setDirectives(directives.map(d => d.id === directiveId ? updated : d));
    } catch (error) {
      console.error('Failed to toggle directive:', error);
      toast({ title: 'Error', description: 'Failed to toggle directive', variant: 'destructive' });
    }
  };

  const handleCreate = () => {
    setEditingDirective(null);
    setModalOpen(true);
  };

  const handleEdit = (directive: MentorDirective) => {
    setEditingDirective(directive);
    setModalOpen(true);
  };

  const handleDuplicate = async (directive: MentorDirective) => {
    try {
      const duplicate = await directivesService.duplicateDirective(directive.id);
      setDirectives([...directives, duplicate]);
      toast({ title: 'Success', description: 'Directive duplicated successfully' });
    } catch (error) {
      console.error('Failed to duplicate directive:', error);
      toast({ title: 'Error', description: 'Failed to duplicate directive', variant: 'destructive' });
    }
  };

  const handleDeleteClick = (directive: MentorDirective) => {
    setDeletingDirective(directive);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingDirective) return;
    setIsSaving(true);
    try {
      await directivesService.deleteDirective(deletingDirective.id);
      setDirectives(directives.filter(d => d.id !== deletingDirective.id));
      toast({ title: 'Success', description: 'Directive deleted successfully' });
      setDeleteDialogOpen(false);
      setDeletingDirective(null);
    } catch (error) {
      console.error('Failed to delete directive:', error);
      toast({ title: 'Error', description: 'Failed to delete directive', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSave = async (data: Omit<MentorDirective, 'id' | 'triggeredCount' | 'effectivenessScore' | 'lastTriggered' | 'createdAt' | 'updatedAt'>) => {
    setIsSaving(true);
    try {
      if (editingDirective) {
        const updated = await directivesService.updateDirective(editingDirective.id, data);
        setDirectives(directives.map(d => d.id === editingDirective.id ? updated : d));
        toast({ title: 'Success', description: 'Directive updated successfully' });
      } else {
        const newDirective = await directivesService.createDirective(data);
        setDirectives([...directives, newDirective]);
        toast({ title: 'Success', description: 'Directive created successfully' });
      }
      setModalOpen(false);
      setEditingDirective(null);
    } catch (error) {
      console.error('Failed to save directive:', error);
      toast({ title: 'Error', description: 'Failed to save directive', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const getAssignmentLabel = (directive: MentorDirective) => {
    if (directive.assignmentType === 'all') {
      return { label: 'All Clients', icon: Users, colorClass: 'bg-chart-1/10 text-chart-1 border-chart-1/20' };
    }
    if (directive.assignmentType === 'group') {
      const group = groups.find(g => g.id === directive.groupId);
      return { label: group?.name || 'Unknown Group', icon: FolderOpen, colorClass: 'bg-chart-4/10 text-chart-4 border-chart-4/20' };
    }
    const client = clients.find(c => c.id === directive.clientId);
    return { label: client?.name || 'Unknown Client', icon: User, colorClass: 'bg-muted text-muted-foreground border-muted' };
  };

  const filteredDirectives = useMemo(() => {
    return directives.filter((directive) => {
      const matchesSearch = directive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        directive.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || directive.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? directive.isActive : !directive.isActive);
      const matchesAssignment = assignmentFilter === 'all' || 
        (assignmentFilter === 'all_clients' && directive.assignmentType === 'all') ||
        directive.assignmentType === assignmentFilter;
      return matchesSearch && matchesCategory && matchesStatus && matchesAssignment;
    });
  }, [directives, searchQuery, categoryFilter, statusFilter, assignmentFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Mentor Directives" />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4 flex-1 flex-wrap">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search directives..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-directives"
              />
            </div>

            <Select value={categoryFilter} onValueChange={(v) => setCategoryFilter(v as CategoryFilter)}>
              <SelectTrigger className="w-[140px]" data-testid="select-category-filter">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="nutrition">Nutrition</SelectItem>
                <SelectItem value="workout">Workout</SelectItem>
                <SelectItem value="recovery">Recovery</SelectItem>
                <SelectItem value="motivation">Motivation</SelectItem>
                <SelectItem value="general">General</SelectItem>
              </SelectContent>
            </Select>

            <Select value={assignmentFilter} onValueChange={setAssignmentFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-assignment-filter">
                <SelectValue placeholder="Assignment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Assignments</SelectItem>
                <SelectItem value="all_clients">All Clients</SelectItem>
                <SelectItem value="group">Groups Only</SelectItem>
                <SelectItem value="individual">Individual Only</SelectItem>
              </SelectContent>
            </Select>

            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as StatusFilter)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Button onClick={handleCreate} data-testid="button-new-directive">
            <Plus className="w-4 h-4 mr-2" />
            New Directive
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
          </div>
        ) : filteredDirectives.length > 0 ? (
          <div className="space-y-4">
            {filteredDirectives.map((directive) => {
              const assignment = getAssignmentLabel(directive);
              const AssignmentIcon = assignment.icon;
              
              return (
                <Card key={directive.id} className={cn(!directive.isActive && 'opacity-60')}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-6">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="flex items-center justify-center w-12 h-12 rounded-md bg-primary/10 flex-shrink-0">
                          <Zap className="w-6 h-6 text-primary" />
                        </div>
                        
                        <div className="flex-1 min-w-0 space-y-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <h3 className="text-lg font-medium text-foreground" data-testid={`text-directive-name-${directive.id}`}>
                                {directive.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <Badge variant="outline" className={cn('capitalize', categoryColors[directive.category])}>
                                  {directive.category}
                                </Badge>
                                <Badge variant="outline" className={cn('capitalize', priorityColors[directive.priority])}>
                                  {directive.priority} priority
                                </Badge>
                                <Badge variant="outline" className={cn(assignment.colorClass)}>
                                  <AssignmentIcon className="w-3 h-3 mr-1" />
                                  {assignment.label}
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={directive.isActive}
                                onCheckedChange={() => handleToggle(directive.id)}
                                data-testid={`switch-directive-${directive.id}`}
                              />
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button size="icon" variant="ghost" data-testid={`button-menu-${directive.id}`}>
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(directive)} data-testid={`menu-edit-${directive.id}`}>
                                    <Pencil className="w-4 h-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => handleDuplicate(directive)} data-testid={`menu-duplicate-${directive.id}`}>
                                    <Copy className="w-4 h-4 mr-2" />
                                    Duplicate
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    onClick={() => handleDeleteClick(directive)} 
                                    className="text-destructive"
                                    data-testid={`menu-delete-${directive.id}`}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground italic">
                            "{directive.messageTemplate}"
                          </p>

                          <div className="flex items-center gap-6 pt-2 flex-wrap">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BarChart2 className="w-4 h-4" />
                              Triggered {directive.triggeredCount}x
                            </div>
                            {directive.effectivenessScore && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">Effectiveness:</span>
                                <Progress value={directive.effectivenessScore} className="w-24 h-2" />
                                <span className="text-sm font-mono text-muted-foreground">
                                  {directive.effectivenessScore}%
                                </span>
                              </div>
                            )}
                            {directive.lastTriggered && (
                              <span className="text-sm text-muted-foreground">
                                Last triggered: {formatDistanceToNow(new Date(directive.lastTriggered), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No directives found</p>
            <p className="text-sm">
              {searchQuery || categoryFilter !== 'all' || assignmentFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first directive to automate client messaging'}
            </p>
          </div>
        )}
      </main>

      <DirectiveModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        directive={editingDirective}
        clients={clients}
        groups={groups}
        onSave={handleSave}
        isLoading={isSaving}
      />

      <DeleteDirectiveDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        directiveName={deletingDirective?.name || ''}
        onConfirm={handleConfirmDelete}
        isLoading={isSaving}
      />
    </div>
  );
}
