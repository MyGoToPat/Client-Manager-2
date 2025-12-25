import { DashboardActivitySummary } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'wouter';

interface ActivitySummaryProps {
  summary: DashboardActivitySummary;
}

export function ActivitySummary({ summary }: ActivitySummaryProps) {
  const workoutPercent = summary.workouts.completed / (summary.workouts.completed + summary.workouts.remaining) * 100;
  const nutritionPercent = summary.nutrition.logged / summary.nutrition.expected * 100;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-slate-400">monitoring</span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Today's Activity
          </h2>
        </div>
        <Link href="/clients">
          <Button variant="ghost" size="sm" data-testid="button-view-all-activity">
            View All Activity
            <span className="material-symbols-outlined text-base ml-1">arrow_forward</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-blue-500">fitness_center</span>
              <span className="font-medium text-slate-900 dark:text-white">Workouts</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {summary.workouts.completed} completed
                </span>
                <span className="text-slate-500 dark:text-slate-500">
                  {summary.workouts.remaining} remaining
                </span>
              </div>
              <Progress value={workoutPercent} className="h-2" />
              {summary.workouts.skipped > 0 && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {summary.workouts.skipped} skipped today
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-emerald-500">restaurant</span>
              <span className="font-medium text-slate-900 dark:text-white">Nutrition</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">
                  {summary.nutrition.logged} logged meals
                </span>
                <span className="text-slate-500 dark:text-slate-500">
                  {summary.nutrition.onTarget} on target
                </span>
              </div>
              <Progress value={nutritionPercent} className="h-2" />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {summary.nutrition.expected - summary.nutrition.logged} clients haven't logged yet
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {summary.recentActivity.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Recent:</p>
            <div className="space-y-2">
              {summary.recentActivity.slice(0, 4).map((activity, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {activity.clientName}
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">
                    {activity.action}
                  </span>
                  <span className="text-slate-400 dark:text-slate-500 text-xs ml-auto">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </section>
  );
}
