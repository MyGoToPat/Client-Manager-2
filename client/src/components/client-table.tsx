import { MoreHorizontal, Mail, Phone } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Client } from '../types';
import { cn } from '@/lib/utils';

interface ClientTableProps {
  clients: Client[];
  onClientClick: (clientId: string) => void;
  onStatusChange?: (clientId: string, status: Client['status']) => void;
}

const statusColors: Record<Client['status'], string> = {
  active: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  inactive: 'bg-muted text-muted-foreground border-muted',
  pending: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  trial: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  suspended: 'bg-destructive/10 text-destructive border-destructive/20',
};

const roleColors: Record<Client['role'], string> = {
  client: 'bg-muted text-muted-foreground border-muted',
  premium: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  enterprise: 'bg-chart-5/10 text-chart-5 border-chart-5/20',
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

export function ClientTable({ clients, onClientClick, onStatusChange }: ClientTableProps) {
  return (
    <div className="rounded-md border border-border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30">
            <TableHead className="w-[300px]">Client</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead>Last Active</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow
              key={client.id}
              className="cursor-pointer hover-elevate"
              onClick={() => onClientClick(client.id)}
              data-testid={`row-client-${client.id}`}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={cn('font-medium', getAvatarColor(client.name))}>
                      {getInitials(client.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">{client.name}</span>
                    <span className="text-xs text-muted-foreground">{client.email}</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn('capitalize', statusColors[client.status])}
                >
                  {client.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant="outline" 
                  className={cn('capitalize', roleColors[client.role])}
                >
                  {client.role}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-3 min-w-[120px]">
                  <Progress value={client.progress} className="h-2 flex-1" />
                  <span className="text-xs font-mono text-muted-foreground w-8">
                    {client.progress}%
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">{client.lastLogin}</span>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" data-testid={`button-actions-${client.id}`}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onClientClick(client.id); }}>
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                      <Mail className="w-4 h-4 mr-2" />
                      Send Message
                    </DropdownMenuItem>
                    {client.phone && (
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Phone className="w-4 h-4 mr-2" />
                        Call Client
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {onStatusChange && client.status !== 'suspended' && (
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={(e) => { e.stopPropagation(); onStatusChange(client.id, 'suspended'); }}
                      >
                        Suspend Client
                      </DropdownMenuItem>
                    )}
                    {onStatusChange && client.status === 'suspended' && (
                      <DropdownMenuItem 
                        onClick={(e) => { e.stopPropagation(); onStatusChange(client.id, 'active'); }}
                      >
                        Reactivate Client
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
