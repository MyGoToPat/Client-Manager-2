import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { groupsService } from '../../services/groups.service';
import { clientsService } from '../../services/clients.service';
import type { ClientGroup, GroupType, Client } from '../../types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group?: ClientGroup | null;
  onSuccess: () => void;
}

const colorOptions = [
  { value: '#3B82F6', label: 'Blue' },
  { value: '#22C55E', label: 'Green' },
  { value: '#F59E0B', label: 'Amber' },
  { value: '#EF4444', label: 'Red' },
  { value: '#8B5CF6', label: 'Purple' },
  { value: '#EC4899', label: 'Pink' },
  { value: '#06B6D4', label: 'Cyan' },
];

const iconOptions = [
  { value: 'dumbbell', label: 'Dumbbell' },
  { value: 'sunrise', label: 'Sunrise' },
  { value: 'scale', label: 'Scale' },
  { value: 'gift', label: 'Gift' },
  { value: 'building', label: 'Building' },
  { value: 'users', label: 'Users' },
];

const durationOptions = [
  { value: 4, label: '4 weeks' },
  { value: 6, label: '6 weeks' },
  { value: 8, label: '8 weeks' },
  { value: 10, label: '10 weeks' },
  { value: 12, label: '12 weeks' },
  { value: 16, label: '16 weeks' },
];

const groupTypeIcons: Record<string, string> = {
  program_cohort: 'menu_book',
  custom: 'group',
  promotion: 'redeem',
  organization: 'business',
};

