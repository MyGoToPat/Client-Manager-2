import { format } from 'date-fns';
import { Calendar, Target, Activity, Droplets, Flame } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DomainAssignmentCard } from '../domain-assignment';
import type { Client } from '../../types';

interface ClientOverviewTabProps {
  client: Client;
}

export function ClientOverviewTab({ client }: ClientOverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Calendar className="w-4 h-4" />
        <span>Joined {format(new Date(client.joinedAt), 'MMMM d, yyyy')}</span>
      </div>

      <DomainAssignmentCard clientId={client.id} />

      {client.goals && client.goals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <h3 className="font-medium">Goals</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {client.goals.map((goal, index) => (
              <Badge key={index} variant="secondary" className="px-3 py-1">
                {goal}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-medium">Overall Progress</h3>
        <div className="flex items-center gap-4">
          <Progress value={client.progress} className="h-3 flex-1" />
          <span className="text-lg font-mono font-bold">{client.progress}%</span>
        </div>
      </div>

      {client.metrics && (
        <div className="space-y-4">
          <h3 className="font-medium">Current Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-chart-1/10">
                    <Flame className="w-5 h-5 text-chart-1" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">TDEE</p>
                    <p className="text-xl font-mono font-bold">{client.metrics.tdee}</p>
                    <p className="text-xs text-muted-foreground">kcal/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-chart-2/10">
                    <Activity className="w-5 h-5 text-chart-2" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">BMR</p>
                    <p className="text-xl font-mono font-bold">{client.metrics.bmr}</p>
                    <p className="text-xs text-muted-foreground">kcal/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-chart-4/10">
                    <Droplets className="w-5 h-5 text-chart-4" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">Hydration</p>
                    <p className="text-xl font-mono font-bold">{client.metrics.hydrationGoal}</p>
                    <p className="text-xs text-muted-foreground">ml/day</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {client.metrics.weight && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-md bg-chart-5/10">
                      <Activity className="w-5 h-5 text-chart-5" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">Weight</p>
                      <p className="text-xl font-mono font-bold">{client.metrics.weight}</p>
                      <p className="text-xs text-muted-foreground">lbs</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Macro Goals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-mono font-bold text-chart-1">{client.metrics.proteinGoal}g</p>
                  <p className="text-xs text-muted-foreground">Protein</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-mono font-bold text-chart-3">{client.metrics.carbsGoal}g</p>
                  <p className="text-xs text-muted-foreground">Carbs</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-mono font-bold text-chart-5">{client.metrics.fatGoal}g</p>
                  <p className="text-xs text-muted-foreground">Fat</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
