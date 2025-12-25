import { format } from 'date-fns';
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
        <span className="material-symbols-outlined text-base">calendar_month</span>
        <span>Joined {format(new Date(client.joinedAt), 'MMMM d, yyyy')}</span>
      </div>

      {/* Engagement & Sessions Section */}
      <div className="space-y-4 p-4 rounded-lg bg-muted/50">
        <div className="flex items-center justify-between">
          <h3 className="font-medium flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-muted-foreground">calendar_today</span>
            Engagement
          </h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge 
            variant={client.engagementType === 'in_person' ? 'default' : 'outline'}
            className="gap-1"
          >
            <span className="material-symbols-outlined text-sm">fitness_center</span>
            In-Person
          </Badge>
          <Badge 
            variant={client.engagementType === 'online_1on1' ? 'default' : 'outline'}
            className="gap-1"
          >
            <span className="material-symbols-outlined text-sm">videocam</span>
            Online
          </Badge>
          <Badge 
            variant={client.engagementType === 'program_only' ? 'default' : 'outline'}
            className="gap-1"
          >
            <span className="material-symbols-outlined text-sm">school</span>
            Program
          </Badge>
        </div>
        
        {client.engagementType === 'in_person' && client.primaryVenue && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-base">location_on</span>
            {client.primaryVenue}
          </div>
        )}
        
        {client.engagementType === 'online_1on1' && client.preferredPlatform && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-base">videocam</span>
            {client.preferredPlatform === 'zoom' ? 'Zoom' : 
             client.preferredPlatform === 'google_meet' ? 'Google Meet' : 'Phone'}
          </div>
        )}
        
        {client.nextSession && (
          <Card className="mt-3">
            <CardContent className="p-3">
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-center justify-center w-12 h-12 rounded-lg bg-primary/10">
                  <span className="text-xs font-bold text-primary uppercase">
                    {new Date(client.nextSession.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-bold text-primary">
                    {new Date(client.nextSession.date).getDate()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{client.nextSession.type}</p>
                  <p className="text-sm text-muted-foreground">
                    {client.nextSession.time} {client.nextSession.venue ? `at ${client.nextSession.venue}` : 
                      (client.nextSession.location === 'zoom' ? 'via Zoom' : 
                       client.nextSession.location === 'google_meet' ? 'via Google Meet' : 'via Phone')}
                  </p>
                </div>
              </div>
              
              {client.sessionPrepNotes && client.sessionPrepNotes.length > 0 && (
                <div className="mt-3 p-2 rounded-md bg-chart-3/10 border border-chart-3/20">
                  <p className="text-xs font-medium text-chart-3 flex items-center gap-1 mb-1">
                    <span className="material-symbols-outlined text-sm">lightbulb</span>
                    Pat's Prep Notes
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-0.5">
                    {client.sessionPrepNotes.slice(0, 2).map((note, i) => (
                      <li key={i} className="flex items-start gap-1">
                        <span className="text-muted-foreground/60">-</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {client.engagementType === 'program_only' && (
          <p className="text-sm text-muted-foreground italic">
            Program member - Pat handles day-to-day coaching
          </p>
        )}
        
        {client.engagementType !== 'program_only' && !client.nextSession && (
          <p className="text-sm text-muted-foreground italic">
            No upcoming session scheduled
          </p>
        )}
      </div>

      <DomainAssignmentCard clientId={client.id} />

      {client.goals && client.goals.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base text-muted-foreground">target</span>
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
                    <span className="material-symbols-outlined text-xl text-chart-1">local_fire_department</span>
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
                    <span className="material-symbols-outlined text-xl text-chart-2">trending_up</span>
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
                    <span className="material-symbols-outlined text-xl text-chart-4">water_drop</span>
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
                      <span className="material-symbols-outlined text-xl text-chart-5">trending_up</span>
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
