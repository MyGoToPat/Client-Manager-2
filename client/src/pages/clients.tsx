import { useState, useEffect } from "react";
import { useStore } from "@/store/useStore";
import { clientsService } from "@/services";
import { Header } from "@/components/header";
import { useAskPat } from "@/App";
import { 
  Search, 
  Download, 
  MoreHorizontal, 
  ChevronDown,
  ChevronUp,
  UserPlus,
  MessageSquare,
  Users,
  Mail
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

type SortField = 'name' | 'status' | 'progress' | 'lastActive';
type SortDirection = 'asc' | 'desc';

const ClientsPage = () => {
  const { clients, setClients, selectedClientId, setSelectedClientId } = useStore();
  const { openAskPat } = useAskPat();
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

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

  const allGroups = Array.from(new Set(clients.flatMap(c => c.groups || [])));

  let filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(search.toLowerCase()) ||
      client.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    const matchesGroup = groupFilter === 'all' || (client.groups && client.groups.includes(groupFilter));
    return matchesSearch && matchesStatus && matchesGroup;
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
      case 'progress':
        aVal = a.progress;
        bVal = b.progress;
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

  const escapeCSVValue = (value: string): string => {
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  const handleExport = () => {
    const headers = ['Name', 'Email', 'Status', 'Role', 'Progress', 'Last Active', 'Groups'];
    const rows = filteredClients.map(c => [
      escapeCSVValue(c.name),
      escapeCSVValue(c.email),
      escapeCSVValue(c.status),
      escapeCSVValue(c.role),
      `${c.progress}%`,
      escapeCSVValue(c.lastActive || c.lastLogin),
      escapeCSVValue((c.groups || []).join('; '))
    ]);
    const csv = [headers.map(escapeCSVValue), ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clients.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleViewClient = (clientId: string) => {
    setSelectedClientId(clientId);
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' 
      ? <ChevronUp className="h-4 w-4 ml-1" />
      : <ChevronDown className="h-4 w-4 ml-1" />;
  };

  const getStatusBadgeVariant = (status: Client['status']) => {
    switch (status) {
      case 'active': return 'default';
      case 'trial': return 'secondary';
      case 'inactive': return 'outline';
      case 'suspended': return 'destructive';
      default: return 'outline';
    }
  };

  const getRoleBadgeVariant = (role: Client['role']) => {
    switch (role) {
      case 'premium': return 'default';
      case 'enterprise': return 'secondary';
      default: return 'outline';
    }
  };

  const activeCount = clients.filter(c => c.status === 'active').length;
  const trialCount = clients.filter(c => c.status === 'trial').length;
  const inactiveCount = clients.filter(c => c.status === 'inactive').length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Clients" 
        showInvite 
        onAskPat={openAskPat}
      />
      
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {isLoading ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
            <Skeleton className="h-12" />
            <Skeleton className="h-96" />
          </div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-2xl font-bold" data-testid="text-clients-title">Clients</h1>
                <p className="text-muted-foreground">
                  Manage and monitor all your clients
                </p>
              </div>
              <Button data-testid="button-invite-client">
                <UserPlus className="h-4 w-4 mr-2" />
                Invite Client
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Total Clients</p>
                  <p className="text-2xl font-bold" data-testid="text-total-clients">{clients.length}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400" data-testid="text-active-clients">
                    {activeCount}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Trial</p>
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400" data-testid="text-trial-clients">
                    {trialCount}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4 pb-4">
                  <p className="text-sm text-muted-foreground">Inactive</p>
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400" data-testid="text-inactive-clients">
                    {inactiveCount}
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search clients by name or email..."
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  data-testid="input-search-clients"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px]" data-testid="select-status-filter">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="suspended">Suspended</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={groupFilter} onValueChange={setGroupFilter}>
                  <SelectTrigger className="w-[160px]" data-testid="select-group-filter">
                    <SelectValue placeholder="Group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Groups</SelectItem>
                    {allGroups.map(group => (
                      <SelectItem key={group} value={group}>{group}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" onClick={handleExport} data-testid="button-export-clients">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>

            {selectedClients.length > 0 && (
              <div className="flex items-center gap-4 p-3 bg-muted rounded-lg flex-wrap">
                <span className="text-sm font-medium" data-testid="text-selected-count">
                  {selectedClients.length} selected
                </span>
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" data-testid="button-message-all">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message All
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-add-to-group">
                    <Users className="h-4 w-4 mr-2" />
                    Add to Group
                  </Button>
                  <Button variant="outline" size="sm" data-testid="button-send-email">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
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

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table className="min-w-[800px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox
                            checked={selectedClients.length === filteredClients.length && filteredClients.length > 0}
                            onCheckedChange={toggleSelectAll}
                            data-testid="checkbox-select-all"
                          />
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover-elevate"
                          onClick={() => handleSort('name')}
                          data-testid="header-sort-name"
                        >
                          <div className="flex items-center">
                            Client
                            <SortIcon field="name" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover-elevate"
                          onClick={() => handleSort('status')}
                          data-testid="header-sort-status"
                        >
                          <div className="flex items-center">
                            Status
                            <SortIcon field="status" />
                          </div>
                        </TableHead>
                        <TableHead data-testid="header-role">Role</TableHead>
                        <TableHead data-testid="header-groups">Groups</TableHead>
                        <TableHead 
                          className="cursor-pointer hover-elevate"
                          onClick={() => handleSort('progress')}
                          data-testid="header-sort-progress"
                        >
                          <div className="flex items-center">
                            Progress
                            <SortIcon field="progress" />
                          </div>
                        </TableHead>
                        <TableHead 
                          className="cursor-pointer hover-elevate"
                          onClick={() => handleSort('lastActive')}
                          data-testid="header-sort-lastActive"
                        >
                          <div className="flex items-center">
                            Last Active
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
                          className="cursor-pointer hover-elevate"
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
                              <Avatar>
                                <AvatarFallback>
                                  {client.name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium" data-testid={`text-client-name-${client.id}`}>{client.name}</p>
                                <p className="text-sm text-muted-foreground" data-testid={`text-client-email-${client.id}`}>{client.email}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getStatusBadgeVariant(client.status)} data-testid={`badge-status-${client.id}`}>
                              {client.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRoleBadgeVariant(client.role)} data-testid={`badge-role-${client.id}`}>
                              {client.role}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {client.groups && client.groups.length > 0 ? (
                                <>
                                  {client.groups.slice(0, 2).map((group, i) => (
                                    <Badge key={i} variant="secondary" className="text-xs">
                                      {group}
                                    </Badge>
                                  ))}
                                  {client.groups.length > 2 && (
                                    <Badge variant="secondary" className="text-xs">
                                      +{client.groups.length - 2}
                                    </Badge>
                                  )}
                                </>
                              ) : (
                                <span className="text-muted-foreground text-sm">-</span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={client.progress} className="w-16 h-2" />
                              <span className="text-sm text-muted-foreground w-10" data-testid={`text-progress-${client.id}`}>
                                {client.progress}%
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-muted-foreground" data-testid={`text-lastActive-${client.id}`}>
                            {client.lastActive || client.lastLogin}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" data-testid={`button-actions-${client.id}`}>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem 
                                  onClick={() => handleViewClient(client.id)}
                                  data-testid={`menu-view-profile-${client.id}`}
                                >
                                  View Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`menu-send-message-${client.id}`}>
                                  Send Message
                                </DropdownMenuItem>
                                <DropdownMenuItem data-testid={`menu-add-to-group-${client.id}`}>
                                  Add to Group
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  data-testid={`menu-remove-client-${client.id}`}
                                >
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
                    <p className="text-muted-foreground">No clients found</p>
                    <Button variant="ghost" onClick={() => { setSearch(''); setStatusFilter('all'); setGroupFilter('all'); }}>
                      Clear filters
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground" data-testid="text-showing-count">
                Showing {filteredClients.length} of {clients.length} clients
              </p>
            </div>
          </>
        )}
      </main>

      <ClientDrawer />
    </div>
  );
};

export default ClientsPage;
