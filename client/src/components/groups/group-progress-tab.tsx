import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { ClientGroup } from '../../types';

interface Props {
  group: ClientGroup;
}

export function GroupProgressTab({ group }: Props) {
  const isProgramCohort = group.type === 'program_cohort';

  return (
    <div className="space-y-6">
      {isProgramCohort && group.program && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Program Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 flex-wrap">
              {Array.from({ length: group.program.durationWeeks }).map((_, i) => {
                const weekNum = i + 1;
                const isPast = weekNum < group.program!.currentWeek;
                const isCurrent = weekNum === group.program!.currentWeek;
                return (
                  <div
                    key={i}
                    className={`flex-1 min-w-[2rem] h-2 rounded ${
                      isPast ? 'bg-primary' : 
                      isCurrent ? 'bg-primary/50' : 
                      'bg-muted'
                    }`}
                    title={`Week ${weekNum}`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Week 1</span>
              <span>Week {group.program.currentWeek} (Current)</span>
              <span>Week {group.program.durationWeeks}</span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Compliance Distribution</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>90-100%</span>
                <span>4 members</span>
              </div>
              <Progress value={40} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>70-89%</span>
                <span>8 members</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>50-69%</span>
                <span>5 members</span>
              </div>
              <Progress value={50} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Below 50%</span>
                <span>3 members</span>
              </div>
              <Progress value={30} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span>1. Sarah Johnson</span>
                <span className="font-medium">98%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>2. Lisa Park</span>
                <span className="font-medium">95%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>3. Michael Chen</span>
                <span className="font-medium">92%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
