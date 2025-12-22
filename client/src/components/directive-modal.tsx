import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, User, FolderOpen } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import type { MentorDirective, Client, ClientGroup } from '../types';

const TRIGGER_EVENTS = [
  { value: 'workout_completed', label: 'Workout Completed', category: 'workout' },
  { value: 'workout_missed', label: 'Workout Missed', category: 'workout' },
  { value: 'streak_milestone', label: 'Streak Milestone', category: 'workout' },
  { value: 'meal_logged', label: 'Meal Logged', category: 'nutrition' },
  { value: 'low_protein_day', label: 'Low Protein Day', category: 'nutrition' },
  { value: 'hydration_low', label: 'Hydration Low', category: 'nutrition' },
  { value: 'poor_sleep', label: 'Poor Sleep Quality', category: 'recovery' },
  { value: 'rest_day', label: 'Rest Day', category: 'recovery' },
  { value: 'weekly_check_in', label: 'Weekly Check-in', category: 'general' },
  { value: 'inactivity_alert', label: 'Inactivity Alert (3+ days)', category: 'general' },
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  assignmentType: z.enum(['all', 'group', 'individual']),
  clientId: z.string().optional(),
  groupId: z.string().optional(),
  triggerEvent: z.string().min(1, 'Trigger event is required'),
  messageTemplate: z.string().min(1, 'Message template is required').max(500, 'Message must be under 500 characters'),
  category: z.enum(['nutrition', 'workout', 'recovery', 'motivation', 'general']),
  priority: z.enum(['low', 'medium', 'high']),
  isActive: z.boolean(),
}).refine(
  (data) => {
    if (data.assignmentType === 'group') return !!data.groupId;
    if (data.assignmentType === 'individual') return !!data.clientId;
    return true;
  },
  {
    message: 'Please select a target for this directive',
    path: ['assignmentType'],
  }
);

type FormData = z.infer<typeof formSchema>;

interface DirectiveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  directive?: MentorDirective | null;
  clients: Client[];
  groups: ClientGroup[];
  onSave: (data: Omit<MentorDirective, 'id' | 'triggeredCount' | 'effectivenessScore' | 'lastTriggered' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  isLoading?: boolean;
}

export function DirectiveModal({
  open,
  onOpenChange,
  directive,
  clients,
  groups,
  onSave,
  isLoading = false,
}: DirectiveModalProps) {
  const isEditing = !!directive;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      assignmentType: 'all',
      clientId: undefined,
      groupId: undefined,
      triggerEvent: '',
      messageTemplate: '',
      category: 'general',
      priority: 'medium',
      isActive: true,
    },
  });

  const assignmentType = form.watch('assignmentType');

  useEffect(() => {
    if (directive) {
      form.reset({
        name: directive.name,
        assignmentType: directive.assignmentType,
        clientId: directive.clientId,
        groupId: directive.groupId,
        triggerEvent: directive.triggerEvent,
        messageTemplate: directive.messageTemplate,
        category: directive.category,
        priority: directive.priority,
        isActive: directive.isActive,
      });
    } else {
      form.reset({
        name: '',
        assignmentType: 'all',
        clientId: undefined,
        groupId: undefined,
        triggerEvent: '',
        messageTemplate: '',
        category: 'general',
        priority: 'medium',
        isActive: true,
      });
    }
  }, [directive, form, open]);

  const handleSubmit = async (data: FormData) => {
    const submitData: Omit<MentorDirective, 'id' | 'triggeredCount' | 'effectivenessScore' | 'lastTriggered' | 'createdAt' | 'updatedAt'> = {
      mentorId: 'mentor-1',
      name: data.name,
      assignmentType: data.assignmentType,
      clientId: data.assignmentType === 'individual' ? data.clientId : undefined,
      groupId: data.assignmentType === 'group' ? data.groupId : undefined,
      triggerEvent: data.triggerEvent,
      triggerConditions: {},
      messageTemplate: data.messageTemplate,
      category: data.category,
      priority: data.priority,
      isActive: data.isActive,
    };
    
    await onSave(submitData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle data-testid="text-modal-title">
            {isEditing ? 'Edit Directive' : 'Create New Directive'}
          </DialogTitle>
          <DialogDescription>
            {isEditing 
              ? 'Update the directive settings below.' 
              : 'Configure Pat to send automated messages based on client activity.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Directive Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Post-Workout Protein Reminder" 
                      {...field} 
                      data-testid="input-directive-name"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="assignmentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Assign To</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="flex flex-col gap-3 pt-2"
                    >
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="all" id="assign-all" data-testid="radio-assign-all" />
                        <Label htmlFor="assign-all" className="flex items-center gap-2 cursor-pointer">
                          <Users className="w-4 h-4 text-chart-1" />
                          All Clients
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="group" id="assign-group" data-testid="radio-assign-group" />
                        <Label htmlFor="assign-group" className="flex items-center gap-2 cursor-pointer">
                          <FolderOpen className="w-4 h-4 text-chart-4" />
                          Specific Group
                        </Label>
                      </div>
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="individual" id="assign-individual" data-testid="radio-assign-individual" />
                        <Label htmlFor="assign-individual" className="flex items-center gap-2 cursor-pointer">
                          <User className="w-4 h-4 text-muted-foreground" />
                          Individual Client
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {assignmentType === 'group' && (
              <FormField
                control={form.control}
                name="groupId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Group</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-group">
                          <SelectValue placeholder="Choose a group..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {groups.map((group) => (
                          <SelectItem key={group.id} value={group.id}>
                            {group.name} ({group.clientIds.length} clients)
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {assignmentType === 'individual' && (
              <FormField
                control={form.control}
                name="clientId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Client</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-client">
                          <SelectValue placeholder="Choose a client..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {clients.map((client) => (
                          <SelectItem key={client.id} value={client.id}>
                            {client.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="triggerEvent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Trigger Event</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-trigger">
                        <SelectValue placeholder="When should this trigger?" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {TRIGGER_EVENTS.map((event) => (
                        <SelectItem key={event.value} value={event.value}>
                          {event.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Pat will send the message when this event occurs
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-category">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="nutrition">Nutrition</SelectItem>
                        <SelectItem value="workout">Workout</SelectItem>
                        <SelectItem value="recovery">Recovery</SelectItem>
                        <SelectItem value="motivation">Motivation</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-priority">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="messageTemplate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Template</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Great workout, {name}! Remember to consume protein within 30 minutes..."
                      className="resize-none"
                      rows={3}
                      {...field}
                      data-testid="input-message-template"
                    />
                  </FormControl>
                  <FormDescription>
                    Use {'{name}'} for client name, {'{current}'} for current value, {'{goal}'} for target
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isLoading}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                data-testid="button-save-directive"
              >
                {isLoading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Directive'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