export function CreateGroupModal({ open, onOpenChange, group, onSuccess }: CreateGroupModalProps) {
  const isEditing = !!group;
  
  const [type, setType] = useState<GroupType>('custom');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#3B82F6');
  const [icon, setIcon] = useState('users');
  const [programName, setProgramName] = useState('');
  const [durationWeeks, setDurationWeeks] = useState(12);
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [maxCapacity, setMaxCapacity] = useState<string>('');
  const [allowNewMembers, setAllowNewMembers] = useState(true);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientSearch, setClientSearch] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  useEffect(() => {
    if (group) {
      setType(group.type);
      setName(group.name);
      setDescription(group.description || '');
      setColor(group.color || '#3B82F6');
      setIcon(group.icon || 'users');
      setSelectedClientIds(group.clientIds);
      setAllowNewMembers(group.allowNewMembers);
      setMaxCapacity(group.maxCapacity?.toString() || '');
      if (group.program) {
        setProgramName(group.program.name);
        setDurationWeeks(group.program.durationWeeks);
        setStartDate(new Date(group.program.startDate));
      }
    } else {
      resetForm();
    }
  }, [group, open]);

  const resetForm = () => {
    setType('custom');
    setName('');
    setDescription('');
    setColor('#3B82F6');
    setIcon('users');
    setProgramName('');
    setDurationWeeks(12);
    setStartDate(new Date());
    setMaxCapacity('');
    setAllowNewMembers(true);
    setSelectedClientIds([]);
    setClientSearch('');
  };

  const loadClients = async () => {
    try {
      const data = await clientsService.getClients('mentor-1');
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(clientSearch.toLowerCase()) ||
    client.email.toLowerCase().includes(clientSearch.toLowerCase())
  );

  const toggleClient = (clientId: string) => {
    setSelectedClientIds(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  const handleSubmit = async () => {
    if (!name.trim()) return;

    setSaving(true);
    try {
      const groupData = {
        mentorId: 'mentor-1',
        name: name.trim(),
        description: description.trim() || undefined,
        type,
        color,
        icon,
        clientIds: selectedClientIds,
        maxCapacity: maxCapacity ? parseInt(maxCapacity) : undefined,
        isActive: true,
        isArchived: false,
        allowNewMembers,
        program: type === 'program_cohort' && programName && startDate ? {
          name: programName,
          durationWeeks,
          startDate,
          currentWeek: 1,
        } : undefined,
      };

      if (isEditing && group) {
        await groupsService.update(group.id, groupData);
      } else {
        await groupsService.create(groupData);
      }
      
      onSuccess();
    } catch (error) {
      console.error('Failed to save group:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {isEditing ? 'Edit Group' : 'Create New Group'}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-6 py-4">
            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Group Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { value: 'program_cohort', label: 'Program Cohort', desc: 'A group going through a structured program' },
                  { value: 'custom', label: 'Custom Group', desc: 'General grouping (morning clients, etc.)' },
                  { value: 'promotion', label: 'Promotional Group', desc: 'Limited-time group for special offers' },
                  { value: 'organization', label: 'Organization', desc: 'Gym/studio based group' },
                ].map((option) => {
                  const iconName = groupTypeIcons[option.value];
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setType(option.value as GroupType)}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-md border text-left transition-colors",
                        type === option.value
                          ? "border-primary bg-primary/5"
                          : "border-border hover-elevate"
                      )}
                      data-testid={`button-type-${option.value}`}
                    >
                      <span className="material-symbols-outlined text-xl text-muted-foreground mt-0.5">{iconName}</span>
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-muted-foreground">{option.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Group Details
              </h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Group Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., 12-Week Shred - January 2025"
                    data-testid="input-group-name"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what this group is about..."
                    rows={3}
                    data-testid="input-group-description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Icon</Label>
                    <Select value={icon} onValueChange={setIcon}>
                      <SelectTrigger data-testid="select-icon">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {iconOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Color</Label>
                    <Select value={color} onValueChange={setColor}>
                      <SelectTrigger data-testid="select-color">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: color }}
                          />
                          <span>{colorOptions.find(c => c.value === color)?.label}</span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {colorOptions.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-4 h-4 rounded-full" 
                                style={{ backgroundColor: opt.value }}
                              />
                              {opt.label}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </section>

            {type === 'program_cohort' && (
              <section>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                  Program Settings
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="programName">Program Name *</Label>
                      <Input
                        id="programName"
                        value={programName}
                        onChange={(e) => setProgramName(e.target.value)}
                        placeholder="e.g., 12-Week Shred"
                        data-testid="input-program-name"
                      />
                    </div>
                    <div>
                      <Label>Duration</Label>
                      <Select 
                        value={durationWeeks.toString()} 
                        onValueChange={(v) => setDurationWeeks(parseInt(v))}
                      >
                        <SelectTrigger data-testid="select-duration">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {durationOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value.toString()}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Start Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal"
                            data-testid="button-start-date"
                          >
                            <span className="material-symbols-outlined text-base mr-2">calendar_month</span>
                            {startDate ? format(startDate, 'MMM d, yyyy') : 'Pick a date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div>
                      <Label htmlFor="maxCapacity">Max Capacity (optional)</Label>
                      <Input
                        id="maxCapacity"
                        type="number"
                        value={maxCapacity}
                        onChange={(e) => setMaxCapacity(e.target.value)}
                        placeholder="e.g., 25"
                        data-testid="input-max-capacity"
                      />
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Add Members
              </h3>
              <div className="space-y-3">
                <div className="relative">
                  <span className="material-symbols-outlined text-base absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">search</span>
                  <Input
                    placeholder="Search clients..."
                    value={clientSearch}
                    onChange={(e) => setClientSearch(e.target.value)}
                    className="pl-9"
                    data-testid="input-search-clients"
                  />
                </div>
                
                <div className="border rounded-md max-h-48 overflow-y-auto">
                  {filteredClients.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      No clients found
                    </div>
                  ) : (
                    filteredClients.map(client => (
                      <label
                        key={client.id}
                        className="flex items-center gap-3 p-3 hover-elevate cursor-pointer border-b last:border-b-0"
                        data-testid={`checkbox-client-${client.id}`}
                      >
                        <Checkbox
                          checked={selectedClientIds.includes(client.id)}
                          onCheckedChange={() => toggleClient(client.id)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {client.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate">{client.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{client.email}</div>
                        </div>
                        <span className={cn(
                          "text-xs px-2 py-0.5 rounded-full",
                          client.status === 'active' ? "bg-green-500/20 text-green-400" :
                          client.status === 'trial' ? "bg-blue-500/20 text-blue-400" :
                          "bg-muted text-muted-foreground"
                        )}>
                          {client.status}
                        </span>
                      </label>
                    ))
                  )}
                </div>
                
                <div className="text-sm text-muted-foreground">
                  {selectedClientIds.length} member{selectedClientIds.length !== 1 ? 's' : ''} selected
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Settings
              </h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <Checkbox
                    checked={allowNewMembers}
                    onCheckedChange={(checked) => setAllowNewMembers(!!checked)}
                    data-testid="checkbox-allow-new-members"
                  />
                  <span className="text-sm">Allow new members to join after start</span>
                </label>
              </div>
            </section>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!name.trim() || saving}
            data-testid="button-save-group"
          >
            {saving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Group'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
