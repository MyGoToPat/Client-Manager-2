import { WeeklySession } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface OnlineSessionsWeekProps {
  sessions: WeeklySession[];
  onViewClient: (clientId: string) => void;
  onExpandSession: (sessionId: string) => void;
}

export function OnlineSessionsWeek({ sessions, onViewClient, onExpandSession }: OnlineSessionsWeekProps) {
  if (sessions.length === 0) return null;
  
  const sessionsByDay = sessions.reduce((acc, session) => {
    if (!acc[session.dayLabel]) {
      acc[session.dayLabel] = [];
    }
    acc[session.dayLabel].push(session);
    return acc;
  }, {} as Record<string, WeeklySession[]>);
  
  const dayOrder = ['Today', 'Tomorrow'];
  const sortedDays = Object.keys(sessionsByDay).sort((a, b) => {
    const aIndex = dayOrder.indexOf(a);
    const bIndex = dayOrder.indexOf(b);
    if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
    if (aIndex !== -1) return -1;
    if (bIndex !== -1) return 1;
    return 0;
  });
  
  const getStatusConfig = (status: string) => {
    const config = {
      thriving: { 
        icon: 'local_fire_department', 
        className: 'text-emerald-500' 
      },
      steady: { 
        icon: 'thumb_up', 
        className: 'text-blue-500' 
      },
      struggling: { 
        icon: 'warning', 
        className: 'text-amber-500' 
      },
    };
    return config[status as keyof typeof config] || config.steady;
  };
  
  const getLocationIcon = (location: string) => {
    switch (location) {
      case 'zoom': return 'videocam';
      case 'google_meet': return 'video_call';
      default: return 'videocam';
    }
  };
  
  const getLocationLabel = (location: string) => {
    switch (location) {
      case 'zoom': return 'Zoom';
      case 'google_meet': return 'Meet';
      default: return 'Video';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const visibleDays = sortedDays.slice(0, 3);
  const remainingCount = sortedDays.length > 3 
    ? sortedDays.slice(3).reduce((sum, day) => sum + sessionsByDay[day].length, 0)
    : 0;

  return (
    <section data-testid="online-sessions-section">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-purple-500">videocam</span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            This Week's Online Check-ins
          </h2>
          <Badge variant="secondary">{sessions.length} sessions</Badge>
        </div>
      </div>

      <div className="space-y-4">
        {visibleDays.map((day) => (
          <div key={day}>
            <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">
              {day}
            </h3>
            <Card>
              <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
                {sessionsByDay[day].map((session) => {
                  const statusConfig = getStatusConfig(session.clientStatus);
                  
                  return (
                    <div 
                      key={session.id} 
                      className="flex items-center gap-4 p-3 hover-elevate cursor-pointer"
                      onClick={() => onExpandSession(session.id)}
                      data-testid={`online-session-row-${session.id}`}
                    >
                      <div className="w-16 text-sm text-slate-600 dark:text-slate-300">
                        {session.time}
                      </div>
                      
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-xs">
                          {getInitials(session.client.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0 flex items-center gap-2">
                        <span className="font-medium text-slate-900 dark:text-white truncate">
                          {session.client.name}
                        </span>
                        <span className={`material-symbols-outlined text-lg ${statusConfig.className}`}>
                          {statusConfig.icon}
                        </span>
                      </div>
                      
                      <span className="text-sm text-slate-500 dark:text-slate-400 hidden sm:block">
                        {session.sessionType}
                      </span>
                      
                      <div className="flex items-center gap-1 text-sm text-slate-400">
                        <span className="material-symbols-outlined text-base">{getLocationIcon(session.location)}</span>
                        <span className="hidden sm:inline">{getLocationLabel(session.location)}</span>
                      </div>
                      
                      {session.needsPrep && (
                        <Badge 
                          variant="outline" 
                          className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700 text-xs"
                          data-testid={`badge-prep-${session.id}`}
                        >
                          Prep
                        </Badge>
                      )}
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewClient(session.client.id);
                        }}
                        data-testid={`button-view-online-client-${session.id}`}
                      >
                        <span className="material-symbols-outlined text-xl">chevron_right</span>
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>
        ))}
        
        {remainingCount > 0 && (
          <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
            + {remainingCount} more this week
          </p>
        )}
      </div>
    </section>
  );
}
