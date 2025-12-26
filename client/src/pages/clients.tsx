import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { clientsService } from "@/services";
import { Header } from "@/components/header";
import { useAskPat } from "@/App";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Client } from "@/types";
import { ClientDrawer } from "@/components/client-drawer";
import { AddClientModal } from "@/components/add-client-modal";

type SortField = 'name' | 'status' | 'lastActive';
type SortDirection = 'asc' | 'desc';

type AITagType = 'at_risk' | 'high_anxiety' | 'achieving_goal' | 'consistent' | 'needs_checkin' | 'improving' | 'goal_met';

interface AITag {
  type: AITagType;
  label: string;
}

const mockAITags: Record<string, AITag[]> = {
  'client-1': [
    { type: 'achieving_goal', label: 'Achieving Goal' },
    { type: 'consistent', label: 'Consistent' },
  ],
  'client-2': [
    { type: 'improving', label: 'Improving' },
  ],
  'client-3': [
    { type: 'at_risk', label: 'At Risk' },
    { type: 'needs_checkin', label: 'Needs Check-in' },
  ],
  'client-4': [
    { type: 'goal_met', label: 'Goal Met' },
    { type: 'consistent', label: 'Consistent' },
  ],
  'client-5': [
    { type: 'achieving_goal', label: 'Achieving Goal' },
  ],
  'client-6': [
    { type: 'high_anxiety', label: 'High Anxiety' },
    { type: 'at_risk', label: 'At Risk' },
  ],
};

const getAITagStyles = (type: AITagType) => {
  switch (type) {
    case 'at_risk':
      return {
        bg: 'bg-red-100 dark:bg-red-500/20',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-200 dark:border-red-500/30',
        hasPulse: true,
      };
    case 'high_anxiety':
      return {
        bg: 'bg-orange-100 dark:bg-orange-500/20',
        text: 'text-orange-700 dark:text-orange-400',
        border: 'border-orange-200 dark:border-orange-500/30',
      };
    case 'achieving_goal':
      return {
        bg: 'bg-green-100 dark:bg-green-500/20',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-200 dark:border-green-500/30',
        icon: 'trending_up',
      };
    case 'consistent':
      return {
        bg: 'bg-blue-100 dark:bg-blue-500/20',
        text: 'text-blue-700 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-500/30',
      };
    case 'needs_checkin':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-500/20',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-200 dark:border-yellow-500/30',
      };
    case 'improving':
      return {
        bg: 'bg-purple-100 dark:bg-purple-500/20',
        text: 'text-purple-700 dark:text-purple-400',
        border: 'border-purple-200 dark:border-purple-500/30',
      };
    case 'goal_met':
      return {
        bg: 'bg-emerald-100 dark:bg-emerald-500/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-500/30',
        icon: 'check_circle',
      };
    default:
      return {
        bg: 'bg-slate-100 dark:bg-slate-500/20',
        text: 'text-slate-700 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-500/30',
      };
  }
};

