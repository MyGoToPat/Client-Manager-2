import { useState } from 'react';
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
  onAskPat?: () => void;
}

export function Header({ title, showInvite = false, searchValue, onSearchChange, onAskPat }: HeaderProps) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-4 px-6 py-3 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center gap-4">
        <SidebarTrigger data-testid="button-sidebar-toggle" />
        <h1 className="text-xl font-bold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-4 flex-1 max-w-xl mx-4">
        {onSearchChange && (
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xl">
              search
            </span>
            <Input
              type="search"
              placeholder="Search clients or sessions..."
              className="pl-10 w-full bg-muted border-border"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              data-testid="input-search"
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {onAskPat && (
          <Button variant="outline" onClick={onAskPat} data-testid="button-ask-pat" className="gap-2">
            <span className="material-symbols-outlined text-lg">smart_toy</span>
            Ask Pat
            <kbd className="ml-1 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">Cmd</span>K
            </kbd>
          </Button>
        )}

        {showInvite && (
          <Button onClick={() => setInviteOpen(true)} data-testid="button-invite-client" className="gap-2">
            <span className="material-symbols-outlined text-lg">person_add</span>
            Invite Client
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative" data-testid="button-notifications">
              <span className="material-symbols-outlined text-xl">notifications</span>
              <Badge 
                variant="destructive" 
                className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
              >
                3
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel className="flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">notifications</span>
              Notifications
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-base">person_add</span>
                <span className="font-medium text-sm">New client signup</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">David Thompson joined via your referral link</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-chart-4 text-base">bolt</span>
                <span className="font-medium text-sm">Directive triggered</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">Post-Workout Protein Reminder sent to Sarah</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-destructive text-base">warning</span>
                <span className="font-medium text-sm">Client at risk</span>
              </div>
              <span className="text-xs text-muted-foreground ml-6">Emily Rodriguez hasn't logged in for 7 days</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" data-testid="button-settings">
          <span className="material-symbols-outlined text-xl">settings</span>
        </Button>
      </div>

      <InviteClientDialog open={inviteOpen} onOpenChange={setInviteOpen} />
    </header>
  );
}
