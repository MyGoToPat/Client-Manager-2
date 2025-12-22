import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Info } from 'lucide-react';
import { format } from 'date-fns';
import type { ProgramTemplate, Client, ClientGroup } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  template: ProgramTemplate;
  clients: Client[];
  onCreateGroup: (group: Partial<ClientGroup>) => void;
}

export function CreateGroupFromTemplateModal({ open, onClose, template, clients, onCreateGroup }: Props) {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [maxCapacity, setMaxCapacity] = useState<string>('');
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [allowNewMembers, setAllowNewMembers] = useState(true);
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    if (open && template) {
      setName(`${template.name} - ${format(new Date(), 'MMMM yyyy')} Cohort`);
      setStartDate(new Date());
      setMaxCapacity('');
      setSelectedClients([]);
      setAllowNewMembers(true);
    }
  }, [open, template]);

  const handleSubmit = () => {
    const newGroup: Partial<ClientGroup> = {
      name,
      description: template.description,
      type: 'program_cohort',
      program: {
        templateId: template.id,
        name: template.name,
        durationWeeks: template.durationWeeks,
        startDate: startDate,
        currentWeek: 1,
      },
      clientIds: selectedClients,
      maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
      isActive: true,
      isArchived: false,
      allowNewMembers,
      memberCount: selectedClients.length,
      avgProgress: 0,
      avgCompliance: 0,
      modules: template.modules,
      directives: template.directives,
    };
    
    onCreateGroup(newGroup);
    onClose();
  };

  const toggleClient = (clientId: string) => {
    setSelectedClients(prev => 
      prev.includes(clientId) 
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Group from Template</DialogTitle>
          <DialogDescription>
            Create a new cohort from "{template?.name}"
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This will create a new cohort with all {template?.modules?.length || 0} modules and {template?.directives?.length || 0} automated directives from the template.
          </AlertDescription>
        </Alert>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Cohort Name *</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., 12-Week Shred - January 2025 Cohort"
              data-testid="input-cohort-name"
            />
          </div>

          <div className="space-y-2">
            <Label>Start Date *</Label>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                  data-testid="button-start-date"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP') : 'Pick a date'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) setStartDate(date);
                    setCalendarOpen(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="capacity">Max Capacity (optional)</Label>
            <Input
              id="capacity"
              type="number"
              value={maxCapacity}
              onChange={(e) => setMaxCapacity(e.target.value)}
              placeholder="e.g., 25"
              data-testid="input-max-capacity"
            />
          </div>

          <div className="space-y-2">
            <Label>Add Members</Label>
            <div className="border rounded-lg max-h-48 overflow-y-auto">
              {clients.length === 0 ? (
                <p className="p-3 text-sm text-muted-foreground text-center">No clients available</p>
              ) : (
                clients.map(client => (
                  <div 
                    key={client.id}
                    className="flex items-center space-x-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                    onClick={() => toggleClient(client.id)}
                    data-testid={`client-row-${client.id}`}
                  >
                    <Checkbox 
                      checked={selectedClients.includes(client.id)}
                      onCheckedChange={() => toggleClient(client.id)}
                      data-testid={`checkbox-client-${client.id}`}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {client.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{client.name}</p>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                      {client.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              {selectedClients.length} member{selectedClients.length !== 1 ? 's' : ''} selected
            </p>
          </div>

          <div className="space-y-2">
            <Label>Settings</Label>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="allowNew"
                checked={allowNewMembers}
                onCheckedChange={(checked) => setAllowNewMembers(checked as boolean)}
                data-testid="checkbox-allow-new-members"
              />
              <Label htmlFor="allowNew" className="font-normal cursor-pointer">
                Allow new members to join after start
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name || !startDate} data-testid="button-create-cohort">
            Create Cohort
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
