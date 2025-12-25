import { SessionBriefing } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface TodaysSessionsProps {
  sessions: SessionBriefing[];
  onViewClient: (clientId: string) => void;
  onAdjustPlan: (clientId: string, type: 'macros' | 'workout') => void;
  onMessageClient: (clientId: string) => void;
}

export function TodaysSessions({ sessions, onViewClient, onAdjustPlan, onMessageClient }: TodaysSessionsProps) {
  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'zoom': return 'videocam';
      case 'google_meet': return 'video_call';
      default: return 'location_on';
    }
  };

  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'zoom': return 'Zoom';
      case 'google_meet': return 'Google Meet';
      default: return 'In-Person';
    }
  };

  const getStatusBadge = (status: string, color: string) => {
    const colorClasses: Record<string, string> = {
      green: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
      yellow: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      red: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    };
    
    const icons: Record<string, string> = {
      thriving: 'local_fire_department',
      steady: 'thumb_up',
      struggling: 'warning',
    };
    
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${colorClasses[color] || colorClasses.green}`}>
        <span className="material-symbols-outlined text-sm">{icons[status] || 'check'}</span>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-slate-400">calendar_today</span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Your Sessions Today
        </h2>
        <Badge variant="secondary" className="ml-2">{sessions.length}</Badge>
      </div>

      <div className="space-y-4">
        {sessions.map((session) => (
          <Card 
            key={session.id} 
            className="overflow-hidden border-l-4"
            style={{
              borderLeftColor: session.statusColor === 'green' ? '#10b981' : session.statusColor === 'yellow' ? '#f59e0b' : '#ef4444'
            }}
            data-testid={`card-session-${session.id}`}
          >
            <CardContent className="p-4 md:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {session.client.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {session.time}
                      </span>
                      <span className="text-slate-400">-</span>
                      <span className="font-medium text-slate-900 dark:text-white">
                        {session.client.name}
                      </span>
                      {getStatusBadge(session.clientStatus, session.statusColor)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                      <span>{session.sessionType}</span>
                      <span className="text-slate-300 dark:text-slate-600">-</span>
                      <span className="inline-flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">{getLocationIcon(session.location)}</span>
                        {getLocationLabel(session.location)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {session.recentHighlights.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-lg">local_fire_department</span>
                    <div>
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300 mb-1">On fire this week:</p>
                      <ul className="text-sm text-emerald-700 dark:text-emerald-400 space-y-0.5">
                        {session.recentHighlights.map((highlight, i) => (
                          <li key={i}>- {highlight}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {session.concerns && session.concerns.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-lg">warning</span>
                    <div>
                      <p className="text-sm font-medium text-amber-800 dark:text-amber-300 mb-1">Heads up:</p>
                      <ul className="text-sm text-amber-700 dark:text-amber-400 space-y-0.5">
                        {session.concerns.map((concern, i) => (
                          <li key={i}>- {concern}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {session.patSuggestions.length > 0 && (
                <div className="mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">lightbulb</span>
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">Pat's suggestions:</p>
                      <ul className="text-sm text-indigo-700 dark:text-indigo-400 space-y-0.5">
                        {session.patSuggestions.map((suggestion, i) => (
                          <li key={i}>- {suggestion}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {session.todaysWorkout && (
                <div className="mb-4 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Today's Workout: {session.todaysWorkout.name}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-sm text-slate-600 dark:text-slate-400">
                    {session.todaysWorkout.exercises.slice(0, 4).map((ex, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-slate-400">-</span>
                        <span>{ex.name}</span>
                        <span className="text-slate-400">
                          {ex.sets}x{ex.reps}
                          {ex.weight && ` @ ${ex.weight}`}
                        </span>
                      </div>
                    ))}
                    {session.todaysWorkout.exercises.length > 4 && (
                      <div className="text-slate-400 text-xs">
                        + {session.todaysWorkout.exercises.length - 4} more exercises
                      </div>
                    )}
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => onViewClient(session.client.id)}
                  data-testid={`button-view-client-${session.id}`}
                >
                  <span className="material-symbols-outlined text-base mr-1">person</span>
                  Open Profile
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onAdjustPlan(session.client.id, 'workout')}
                  data-testid={`button-adjust-${session.id}`}
                >
                  <span className="material-symbols-outlined text-base mr-1">edit_note</span>
                  Adjust Workout
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onMessageClient(session.client.id)}
                  data-testid={`button-message-${session.id}`}
                >
                  <span className="material-symbols-outlined text-base mr-1">chat</span>
                  Message
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
