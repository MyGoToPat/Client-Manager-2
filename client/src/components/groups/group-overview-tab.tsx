import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ClientGroup } from '../../types';

interface Props {
  group: ClientGroup;
}

export function GroupOverviewTab({ group }: Props) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">group</span>
              <span className="text-sm text-muted-foreground">Members</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="stat-members">{group.memberCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">target</span>
              <span className="text-sm text-muted-foreground">Avg Compliance</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="stat-compliance">{group.avgCompliance}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">trending_up</span>
              <span className="text-sm text-muted-foreground">Avg Progress</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="stat-progress">{group.avgProgress}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">bolt</span>
              <span className="text-sm text-muted-foreground">Active Directives</span>
            </div>
            <p className="text-2xl font-bold mt-1" data-testid="stat-directives">{group.directives?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-2 flex-wrap">
          <Button variant="outline" data-testid="button-post-announcement">
            <span className="material-symbols-outlined text-base mr-2">chat</span>
            Post Announcement
          </Button>
          <Button variant="outline" data-testid="button-create-directive">
            <span className="material-symbols-outlined text-base mr-2">bolt</span>
            Create Directive
          </Button>
          <Button variant="outline" data-testid="button-add-members">
            <span className="material-symbols-outlined text-base mr-2">add</span>
            Add Members
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <ActivityItem 
              text="Sarah Johnson completed Week 3 Day 1 workout"
              time="2h ago"
            />
            <ActivityItem 
              text="Michael Chen logged 3,200 calories"
              time="3h ago"
            />
            <ActivityItem 
              text="You posted 'Week 3 Focus: Progressive Overload'"
              time="1d ago"
            />
            <ActivityItem 
              text="David Thompson joined the group"
              time="2d ago"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex justify-between items-center text-sm gap-2">
      <span className="text-muted-foreground">- {text}</span>
      <span className="text-muted-foreground shrink-0">{time}</span>
    </div>
  );
}
