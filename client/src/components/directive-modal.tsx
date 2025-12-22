import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Users, User, FolderOpen, Zap, Clock, BarChart3, MessageCircle, Bell, Heart, CheckCircle, HelpCircle, Megaphone, Plus, X } from 'lucide-react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { MentorDirective, Client, ClientGroup, DirectiveType, TriggerEvent, DataPoint } from '../types';

const DIRECTIVE_TYPES: { value: DirectiveType; label: string; description: string; icon: typeof Zap }[] = [
  { value: 'analysis', label: 'Analysis', description: 'Pat analyzes data and provides insights', icon: BarChart3 },
  { value: 'summary', label: 'Summary', description: 'Pat summarizes activity over a period', icon: MessageCircle },
  { value: 'alert', label: 'Alert', description: 'Pat notifies when conditions are met', icon: Bell },
  { value: 'reminder', label: 'Reminder', description: 'Pat reminds client to do something', icon: Clock },
  { value: 'encouragement', label: 'Encouragement', description: 'Pat sends motivation based on achievements', icon: Heart },
  { value: 'check_in', label: 'Check-in', description: 'Pat asks client how they are feeling', icon: HelpCircle },
  { value: 'coaching_cue', label: 'Coaching Cue', description: 'Pat delivers specific training advice', icon: Megaphone },
];

const TRIGGER_EVENTS: { value: TriggerEvent; label: string; category: string }[] = [
  { value: 'workout_completed', label: 'Workout Completed', category: 'workout' },
  { value: 'workout_missed', label: 'Workout Missed', category: 'workout' },
  { value: 'before_workout', label: 'Before Workout', category: 'workout' },
  { value: 'meal_logged', label: 'Meal Logged', category: 'nutrition' },
  { value: 'day_end', label: 'End of Day', category: 'general' },
  { value: 'week_end', label: 'End of Week', category: 'general' },
  { value: 'streak_milestone', label: 'Streak Milestone', category: 'achievement' },
  { value: 'weight_logged', label: 'Weight Logged', category: 'progress' },
  { value: 'goal_achieved', label: 'Goal Achieved', category: 'achievement' },
  { value: 'check_in_time', label: 'Check-in Time', category: 'general' },
  { value: 'rest_day', label: 'Rest Day', category: 'recovery' },
  { value: 'app_opened', label: 'App Opened', category: 'general' },
  { value: 'inactive_period', label: 'Inactive Period (3+ days)', category: 'general' },
];

const DATA_POINTS: { value: DataPoint; label: string; category: string }[] = [
  { value: 'workout_summary', label: 'Workout Summary', category: 'workout' },
  { value: 'workout_volume', label: 'Total Volume', category: 'workout' },
  { value: 'workout_duration', label: 'Duration', category: 'workout' },
  { value: 'exercises_completed', label: 'Exercises Completed', category: 'workout' },
  { value: 'intensity_rating', label: 'Intensity Rating', category: 'workout' },
  { value: 'calories_burned', label: 'Calories Burned', category: 'workout' },
  { value: 'personal_records', label: 'Personal Records', category: 'workout' },
  { value: 'protein_intake', label: 'Protein Intake', category: 'nutrition' },
  { value: 'calorie_intake', label: 'Calorie Intake', category: 'nutrition' },
  { value: 'water_intake', label: 'Water Intake', category: 'nutrition' },
  { value: 'sleep_hours', label: 'Sleep Hours', category: 'recovery' },
  { value: 'sleep_quality', label: 'Sleep Quality', category: 'recovery' },
  { value: 'weight', label: 'Weight', category: 'progress' },
  { value: 'body_measurements', label: 'Body Measurements', category: 'progress' },
  { value: 'streak_count', label: 'Streak Count', category: 'progress' },
  { value: 'weekly_compliance', label: 'Weekly Compliance', category: 'progress' },
  { value: 'mood_rating', label: 'Mood Rating', category: 'wellness' },
  { value: 'energy_level', label: 'Energy Level', category: 'wellness' },
  { value: 'progress_photos', label: 'Progress Photos', category: 'progress' },
];

const REMINDER_TYPES = [
  { value: 'water', label: 'Drink water' },
  { value: 'meal', label: 'Log meal' },
  { value: 'photos', label: 'Take progress photos' },
  { value: 'workout', label: 'Complete scheduled workout' },
  { value: 'sleep', label: 'Get enough sleep' },
  { value: 'custom', label: 'Custom reminder' },
];

