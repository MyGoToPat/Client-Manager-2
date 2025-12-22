import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { ClientGroup, TemplateDirective, DirectiveAction } from '../../types';

interface Props {
  open: boolean;
  onClose: () => void;
  group: ClientGroup;
  onSave: (directive: TemplateDirective) => void;
}

export function CreateGroupDirectiveModal({ open, onClose, group, onSave }: Props) {
  const isProgramCohort = group.type === 'program_cohort';
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [triggerType, setTriggerType] = useState<'program' | 'event' | 'schedule'>('event');
  const [week, setWeek] = useState<number>(1);
  const [day, setDay] = useState<number>(1);
  const [eventType, setEventType] = useState('workout_completed');
  const [directiveType, setDirectiveType] = useState<DirectiveAction['actionType']>('encourage');
  const [tone, setTone] = useState('encouraging');

  const handleSubmit = () => {
    const directive: TemplateDirective = {
      id: `dir-${Date.now()}`,
      name,
      description,
      week: triggerType === 'program' ? week : 0,
      day: triggerType === 'program' ? day : undefined,
      directiveType: directiveType,
      action: { actionType: directiveType },
      delivery: { tone, format: 'detailed' },
    };
    onSave(directive);
    resetForm();
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTriggerType('event');
    setWeek(1);
    setDay(1);
    setEventType('workout_completed');
    setDirectiveType('encourage');
    setTone('encouraging');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Group Directive</DialogTitle>
          <DialogDescription>
            Create an automation that will apply to all members of this group
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Directive Name *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Week 4 Motivation Boost"
              data-testid="input-directive-name"
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What should Pat do?"
              data-testid="input-directive-description"
            />
          </div>

          <div className="space-y-2">
            <Label>When should this trigger?</Label>
            <RadioGroup value={triggerType} onValueChange={(v) => setTriggerType(v as typeof triggerType)}>
              {isProgramCohort && (
                <div className="flex items-center space-x-2 p-3 border rounded-lg">
                  <RadioGroupItem value="program" id="program" />
                  <Label htmlFor="program" className="flex-1 cursor-pointer">
                    <div className="font-medium">At a specific point in the program</div>
                    <div className="text-sm text-muted-foreground">
                      Trigger on Week X, Day Y relative to member's start
                    </div>
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="event" id="event" />
                <Label htmlFor="event" className="flex-1 cursor-pointer">
                  <div className="font-medium">When something happens</div>
                  <div className="text-sm text-muted-foreground">
                    Trigger on events like workout completed, meal logged, etc.
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule" className="flex-1 cursor-pointer">
                  <div className="font-medium">On a schedule</div>
                  <div className="text-sm text-muted-foreground">
                    Trigger daily, weekly, or monthly
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          {triggerType === 'program' && isProgramCohort && (
            <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
              <div className="space-y-2">
                <Label>Week</Label>
                <Select value={week.toString()} onValueChange={(v) => setWeek(parseInt(v))}>
                  <SelectTrigger data-testid="select-week">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: group.program?.durationWeeks || 12 }).map((_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString()}>
                        Week {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Day</Label>
                <Select value={day.toString()} onValueChange={(v) => setDay(parseInt(v))}>
                  <SelectTrigger data-testid="select-day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6, 7].map(d => (
                      <SelectItem key={d} value={d.toString()}>
                        Day {d}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          {triggerType === 'event' && (
            <div className="space-y-2">
              <Label>Event Type</Label>
              <Select value={eventType} onValueChange={setEventType}>
                <SelectTrigger data-testid="select-event-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="workout_completed">Workout Completed</SelectItem>
                  <SelectItem value="workout_missed">Workout Missed</SelectItem>
                  <SelectItem value="meal_logged">Meal Logged</SelectItem>
                  <SelectItem value="checkin_completed">Check-in Completed</SelectItem>
                  <SelectItem value="streak_milestone">Streak Milestone</SelectItem>
                  <SelectItem value="module_completed">Module Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label>What should Pat do?</Label>
            <Select value={directiveType} onValueChange={(v) => setDirectiveType(v as DirectiveAction['actionType'])}>
              <SelectTrigger data-testid="select-directive-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="encourage">Send Encouragement</SelectItem>
                <SelectItem value="remind">Send Reminder</SelectItem>
                <SelectItem value="analyze">Analyze and Summarize</SelectItem>
                <SelectItem value="ask">Ask Check-in Questions</SelectItem>
                <SelectItem value="alert">Alert Mentor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={setTone}>
              <SelectTrigger data-testid="select-tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="encouraging">Encouraging</SelectItem>
                <SelectItem value="celebratory">Celebratory</SelectItem>
                <SelectItem value="neutral">Neutral</SelectItem>
                <SelectItem value="direct">Direct</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} data-testid="button-cancel">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!name} data-testid="button-create-directive">
            Create Directive
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