const AITagBadge = ({ tag }: { tag: AITag }) => {
  const styles = getAITagStyles(tag.type);
  
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${styles.bg} ${styles.text} ${styles.border}`}
    >
      {styles.hasPulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {styles.icon && (
        <span className="material-symbols-outlined text-sm">{styles.icon}</span>
      )}
      {tag.label}
    </span>
  );
};

const ClientsPage = () => {
  const { clients, setClients, selectedClientId, setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [aiTagFilter, setAiTagFilter] = useState<string>('all');
  const [engagementFilter, setEngagementFilter] = useState<string>('all');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [showInsightsBanner, setShowInsightsBanner] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

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

  let filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase()) ||
      client.status.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesEngagement = engagementFilter === 'all' || client.engagementType === engagementFilter;
    
    if (aiTagFilter !== 'all') {
      const clientTags = mockAITags[client.id] || [];
      const hasTag = clientTags.some(t => t.type === aiTagFilter);
      if (!hasTag) return false;
    }
    
    return matchesSearch && matchesStatus && matchesEngagement;
  });

  filteredClients = [...filteredClients].sort((a, b) => {
    let aVal: string | number, bVal: string | number;
    switch (sortField) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'status':
        aVal = a.status;
        bVal = b.status;
        break;
      case 'lastActive':
        aVal = a.lastActive || a.lastLogin || '';
        bVal = b.lastActive || b.lastLogin || '';
        break;
      default:
        return 0;
    }
    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map(c => c.id));
    }
  };

  const toggleSelect = (clientId: string) => {
    setSelectedClients(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return (
      <span className="material-symbols-outlined text-sm ml-1">
        {sortDirection === 'asc' ? 'expand_less' : 'expand_more'}
      </span>
    );
  };

  const getStatusBadgeClasses = (status: Client['status']) => {
    switch (status) {
      case 'active': 
        return 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 border-green-200 dark:border-green-500/30';
      case 'trial': 
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-500/30';
      case 'inactive': 
        return 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30';
      case 'suspended': 
        return 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30';
      case 'pending':
        return 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-500/30';
      default: 
        return 'bg-slate-100 dark:bg-slate-500/20 text-slate-700 dark:text-slate-400 border-slate-200 dark:border-slate-500/30';
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Client Management" 
        showInvite={false}
        onAskPat={openAskPat}
      />
      
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto max-w-[1200px] p-4 lg:p-8 flex flex-col gap-6">
          {isLoading ? (
            <div className="space-y-6">
              <Skeleton className="h-12" />
              <Skeleton className="h-24" />
              <Skeleton className="h-16" />
              <Skeleton className="h-96" />
            </div>
          ) : (
            <>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight" data-testid="text-clients-title">
                    Client Management
                  </h1>
                  <p className="text-slate-500 dark:text-[#92a4c9] text-base">
                    Manage your roster and view AI-driven insights from Pat.
                  </p>
                </div>
                <Button 
                  className="shadow-lg shadow-primary/20" 
                  data-testid="button-add-client"
                  onClick={() => setShowAddModal(true)}
                >
                  <span className="material-symbols-outlined text-[20px] mr-2">add</span>
                  Add New Client
                </Button>
              </div>

              {showInsightsBanner && (
                <div className="rounded-xl border border-blue-200 dark:border-[#324467] bg-blue-50/50 dark:bg-[#1e2229] p-4 md:p-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2.5 rounded-full hidden sm:block">
                        <span className="material-symbols-outlined text-primary">auto_awesome</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-slate-900 dark:text-white font-bold text-base flex items-center gap-2">
                          <span className="sm:hidden material-symbols-outlined text-primary text-lg">auto_awesome</span>
                          Pat's AI Insights
                        </h3>
                        <p className="text-slate-500 dark:text-[#92a4c9] text-sm max-w-2xl">
                          AI tags are updated daily based on recent session transcripts and chat logs. Hover over tags for detailed sentiment analysis.
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowInsightsBanner(false)}
                      className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-white transition-colors text-sm font-medium flex items-center gap-1 shrink-0"
                      data-testid="button-dismiss-banner"
                    >
                      <span>Dismiss</span>
                      <span className="material-symbols-outlined text-lg">close</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between bg-white dark:bg-[#1e2229] p-2 rounded-xl shadow-sm border border-slate-200 dark:border-transparent">
                <div className="flex-1 max-w-lg">
                  <label className="relative flex w-full items-center">
                    <span className="absolute left-4 text-slate-400">
                      <span className="material-symbols-outlined">search</span>
                    </span>
                    <input
                      type="text"
                      className="w-full bg-slate-50 dark:bg-[#111722] border-none rounded-lg py-2.5 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-400 focus:ring-2 focus:ring-primary/50 focus:outline-none"
                      placeholder="Search by name, email, or status..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      data-testid="input-search-clients"
                    />
                  </label>
                </div>
                <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-[#111722] rounded-lg border border-slate-200 dark:border-[#324467] hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors whitespace-nowrap"
                        data-testid="button-status-filter"
                      >
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Status: {statusFilter === 'all' ? 'All' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
                        </span>
                        <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setStatusFilter('all')}>All Status</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('active')}>Active</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('inactive')}>Inactive</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('trial')}>Trial</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setStatusFilter('suspended')}>Suspended</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-[#111722] rounded-lg border border-slate-200 dark:border-[#324467] hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors whitespace-nowrap"
                        data-testid="button-engagement-filter"
                      >
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          Engagement: {engagementFilter === 'all' ? 'All' : 
                            engagementFilter === 'in_person' ? 'In-Person' :
                            engagementFilter === 'online_1on1' ? 'Online 1:1' : 'Program Only'}
                        </span>
                        <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setEngagementFilter('all')}>All Types</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setEngagementFilter('in_person')}>
                        <span className="material-symbols-outlined text-sm mr-2">fitness_center</span>
                        In-Person
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEngagementFilter('online_1on1')}>
                        <span className="material-symbols-outlined text-sm mr-2">videocam</span>
                        Online 1:1
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setEngagementFilter('program_only')}>
                        <span className="material-symbols-outlined text-sm mr-2">school</span>
                        Program Only
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button 
                        className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-[#111722] rounded-lg border border-slate-200 dark:border-[#324467] hover:bg-slate-100 dark:hover:bg-[#232f48] transition-colors whitespace-nowrap"
                        data-testid="button-ai-tags-filter"
                      >
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-300">
                          AI Tags: {aiTagFilter === 'all' ? 'All Risks' : aiTagFilter.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </span>
                        <span className="material-symbols-outlined text-slate-400 text-lg">expand_more</span>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => setAiTagFilter('all')}>All Risks</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setAiTagFilter('at_risk')}>At Risk</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAiTagFilter('high_anxiety')}>High Anxiety</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAiTagFilter('needs_checkin')}>Needs Check-in</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => setAiTagFilter('achieving_goal')}>Achieving Goal</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAiTagFilter('consistent')}>Consistent</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAiTagFilter('improving')}>Improving</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setAiTagFilter('goal_met')}>Goal Met</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {selectedClients.length > 0 && (
                <div className="flex items-center gap-4 p-3 bg-muted rounded-lg flex-wrap">
                  <span className="text-sm font-medium" data-testid="text-selected-count">
                    {selectedClients.length} selected
                  </span>
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="outline" size="sm" data-testid="button-message-all">
                      <span className="material-symbols-outlined text-base mr-2">chat</span>
                      Message All
                    </Button>
                    <Button variant="outline" size="sm" data-testid="button-add-to-group">
                      <span className="material-symbols-outlined text-base mr-2">group</span>
                      Add to Group
                    </Button>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedClients([])}
                    className="ml-auto"
                    data-testid="button-clear-selection"
                  >
                    Clear Selection
                  </Button>
                </div>
              )}

              <Card className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <Table className="min-w-[700px]">
                      <TableHeader>
                        <TableRow className="bg-slate-50 dark:bg-[#111722]">
                          <TableHead className="w-12">
                            <Checkbox
                              checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                              onCheckedChange={toggleSelectAll}
                              data-testid="checkbox-select-all"
                            />
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover-elevate font-semibold text-slate-700 dark:text-slate-300"
                            onClick={() => handleSort('name')}
                            data-testid="header-sort-name"
                          >
                            <div className="flex items-center">
                              Client
                              <SortIcon field="name" />
                            </div>
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover-elevate font-semibold text-slate-700 dark:text-slate-300"
                            onClick={() => handleSort('status')}
                            data-testid="header-sort-status"
                          >
                            <div className="flex items-center">
                              Status
                              <SortIcon field="status" />
                            </div>
                          </TableHead>
                          <TableHead className="font-semibold text-slate-700 dark:text-slate-300" data-testid="header-ai-tags">
                            Pat's AI Tags
                          </TableHead>
                          <TableHead 
                            className="cursor-pointer hover-elevate font-semibold text-slate-700 dark:text-slate-300"
                            onClick={() => handleSort('lastActive')}
                            data-testid="header-sort-lastActive"
                          >
                            <div className="flex items-center">
                              Last Check-in
                              <SortIcon field="lastActive" />
                            </div>
                          </TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredClients.map((client) => (
                          <TableRow 
                            key={client.id}
                            className="cursor-pointer hover:bg-slate-50 dark:hover:bg-[#232f48] transition-colors"
                            onClick={() => handleViewClient(client.id)}
                            data-testid={`row-client-${client.id}`}
                          >
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <Checkbox
                                checked={selectedClients.includes(client.id)}
                                onCheckedChange={() => toggleSelect(client.id)}
                                data-testid={`checkbox-client-${client.id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                                    {client.name.split(' ').map(n => n[0]).join('')}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="font-semibold text-slate-900 dark:text-white" data-testid={`text-client-name-${client.id}`}>
                                    {client.name}
                                  </p>
                                  <p className="text-sm text-slate-500 dark:text-[#92a4c9]" data-testid={`text-client-email-${client.id}`}>
                                    {client.email}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span 
                                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadgeClasses(client.status)}`}
                                data-testid={`badge-status-${client.id}`}
                              >
                                {client.status.charAt(0).toUpperCase() + client.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex gap-1.5 flex-wrap">
                                {mockAITags[client.id]?.map((tag, i) => (
                                  <AITagBadge key={i} tag={tag} />
                                )) || (
                                  <span className="text-slate-400 dark:text-slate-500 text-sm">No tags</span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-600 dark:text-[#92a4c9]" data-testid={`text-lastActive-${client.id}`}>
                              {client.lastActive || client.lastLogin}
                            </TableCell>
                            <TableCell onClick={(e) => e.stopPropagation()}>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" data-testid={`button-actions-${client.id}`}>
                                    <span className="material-symbols-outlined text-base">more_horiz</span>
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={() => handleViewClient(client.id)}
                                    data-testid={`menu-view-profile-${client.id}`}
                                  >
                                    <span className="material-symbols-outlined text-base mr-2">person</span>
                                    View Profile
                                  </DropdownMenuItem>
                                  <DropdownMenuItem data-testid={`menu-send-message-${client.id}`}>
                                    <span className="material-symbols-outlined text-base mr-2">chat</span>
                                    Send Message
                                  </DropdownMenuItem>
                                  <DropdownMenuItem data-testid={`menu-schedule-${client.id}`}>
                                    <span className="material-symbols-outlined text-base mr-2">calendar_month</span>
                                    Schedule Check-in
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem 
                                    className="text-destructive"
                                    data-testid={`menu-remove-client-${client.id}`}
                                  >
                                    <span className="material-symbols-outlined text-base mr-2">person_remove</span>
                                    Remove Client
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  {filteredClients.length === 0 && (
                    <div className="text-center py-12">
                      <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-slate-600 mb-3 block">search_off</span>
                      <p className="text-slate-500 dark:text-[#92a4c9] mb-2">No clients found</p>
                      <Button 
                        variant="ghost" 
                        onClick={() => { setSearch(''); setStatusFilter('all'); setAiTagFilter('all'); }}
                        data-testid="button-clear-filters"
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}

                  <div className="flex items-center justify-between p-4 border-t border-slate-200 dark:border-[#324467]">
                    <p className="text-sm text-slate-500 dark:text-[#92a4c9]" data-testid="text-showing-count">
                      Showing 1-{filteredClients.length} of {clients.length} clients
                    </p>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" disabled data-testid="button-previous">
                        Previous
                      </Button>
                      <Button size="sm" data-testid="button-next">
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <ClientDrawer />

      <AddClientModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
      />
    </div>
  );
};

export default ClientsPage;
