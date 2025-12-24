import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CreateGroupDirectiveModal } from './create-group-directive-modal';
import type { ClientGroup, TemplateDirective } from '../../types';

interface Props {
  group: ClientGroup;
  onUpdate?: () => void;
}

export function GroupDirectivesTab({ group, onUpdate }: Props) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const isProgramCohort = group.type === 'program_cohort';

  const programTimedDirectives = group.directives?.filter(d => 
    d.triggerType === 'program' || 
    d.programOffset !== undefined || 
    (d.week && !d.triggerType)
  ) || [];
  const eventBasedDirectives = group.directives?.filter(d => 
    d.triggerType === 'event' || 
    d.triggerType === 'schedule' || 
    (!d.programOffset && !d.week && !d.triggerType)
  ) || [];

  const handleSaveDirective = (directive: TemplateDirective) => {
    console.log('Save directive:', directive);
    setShowCreateModal(false);
    onUpdate?.();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-semibold">Group Directives</h2>
          <p className="text-sm text-muted-foreground">
            Automations that only apply to members of this group
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} data-testid="button-new-directive">
          <span className="material-symbols-outlined text-base mr-2">add</span>
          New Directive
        </Button>
      </div>

      {isProgramCohort && programTimedDirectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-base">calendar_month</span>
              Program-Timed Directives
            </CardTitle>
            <CardDescription>
              These trigger at specific points in the program, relative to each member's start date
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {programTimedDirectives
              .sort((a, b) => (a.week || 0) - (b.week || 0))
              .map(directive => (
                <DirectiveCard 
                  key={directive.id} 
                  directive={directive} 
                  isProgramTimed 
                  currentWeek={group.program?.currentWeek}
                />
              ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <span className="material-symbols-outlined text-base">bolt</span>
            Event-Based Directives
          </CardTitle>
          <CardDescription>
            These trigger when specific events happen
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {eventBasedDirectives.length > 0 ? (
            eventBasedDirectives.map(directive => (
              <DirectiveCard key={directive.id} directive={directive} />
            ))
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              No event-based directives yet. Create one to automate Pat's responses.
            </p>
          )}
        </CardContent>
      </Card>

      {isProgramCohort && (
        <Card className="bg-muted/50">
          <CardContent className="pt-4">
            <div className="flex gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground mt-0.5 shrink-0">schedule</span>
              <div className="text-sm">
                <p className="font-medium">How program-timed directives work</p>
                <p className="text-muted-foreground">
                  If a directive is set for "Week 4, Day 1", each member receives it on THEIR Day 22 
                  of the program. If Sarah started Dec 1 and David started Dec 3, Sarah gets it Dec 22 
                  and David gets it Dec 24.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <CreateGroupDirectiveModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        group={group}
        onSave={handleSaveDirective}
      />
    </div>
  );
}

function DirectiveCard({ 
  directive, 
  isProgramTimed = false,
  currentWeek 
}: { 
  directive: TemplateDirective; 
  isProgramTimed?: boolean;
  currentWeek?: number;
}) {
  const [isActive, setIsActive] = useState(true);
  
  const isUpcoming = isProgramTimed && currentWeek && directive.week && directive.week > currentWeek;
  const isPast = isProgramTimed && currentWeek && directive.week && directive.week < currentWeek;
  const isCurrent = isProgramTimed && currentWeek && directive.week === currentWeek;

  return (
    <div 
      className={`flex items-center justify-between p-4 border rounded-lg gap-4 ${
        isPast ? 'opacity-50' : ''
      } ${isCurrent ? 'border-primary' : ''}`}
      data-testid={`directive-card-${directive.id}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
          isProgramTimed ? 'bg-blue-500/10 text-blue-500' : 'bg-yellow-500/10 text-yellow-500'
        }`}>
          {isProgramTimed ? (
            <span className="text-sm font-bold">W{directive.week}</span>
          ) : (
            <span className="material-symbols-outlined text-base">bolt</span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-medium truncate">{directive.name}</p>
          <p className="text-sm text-muted-foreground truncate">{directive.description}</p>
          {isProgramTimed && directive.day && (
            <p className="text-xs text-muted-foreground">
              Week {directive.week}, Day {directive.day}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        {isCurrent && <Badge variant="default">This Week</Badge>}
        {isPast && <Badge variant="secondary">Completed</Badge>}
        {isUpcoming && <Badge variant="outline">Upcoming</Badge>}
        <Switch 
          checked={isActive} 
          onCheckedChange={setIsActive}
          data-testid={`switch-directive-${directive.id}`}
        />
      </div>
    </div>
  );
}
