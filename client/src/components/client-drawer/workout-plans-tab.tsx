import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { WorkoutPlan } from '../../types';
import { cn } from '@/lib/utils';

interface ClientWorkoutPlansTabProps {
  workoutPlans: WorkoutPlan[];
}

const difficultyColors: Record<WorkoutPlan['difficulty'], string> = {
  beginner: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  intermediate: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  advanced: 'bg-destructive/10 text-destructive border-destructive/20',
};

const statusColors: Record<WorkoutPlan['status'], string> = {
  active: 'bg-chart-4/10 text-chart-4 border-chart-4/20',
  paused: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  completed: 'bg-muted text-muted-foreground border-muted',
};

export function ClientWorkoutPlansTab({ workoutPlans }: ClientWorkoutPlansTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Workout Plans</h3>
        <Badge variant="outline" className="font-mono">
          {workoutPlans.filter(p => p.status === 'active').length} active
        </Badge>
      </div>

      <div className="space-y-3">
        {workoutPlans.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-chart-1/10 flex-shrink-0">
                    <span className="material-symbols-outlined text-xl text-chart-1">fitness_center</span>
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-foreground">{plan.name}</h4>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <Badge variant="outline" className={cn('text-xs capitalize', difficultyColors[plan.difficulty])}>
                            {plan.difficulty}
                          </Badge>
                          <Badge variant="outline" className={cn('text-xs capitalize', statusColors[plan.status])}>
                            {plan.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {plan.durationWeeks} weeks
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Progress value={plan.completionPercent} className="h-2 flex-1" />
                      <span className="text-sm font-mono text-muted-foreground">
                        {plan.completionPercent}%
                      </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      {plan.assignedDays.map((day) => (
                        <Badge key={day} variant="secondary" className="text-xs">
                          {day}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      {plan.status === 'active' ? (
                        <Button size="sm" variant="outline" data-testid={`button-pause-${plan.id}`}>
                          <span className="material-symbols-outlined text-sm mr-1">pause</span>
                          Pause
                        </Button>
                      ) : plan.status === 'paused' ? (
                        <Button size="sm" variant="outline" data-testid={`button-resume-${plan.id}`}>
                          <span className="material-symbols-outlined text-sm mr-1">play_arrow</span>
                          Resume
                        </Button>
                      ) : null}
                      <Button size="sm" variant="ghost" data-testid={`button-view-${plan.id}`}>
                        <span className="material-symbols-outlined text-sm mr-1">visibility</span>
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {workoutPlans.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <span className="material-symbols-outlined text-4xl mx-auto mb-3 opacity-50 block">fitness_center</span>
            <p>No workout plans assigned</p>
            <p className="text-sm">Create a workout plan for this client</p>
          </div>
        )}
      </div>
    </div>
  );
}
