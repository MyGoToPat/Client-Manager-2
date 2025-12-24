import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import type { MentorDirective } from '../../types';
import { cn } from '@/lib/utils';

interface ClientDirectivesTabProps {
  directives: MentorDirective[];
  onToggle: (directiveId: string) => void;
}

const categoryColors: Record<MentorDirective['category'], string> = {
  nutrition: 'bg-chart-2/10 text-chart-2 border-chart-2/20',
  workout: 'bg-chart-1/10 text-chart-1 border-chart-1/20',
  recovery: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  motivation: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  general: 'bg-muted text-muted-foreground border-muted',
};

const priorityColors: Record<MentorDirective['priority'], string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

export function ClientDirectivesTab({ directives, onToggle }: ClientDirectivesTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Mentor Directives</h3>
        <Button size="sm" data-testid="button-new-directive">
          <span className="material-symbols-outlined text-base mr-1">add</span>
          New Directive
        </Button>
      </div>

      <div className="space-y-3">
        {directives.map((directive) => (
          <Card key={directive.id} className={cn(!directive.isActive && 'opacity-60')}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-primary/10 flex-shrink-0">
                    <span className="material-symbols-outlined text-xl text-primary">bolt</span>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-foreground">{directive.name}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={cn('text-xs capitalize', categoryColors[directive.category])}>
                            {directive.category}
                          </Badge>
                          <Badge variant="outline" className={cn('text-xs capitalize', priorityColors[directive.priority])}>
                            {directive.priority}
                          </Badge>
                        </div>
                      </div>
                      <Switch
                        checked={directive.isActive}
                        onCheckedChange={() => onToggle(directive.id)}
                        data-testid={`switch-directive-${directive.id}`}
                      />
                    </div>

                    <p className="text-sm text-muted-foreground italic">
                      "{directive.messageTemplate}"
                    </p>

                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="material-symbols-outlined text-sm">bar_chart</span>
                        Triggered {directive.triggeredCount}x
                      </div>
                      {directive.effectivenessScore && (
                        <div className="flex items-center gap-2">
                          <Progress value={directive.effectivenessScore * 100} className="w-16 h-1.5" />
                          <span className="text-xs font-mono text-muted-foreground">
                            {Math.round(directive.effectivenessScore * 100)}% effective
                          </span>
                        </div>
                      )}
                      {directive.lastTriggered && (
                        <span className="text-xs text-muted-foreground">
                          Last: {formatDistanceToNow(new Date(directive.lastTriggered), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {directives.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mx-auto mb-3 opacity-50 block">bolt</span>
            <p>No directives for this client yet</p>
            <p className="text-sm">Create a directive to automate personalized messages</p>
          </div>
        )}
      </div>
    </div>
  );
}
