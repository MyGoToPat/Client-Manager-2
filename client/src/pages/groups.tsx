import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { 
  Plus, 
  Search, 
  Users, 
  Calendar, 
  TrendingUp, 
  MoreVertical,
  MessageSquare,
  Zap,
  Archive,
  Trash2,
  Edit,
  Dumbbell,
  Sunrise,
  Scale,
  Gift,
  Building,
  FolderOpen
} from 'lucide-react';
import { ExportDropdown } from '@/components/export-dropdown';
import { exportGroups, type ExportFormat } from '@/lib/export-utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { Header } from '@/components/header';
import { groupsService } from '../services/groups.service';
import type { ClientGroup, GroupType } from '../types';
import { format } from 'date-fns';
import { CreateGroupModal } from '@/components/groups/create-group-modal';

const groupTypeConfig: Record<GroupType, { label: string; color: string }> = {
  program_cohort: { label: 'Program Cohort', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  custom: { label: 'Custom', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  promotion: { label: 'Promotion', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
  organization: { label: 'Organization', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
};

const iconMap: Record<string, typeof Dumbbell> = {
  dumbbell: Dumbbell,
  sunrise: Sunrise,
  scale: Scale,
  gift: Gift,
  building: Building,
  users: Users,
};

function getIcon(iconName?: string) {
  if (!iconName) return FolderOpen;
  return iconMap[iconName] || FolderOpen;
}

function GroupCard({ group, onEdit, onArchive, onDelete }: { 
  group: ClientGroup; 
  onEdit: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  const IconComponent = getIcon(group.icon);
  const typeConfig = groupTypeConfig[group.type];

  return (
    <Card className="hover-elevate" data-testid={`card-group-${group.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md flex items-center justify-center bg-muted">
              <IconComponent className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{group.name}</h3>
              <Badge variant="outline" className={`text-xs mt-1 ${typeConfig.color}`}>
                {typeConfig.label}
              </Badge>
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" data-testid={`button-group-menu-${group.id}`}>
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onEdit} data-testid={`menu-edit-${group.id}`}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onArchive} data-testid={`menu-archive-${group.id}`}>
                <Archive className="w-4 h-4 mr-2" />
                Archive
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onDelete} 
                className="text-destructive"
                data-testid={`menu-delete-${group.id}`}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {group.program && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Started: {format(new Date(group.program.startDate), 'MMM d, yyyy')}</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              <span>Week {group.program.currentWeek} of {group.program.durationWeeks}</span>
            </div>
          </div>
        )}

        {group.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {group.description}
          </p>
        )}

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{group.memberCount} members</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{group.avgCompliance}% compliance</span>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <Link href={`/groups/${group.id}`}>
            <Button variant="outline" size="sm" data-testid={`button-view-group-${group.id}`}>
              View Group
            </Button>
          </Link>
          <Link href={`/groups/${group.id}?tab=board`}>
            <Button variant="ghost" size="sm" data-testid={`button-message-board-${group.id}`}>
              <MessageSquare className="w-4 h-4 mr-1" />
              Message Board
            </Button>
          </Link>
          <Link href={`/groups/${group.id}?tab=directives`}>
            <Button variant="ghost" size="sm" data-testid={`button-directives-${group.id}`}>
              <Zap className="w-4 h-4 mr-1" />
              Directives
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Groups() {
  const [groups, setGroups] = useState<ClientGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('active');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ClientGroup | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async () => {
    setLoading(true);
    try {
      const data = await groupsService.getAll();
      setGroups(data);
    } catch (error) {
      console.error('Failed to load groups:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleArchive = async (groupId: string) => {
    await groupsService.archive(groupId);
    await loadGroups();
  };

  const handleDelete = async (groupId: string) => {
    if (confirm('Are you sure you want to delete this group?')) {
      await groupsService.delete(groupId);
      await loadGroups();
    }
  };

  const filteredGroups = groups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || group.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && group.isActive) ||
      (statusFilter === 'inactive' && !group.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const groupsByType = {
    program_cohort: filteredGroups.filter(g => g.type === 'program_cohort'),
    custom: filteredGroups.filter(g => g.type === 'custom'),
    promotion: filteredGroups.filter(g => g.type === 'promotion'),
    organization: filteredGroups.filter(g => g.type === 'organization'),
  };

  return (
    <>
      <Header title="Groups" />
      <main className="flex-1 overflow-y-auto p-6">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <div className="flex items-center gap-3 flex-wrap flex-1">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search groups..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
                data-testid="input-search-groups"
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-type-filter">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="program_cohort">Program Cohorts</SelectItem>
                <SelectItem value="custom">Custom Groups</SelectItem>
                <SelectItem value="promotion">Promotions</SelectItem>
                <SelectItem value="organization">Organizations</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <ExportDropdown 
              onExport={(format: ExportFormat) => exportGroups(filteredGroups, format)}
              disabled={filteredGroups.length === 0}
            />
            <Button onClick={() => setCreateModalOpen(true)} data-testid="button-create-group">
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-pulse text-muted-foreground">Loading groups...</div>
          </div>
        ) : filteredGroups.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No groups found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || typeFilter !== 'all' 
                ? 'Try adjusting your filters'
                : 'Create your first group to start organizing clients'}
            </p>
            <Button onClick={() => setCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {groupsByType.program_cohort.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Program Cohorts
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupsByType.program_cohort.map(group => (
                    <GroupCard 
                      key={group.id} 
                      group={group}
                      onEdit={() => setEditingGroup(group)}
                      onArchive={() => handleArchive(group.id)}
                      onDelete={() => handleDelete(group.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {groupsByType.custom.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Custom Groups
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupsByType.custom.map(group => (
                    <GroupCard 
                      key={group.id} 
                      group={group}
                      onEdit={() => setEditingGroup(group)}
                      onArchive={() => handleArchive(group.id)}
                      onDelete={() => handleDelete(group.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {groupsByType.promotion.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Promotional Groups
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupsByType.promotion.map(group => (
                    <GroupCard 
                      key={group.id} 
                      group={group}
                      onEdit={() => setEditingGroup(group)}
                      onArchive={() => handleArchive(group.id)}
                      onDelete={() => handleDelete(group.id)}
                    />
                  ))}
                </div>
              </section>
            )}

            {groupsByType.organization.length > 0 && (
              <section>
                <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  Organization Groups
                </h2>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {groupsByType.organization.map(group => (
                    <GroupCard 
                      key={group.id} 
                      group={group}
                      onEdit={() => setEditingGroup(group)}
                      onArchive={() => handleArchive(group.id)}
                      onDelete={() => handleDelete(group.id)}
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </main>

      <CreateGroupModal
        open={createModalOpen || !!editingGroup}
        onOpenChange={(open) => {
          if (!open) {
            setCreateModalOpen(false);
            setEditingGroup(null);
          }
        }}
        group={editingGroup}
        onSuccess={() => {
          setCreateModalOpen(false);
          setEditingGroup(null);
          loadGroups();
        }}
      />
    </>
  );
}
