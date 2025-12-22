import { useState } from 'react';
import { Search, Bell, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { InviteClientDialog } from './invite-client-dialog';

interface HeaderProps {
  title: string;
  showInvite?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
}

export function Header({ title, showInvite = false, searchValue, onSearchChange }: HeaderProps) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 p-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-2xl mx-4">
        {onSearchChange && (
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search clients... (Cmd+K)"
              className="pl-10 w-full"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showInvite && (
          <Button onClick={() => setInviteOpen(true)} data-testid="button-invite-client">
            <Plus className="w-4 h-4 mr-2" />
            Invite Client
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <Bell className="w-5 h-5" />
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium text-sm">New client signup</span>
              <span className="text-xs text-muted-foreground">David Thompson joined via your referral link</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium text-sm">Directive triggered</span>
              <span className="text-xs text-muted-foreground">Post-Workout Protein Reminder sent to Sarah</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <span className="font-medium text-sm">Client at risk</span>
              <span className="text-xs text-muted-foreground">Emily Rodriguez hasn't logged in for 7 days</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <InviteClientDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </header>
  );
}