const CHECK_IN_QUESTIONS = [
  'How are you feeling today? (1-10)',
  'Any muscle soreness?',
  'Energy level?',
  'Sleep quality last night?',
  'Stress level?',
];

const formSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be under 100 characters'),
  description: z.string().optional(),
  assignmentType: z.enum(['all', 'group', 'individual']),
  clientId: z.string().optional(),
  groupId: z.string().optional(),
  directiveType: z.enum(['analysis', 'summary', 'alert', 'reminder', 'encouragement', 'check_in', 'coaching_cue']),
  triggerType: z.enum(['event', 'schedule', 'condition']),
  triggerEvent: z.string().optional(),
  scheduleType: z.enum(['daily', 'weekly', 'monthly']).optional(),
  scheduleTime: z.string().optional(),
  scheduleDays: z.array(z.string()).optional(),
  conditionMetric: z.string().optional(),
  conditionOperator: z.enum(['above', 'below', 'equals', 'missing_for']).optional(),
  conditionValue: z.number().optional(),
  conditionUnit: z.string().optional(),
  selectedDataPoints: z.array(z.string()),
  dataPointComparison: z.string().optional(),
  actionType: z.enum(['analyze', 'summarize', 'compare', 'alert', 'remind', 'encourage', 'ask', 'deliver_message']),
  analysisInstructions: z.string().optional(),
  compareWith: z.string().optional(),
  highlightImprovements: z.boolean().optional(),
  highlightConcerns: z.boolean().optional(),
  reminderType: z.string().optional(),
  selectedQuestions: z.array(z.string()).optional(),
  customQuestion: z.string().optional(),
  customMessage: z.string().optional(),
  sendToClient: z.boolean(),
  sendToMentor: z.boolean(),
  tone: z.enum(['encouraging', 'neutral', 'direct', 'celebratory']),
  urgency: z.enum(['low', 'medium', 'high']),
  format: z.enum(['brief', 'detailed', 'bullet_points']),
  category: z.enum(['workout', 'nutrition', 'recovery', 'motivation', 'general']),
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
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      assignmentType: 'all',
      clientId: undefined,
      groupId: undefined,
      directiveType: 'analysis',
      triggerType: 'event',
      triggerEvent: 'workout_completed',
      scheduleType: 'weekly',
      scheduleTime: '18:00',
      scheduleDays: ['mon', 'wed', 'fri'],
      conditionMetric: 'protein_intake',
      conditionOperator: 'below',
      conditionValue: 80,
      conditionUnit: 'percent',
      selectedDataPoints: ['workout_summary'],
      dataPointComparison: 'previous',
      actionType: 'analyze',
      analysisInstructions: '',
      compareWith: 'last_session',
      highlightImprovements: true,
      highlightConcerns: true,
      reminderType: 'water',
      selectedQuestions: ['How are you feeling today? (1-10)'],
      customQuestion: '',
      customMessage: '',
      sendToClient: true,
      sendToMentor: false,
      tone: 'encouraging',
      urgency: 'medium',
      format: 'detailed',
      category: 'workout',
      isActive: true,
    },
  });

  const assignmentType = form.watch('assignmentType');
  const directiveType = form.watch('directiveType');
  const triggerType = form.watch('triggerType');
  const actionType = form.watch('actionType');

  useEffect(() => {
    if (directive) {
      const triggerType = directive.trigger.event ? 'event' : directive.trigger.schedule ? 'schedule' : 'condition';
      
      const existingQuestions = directive.action.questions || [];
      const defaultQuestions = existingQuestions.filter(q => CHECK_IN_QUESTIONS.includes(q));
      const customQs = existingQuestions.filter(q => !CHECK_IN_QUESTIONS.includes(q));
      setCustomQuestions(customQs);
      
      form.reset({
        name: directive.name,
        description: directive.description || '',
        assignmentType: directive.assignmentType,
        clientId: directive.clientId,
        groupId: directive.groupId,
        directiveType: directive.directiveType,
        triggerType,
        triggerEvent: directive.trigger.event || 'workout_completed',
        scheduleType: directive.trigger.schedule?.type || 'weekly',
        scheduleTime: directive.trigger.schedule?.time || '18:00',
        scheduleDays: directive.trigger.schedule?.days || [],
        conditionMetric: directive.trigger.condition?.metric || 'protein_intake',
        conditionOperator: directive.trigger.condition?.operator || 'below',
        conditionValue: directive.trigger.condition?.value || 80,
        conditionUnit: directive.trigger.condition?.unit || 'percent',
        selectedDataPoints: directive.dataPoints.map(dp => dp.dataPoint),
        dataPointComparison: directive.dataPoints[0]?.comparison || 'previous',
        actionType: directive.action.actionType,
        analysisInstructions: directive.action.analysisInstructions || '',
        compareWith: directive.action.compareWith || 'last_session',
        highlightImprovements: directive.action.highlightImprovements ?? true,
        highlightConcerns: directive.action.highlightConcerns ?? true,
        reminderType: directive.action.reminderType || 'water',
        selectedQuestions: defaultQuestions,
        customMessage: directive.action.customMessage || directive.customMessage || '',
        sendToClient: directive.recipients.sendToClient,
        sendToMentor: directive.recipients.sendToMentor,
        tone: directive.delivery.tone,
        urgency: directive.delivery.urgency,
        format: directive.delivery.format,
        category: directive.category,
        isActive: directive.isActive,
      });
    } else {
      form.reset({
        name: '',
        description: '',
        assignmentType: 'all',
        directiveType: 'analysis',
        triggerType: 'event',
        triggerEvent: 'workout_completed',
        selectedDataPoints: ['workout_summary'],
        actionType: 'analyze',
        highlightImprovements: true,
        highlightConcerns: true,
        sendToClient: true,
        sendToMentor: false,
        tone: 'encouraging',
        urgency: 'medium',
        format: 'detailed',
        category: 'workout',
        isActive: true,
      });
      setCustomQuestions([]);
    }
  }, [directive, form, open]);

  const handleSubmit = async (data: FormData) => {
    const trigger: MentorDirective['trigger'] = {};
    if (data.triggerType === 'event' && data.triggerEvent) {
      trigger.event = data.triggerEvent as TriggerEvent;
    } else if (data.triggerType === 'schedule') {
      trigger.schedule = {
        type: data.scheduleType || 'weekly',
        time: data.scheduleTime,
        days: data.scheduleDays as ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[],
      };
    } else if (data.triggerType === 'condition') {
      trigger.condition = {
        metric: data.conditionMetric || 'protein_intake',
        operator: data.conditionOperator || 'below',
        value: data.conditionValue || 80,
        unit: data.conditionUnit,
      };
    }

    const dataPoints = data.selectedDataPoints.map(dp => ({
      dataPoint: dp as DataPoint,
      comparison: data.dataPointComparison as 'previous' | 'average' | 'goal' | 'best' | undefined,
    }));

    const allQuestions = [...(data.selectedQuestions || []), ...customQuestions];

    const action: MentorDirective['action'] = {
      actionType: data.actionType,
      analysisInstructions: data.analysisInstructions,
      compareWith: data.compareWith as 'last_session' | 'last_week' | 'baseline' | 'goal' | undefined,
      highlightImprovements: data.highlightImprovements,
      highlightConcerns: data.highlightConcerns,
      questions: allQuestions.length > 0 ? allQuestions : undefined,
      reminderType: data.reminderType as 'water' | 'meal' | 'photos' | 'workout' | 'sleep' | 'custom' | undefined,
      customMessage: data.customMessage,
    };

    const directiveData: Omit<MentorDirective, 'id' | 'triggeredCount' | 'effectivenessScore' | 'lastTriggered' | 'createdAt' | 'updatedAt'> = {
      mentorId: 'mentor-1',
      name: data.name,
      description: data.description,
      assignmentType: data.assignmentType,
      clientId: data.assignmentType === 'individual' ? data.clientId : undefined,
      groupId: data.assignmentType === 'group' ? data.groupId : undefined,
      directiveType: data.directiveType,
      trigger,
      dataPoints,
      action,
      recipients: {
        sendToClient: data.sendToClient,
        sendToMentor: data.sendToMentor,
      },
      delivery: {
        tone: data.tone,
        urgency: data.urgency,
        format: data.format,
      },
      customMessage: data.customMessage,
      isActive: data.isActive,
      category: data.category,
    };

    await onSave(directiveData);
    onOpenChange(false);
  };

  const addCustomQuestion = () => {
    const q = form.getValues('customQuestion');
    if (q && q.trim()) {
      setCustomQuestions([...customQuestions, q.trim()]);
      form.setValue('customQuestion', '');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle data-testid="text-modal-title">
            {isEditing ? 'Edit Directive' : 'Create New Directive'}
          </DialogTitle>
          <DialogDescription>
            Tell Pat what you want done for your clients
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <ScrollArea className="h-[60vh] px-6">
              <div className="space-y-6 pb-6">
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Directive Name *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            placeholder="e.g., Post-Workout Analysis & Comparison"
                            data-testid="input-directive-name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What does this directive do? (optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            {...field} 
                            placeholder="After each workout, Pat summarizes performance and compares to the last session..."
                            className="resize-none"
                            rows={2}
                            data-testid="input-directive-description"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">Who should this apply to?</h3>
                  
                  <FormField
                    control={form.control}
                    name="assignmentType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="all" id="assign-all" data-testid="radio-assign-all" />
                              <Label htmlFor="assign-all" className="flex items-center gap-2 cursor-pointer">
                                <Users className="w-4 h-4" />
                                All Clients
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="group" id="assign-group" data-testid="radio-assign-group" />
                              <Label htmlFor="assign-group" className="flex items-center gap-2 cursor-pointer">
                                <FolderOpen className="w-4 h-4" />
                                A Group
                              </Label>
                              {assignmentType === 'group' && (
                                <Select
                                  value={form.watch('groupId')}
                                  onValueChange={(v) => form.setValue('groupId', v)}
                                >
                                  <SelectTrigger className="w-[180px]" data-testid="select-group">
                                    <SelectValue placeholder="Select group" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {groups.map(g => (
                                      <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="individual" id="assign-individual" data-testid="radio-assign-individual" />
                              <Label htmlFor="assign-individual" className="flex items-center gap-2 cursor-pointer">
                                <User className="w-4 h-4" />
                                Individual
                              </Label>
                              {assignmentType === 'individual' && (
                                <Select
                                  value={form.watch('clientId')}
                                  onValueChange={(v) => form.setValue('clientId', v)}
                                >
                                  <SelectTrigger className="w-[180px]" data-testid="select-client">
                                    <SelectValue placeholder="Select client" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {clients.map(c => (
                                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              )}
                            </div>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">When should Pat do this?</h3>
                  
                  <FormField
                    control={form.control}
                    name="triggerType"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <RadioGroup
                            value={field.value}
                            onValueChange={field.onChange}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="event" id="trigger-event" data-testid="radio-trigger-event" />
                              <Label htmlFor="trigger-event" className="flex items-center gap-2 cursor-pointer">
                                <Zap className="w-4 h-4" />
                                When something happens (Event)
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="schedule" id="trigger-schedule" data-testid="radio-trigger-schedule" />
                              <Label htmlFor="trigger-schedule" className="flex items-center gap-2 cursor-pointer">
                                <Clock className="w-4 h-4" />
                                On a schedule (Time-based)
                              </Label>
                            </div>
                            <div className="flex items-center gap-3">
                              <RadioGroupItem value="condition" id="trigger-condition" data-testid="radio-trigger-condition" />
                              <Label htmlFor="trigger-condition" className="flex items-center gap-2 cursor-pointer">
                                <BarChart3 className="w-4 h-4" />
                                When a condition is met
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {triggerType === 'event' && (
                    <div className="ml-6 p-4 border rounded-md bg-muted/30">
                      <FormField
                        control={form.control}
                        name="triggerEvent"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>When:</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                              <FormControl>
                                <SelectTrigger data-testid="select-trigger-event">
                                  <SelectValue placeholder="Select event" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {TRIGGER_EVENTS.map(e => (
                                  <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {triggerType === 'schedule' && (
                    <div className="ml-6 p-4 border rounded-md bg-muted/30 space-y-4">
                      <div className="flex items-center gap-4 flex-wrap">
                        <FormField
                          control={form.control}
                          name="scheduleType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Frequency:</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  value={field.value}
                                  onValueChange={field.onChange}
                                  className="flex gap-4"
                                >
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="daily" id="freq-daily" />
                                    <Label htmlFor="freq-daily">Daily</Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="weekly" id="freq-weekly" />
                                    <Label htmlFor="freq-weekly">Weekly</Label>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <RadioGroupItem value="monthly" id="freq-monthly" />
                                    <Label htmlFor="freq-monthly">Monthly</Label>
                                  </div>
                                </RadioGroup>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="scheduleTime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Time:</FormLabel>
                            <FormControl>
                              <Input type="time" {...field} className="w-32" data-testid="input-schedule-time" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="scheduleDays"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Days:</FormLabel>
                            <div className="flex gap-2 flex-wrap">
                              {['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].map(day => (
                                <label key={day} className="flex items-center gap-1">
                                  <Checkbox
                                    checked={field.value?.includes(day)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...(field.value || []), day]);
                                      } else {
                                        field.onChange(field.value?.filter((d: string) => d !== day) || []);
                                      }
                                    }}
                                  />
                                  <span className="text-sm uppercase">{day.slice(0, 1)}</span>
                                </label>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {triggerType === 'condition' && (
                    <div className="ml-6 p-4 border rounded-md bg-muted/30 space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm">When</span>
                        <FormField
                          control={form.control}
                          name="conditionMetric"
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-[150px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="protein_intake">Protein intake</SelectItem>
                                <SelectItem value="water_intake">Water intake</SelectItem>
                                <SelectItem value="calorie_intake">Calorie intake</SelectItem>
                                <SelectItem value="sleep_quality">Sleep quality</SelectItem>
                                <SelectItem value="workout_compliance">Workout compliance</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <span className="text-sm">is</span>
                        <FormField
                          control={form.control}
                          name="conditionOperator"
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-[100px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="below">below</SelectItem>
                                <SelectItem value="above">above</SelectItem>
                                <SelectItem value="equals">equals</SelectItem>
                                <SelectItem value="missing_for">missing for</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="conditionValue"
                          render={({ field }) => (
                            <Input 
                              type="number" 
                              {...field}
                              onChange={(e) => field.onChange(Number(e.target.value))}
                              className="w-20" 
                            />
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="conditionUnit"
                          render={({ field }) => (
                            <Select value={field.value} onValueChange={field.onChange}>
                              <SelectTrigger className="w-[120px]">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="percent">% of goal</SelectItem>
                                <SelectItem value="grams">grams</SelectItem>
                                <SelectItem value="hours">hours</SelectItem>
                                <SelectItem value="days">days</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">What should Pat do?</h3>
                  
                  <FormField
                    control={form.control}
                    name="directiveType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Directive Type</FormLabel>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <FormControl>
                            <SelectTrigger data-testid="select-directive-type">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DIRECTIVE_TYPES.map(t => (
                              <SelectItem key={t.value} value={t.value}>
                                <div className="flex items-center gap-2">
                                  <t.icon className="w-4 h-4" />
                                  <span>{t.label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          {DIRECTIVE_TYPES.find(t => t.value === directiveType)?.description}
                        </FormDescription>
                      </FormItem>
                    )}
                  />

                  {(directiveType === 'analysis' || directiveType === 'summary') && (
                    <div className="space-y-4 p-4 border rounded-md bg-muted/30">
                      <FormField
                        control={form.control}
                        name="selectedDataPoints"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Include these data points:</FormLabel>
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              {DATA_POINTS.map(dp => (
                                <label key={dp.value} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={field.value.includes(dp.value)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...field.value, dp.value]);
                                      } else {
                                        field.onChange(field.value.filter((v: string) => v !== dp.value));
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{dp.label}</span>
                                </label>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />

                      <div className="flex gap-4 flex-wrap">
                        <FormField
                          control={form.control}
                          name="dataPointComparison"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Compare to:</FormLabel>
                              <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                  <SelectTrigger className="w-[150px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="previous">Previous</SelectItem>
                                  <SelectItem value="average">Average</SelectItem>
                                  <SelectItem value="goal">Goal</SelectItem>
                                  <SelectItem value="best">Best</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <div className="flex flex-col gap-2">
                          <FormField
                            control={form.control}
                            name="highlightImprovements"
                            render={({ field }) => (
                              <label className="flex items-center gap-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                <span className="text-sm">Highlight improvements</span>
                              </label>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="highlightConcerns"
                            render={({ field }) => (
                              <label className="flex items-center gap-2">
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                <span className="text-sm">Highlight concerns</span>
                              </label>
                            )}
                          />
                        </div>
                      </div>

                      <FormField
                        control={form.control}
                        name="analysisInstructions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Special instructions for Pat (optional):</FormLabel>
                            <FormControl>
                              <Textarea 
                                {...field} 
                                placeholder="Focus on progressive overload. If they lifted heavier or did more reps than last time, make a big deal about it."
                                className="resize-none"
                                rows={2}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {directiveType === 'reminder' && (
                    <div className="p-4 border rounded-md bg-muted/30">
                      <FormField
                        control={form.control}
                        name="reminderType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Remind them to:</FormLabel>
                            <FormControl>
                              <RadioGroup value={field.value} onValueChange={field.onChange} className="space-y-2 mt-2">
                                {REMINDER_TYPES.map(r => (
                                  <div key={r.value} className="flex items-center gap-2">
                                    <RadioGroupItem value={r.value} id={`reminder-${r.value}`} />
                                    <Label htmlFor={`reminder-${r.value}`}>{r.label}</Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  )}

                  {directiveType === 'check_in' && (
                    <div className="p-4 border rounded-md bg-muted/30 space-y-4">
                      <FormField
                        control={form.control}
                        name="selectedQuestions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Questions to ask:</FormLabel>
                            <div className="space-y-2 mt-2">
                              {CHECK_IN_QUESTIONS.map(q => (
                                <label key={q} className="flex items-center gap-2">
                                  <Checkbox
                                    checked={field.value?.includes(q)}
                                    onCheckedChange={(checked) => {
                                      if (checked) {
                                        field.onChange([...(field.value || []), q]);
                                      } else {
                                        field.onChange(field.value?.filter((v: string) => v !== q) || []);
                                      }
                                    }}
                                  />
                                  <span className="text-sm">{q}</span>
                                </label>
                              ))}
                            </div>
                          </FormItem>
                        )}
                      />
                      {customQuestions.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {customQuestions.map((q, i) => (
                            <Badge key={i} variant="secondary" className="gap-1">
                              {q}
                              <button type="button" onClick={() => setCustomQuestions(customQuestions.filter((_, j) => j !== i))}>
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                      <div className="flex gap-2">
                        <FormField
                          control={form.control}
                          name="customQuestion"
                          render={({ field }) => (
                            <Input {...field} placeholder="Add custom question" className="flex-1" />
                          )}
                        />
                        <Button type="button" size="icon" variant="outline" onClick={addCustomQuestion}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}

                  {(directiveType === 'coaching_cue' || directiveType === 'alert') && (
                    <FormField
                      control={form.control}
                      name="customMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Custom message:</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              placeholder="Enter the message Pat should deliver..."
                              className="resize-none"
                              rows={3}
                              data-testid="input-custom-message"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">Who receives this?</h3>
                  
                  <div className="flex gap-6">
                    <FormField
                      control={form.control}
                      name="sendToClient"
                      render={({ field }) => (
                        <label className="flex items-center gap-2">
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-send-client" />
                          <span className="text-sm">Send to Client (via Pat chat)</span>
                        </label>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sendToMentor"
                      render={({ field }) => (
                        <label className="flex items-center gap-2">
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-send-mentor" />
                          <span className="text-sm">Send to Me (notification/dashboard)</span>
                        </label>
                      )}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="font-semibold text-sm uppercase text-muted-foreground">Delivery Style</h3>
                  
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tone</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-tone">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="encouraging">Encouraging</SelectItem>
                              <SelectItem value="neutral">Neutral</SelectItem>
                              <SelectItem value="direct">Direct</SelectItem>
                              <SelectItem value="celebratory">Celebratory</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="format"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Detail</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-format">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="brief">Brief</SelectItem>
                              <SelectItem value="detailed">Detailed</SelectItem>
                              <SelectItem value="bullet_points">Bullet Points</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="urgency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-urgency">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl>
                              <SelectTrigger data-testid="select-category">
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="workout">Workout</SelectItem>
                              <SelectItem value="nutrition">Nutrition</SelectItem>
                              <SelectItem value="recovery">Recovery</SelectItem>
                              <SelectItem value="motivation">Motivation</SelectItem>
                              <SelectItem value="general">General</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                      <label className="flex items-center gap-2">
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} data-testid="checkbox-active" />
                        <span className="text-sm">Activate immediately</span>
                      </label>
                    )}
                  />
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="p-6 pt-4 border-t">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} data-testid="button-cancel">
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading} data-testid="button-save-directive">
                {isLoading ? 'Saving...' : isEditing ? 'Update Directive' : 'Create Directive'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
