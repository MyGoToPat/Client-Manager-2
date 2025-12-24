import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { ClientActivity } from '../../types';

interface ActivityFeedSectionProps {
  activities: ClientActivity[];
  onViewClient?: (clientId: string) => void;
}

const activityIcons: Record<string, string> = {
  workout_completed: 'fitness_center',
  meal_logged: 'restaurant',
  message_sent: 'chat',
  streak_milestone: 'local_fire_department',
  check_in: 'fact_check',
  joined_group: 'group',
};

const activityColors: Record<string, string> = {
  workout_completed: 'text-chart-1 bg-chart-1/10',
  meal_logged: 'text-chart-2 bg-chart-2/10',
  message_sent: 'text-chart-4 bg-chart-4/10',
  streak_milestone: 'text-chart-3 bg-chart-3/10',
  check_in: 'text-chart-5 bg-chart-5/10',
  joined_group: 'text-primary bg-primary/10',
};

export function ActivityFeedSection({ activities, onViewClient }: ActivityFeedSectionProps) {
  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="material-symbols-outlined text-lg">trending_up</span>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No recent activity to display.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="material-symbols-outlined text-lg">trending_up</span>
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => {
            const iconName = activityIcons[activity.type] || 'info';
            const colorClass = activityColors[activity.type] || 'text-muted-foreground bg-muted';

            return (
              <div 
                key={activity.id}
                className="flex items-start gap-3 cursor-pointer hover-elevate p-2 rounded-md -mx-2"
                onClick={() => onViewClient?.(activity.clientId)}
                data-testid={`activity-${activity.id}`}
              >
                <div className={`p-2 rounded-full ${colorClass}`}>
                  <span className="material-symbols-outlined text-base">{iconName}</span>
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className="text-sm">
                    <span className="font-medium">{activity.clientName}</span>
                    {' '}
                    <span className="text-muted-foreground">{activity.description}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
