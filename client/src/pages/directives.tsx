import { useState, useEffect, useMemo } from 'react';
import { Plus, Zap, Search, BarChart2 } from 'lucide-react';
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
import { directivesService, clientsService } from '../services';
import type { PTDirective, Client } from '../types';
import { cn } from '@/lib/utils';

type CategoryFilter = 'all' | PTDirective['category'];
type StatusFilter = 'all' | 'active' | 'inactive';

const categoryColors: Record<PTDirective['category'], string> = {
  nutrition: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  workout: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  recovery: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  motivation: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  general: 'bg-muted text-muted-foreground border-muted',
};

const priorityColors: Record<PTDirective['priority'], string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

export default function Directives() {
  const [directives, setDirectives] = useState<PTDirective[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [clientFilter, setClientFilter] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [directivesData, clientsData] = await Promise.all([
        directivesService.getDirectives('mentor-1'),
        clientsService.getClients('mentor-1'),
      ]);
      setDirectives(directivesData);
      setClients(clientsData);
    } catch (error) {
      console.error('Failed to load data:', error);
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
    }
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return 'All Clients';
    const client = clients.find(c => c.id === clientId);
    return client?.name || 'Unknown';
  };

  const filteredDirectives = useMemo(() => {
    return directives.filter((directive) => {
      const matchesSearch = directive.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        directive.messageTemplate.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || directive.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' ? directive.isActive : !directive.isActive);
      const matchesClient = clientFilter === 'all' || 
        directive.clientId === clientFilter || 
        (!directive.clientId && clientFilter === 'global');
      return matchesSearch && matchesCategory && matchesStatus && matchesClient;
    });
  }, [directives, searchQuery, categoryFilter, statusFilter, clientFilter]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="PT Directives" />
      
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
              <SelectTrigger className="w-[140px]" data-testid="select-category">
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

            <Select value={clientFilter} onValueChange={setClientFilter}>
              <SelectTrigger className="w-[160px]" data-testid="select-client">
                <SelectValue placeholder="Client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Clients</SelectItem>
                <SelectItem value="global">Global Only</SelectItem>
                {clients.map(client => (
                  <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                ))}
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

          <Button data-testid="button-new-directive">
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
            {filteredDirectives.map((directive) => (
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
                            <h3 className="text-lg font-medium text-foreground">{directive.name}</h3>
                            <div className="flex items-center gap-2 mt-1 flex-wrap">
                              <Badge variant="outline" className={cn('capitalize', categoryColors[directive.category])}>
                                {directive.category}
                              </Badge>
                              <Badge variant="outline" className={cn('capitalize', priorityColors[directive.priority])}>
                                {directive.priority} priority
                              </Badge>
                              <Badge variant="secondary">
                                {getClientName(directive.clientId)}
                              </Badge>
                            </div>
                          </div>
                          <Switch
                            checked={directive.isActive}
                            onCheckedChange={() => handleToggle(directive.id)}
                            data-testid={`switch-directive-${directive.id}`}
                          />
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
                              <Progress value={directive.effectivenessScore * 100} className="w-24 h-2" />
                              <span className="text-sm font-mono text-muted-foreground">
                                {Math.round(directive.effectivenessScore * 100)}%
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No directives found</p>
            <p className="text-sm">
              {searchQuery || categoryFilter !== 'all' || clientFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Create your first directive to automate client messaging'}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
