import { WeeklySession } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface InPersonSessionsProps {
  sessions: WeeklySession[];
  onViewClient: (clientId: string) => void;
  onExpandSession: (sessionId: string) => void;
}

export function InPersonSessions({ sessions, onViewClient, onExpandSession }: InPersonSessionsProps) {
  if (sessions.length === 0) return null;
  
  const venue = sessions[0]?.venue || 'In-Person';
  
  const getStatusConfig = (status: string) => {
    const config = {
      thriving: { 
        icon: 'local_fire_department', 
        label: 'Thriving', 
        className: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
      },
      steady: { 
        icon: 'thumb_up', 
        label: 'Steady', 
        className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' 
      },
      struggling: { 
        icon: 'warning', 
        label: 'Struggling', 
        className: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' 
      },
    };
    return config[status as keyof typeof config] || config.steady;
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <section data-testid="in-person-sessions-section">
      <div className="flex items-center justify-between mb-4 gap-2">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-500">fitness_center</span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Today's In-Person Sessions
          </h2>
          <Badge variant="secondary">{sessions.length} sessions</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-lg">location_on</span>
          <span>{venue}</span>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 divide-y divide-slate-100 dark:divide-slate-800">
          {sessions.map((session) => {
            const statusConfig = getStatusConfig(session.clientStatus);
            
            return (
              <div 
                key={session.id} 
                className="flex items-center gap-4 p-4 hover-elevate cursor-pointer"
                onClick={() => onExpandSession(session.id)}
                data-testid={`session-row-${session.id}`}
              >
                <div className="w-20 text-sm font-medium text-slate-600 dark:text-slate-300">
                  {session.time}
                </div>
                
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                    {getInitials(session.client.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 dark:text-white truncate">
                      {session.client.name}
                    </span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig.className}`}>
                      <span className="material-symbols-outlined text-sm">{statusConfig.icon}</span>
                      {statusConfig.label}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                    {session.sessionType}
                  </p>
                </div>
                
                {session.needsPrep && (
                  <Badge 
                    variant="outline" 
                    className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700 shrink-0"
                    data-testid={`badge-prep-${session.id}`}
                  >
                    <span className="material-symbols-outlined text-sm mr-1">edit_note</span>
                    Prep needed
                  </Badge>
                )}
                
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewClient(session.client.id);
                  }}
                  data-testid={`button-view-client-${session.id}`}
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </Button>
              </div>
            );
          })}
        </CardContent>
      </Card>
      
      {sessions.some(s => s.needsPrep) && (
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-500 text-lg">info</span>
          Click on a session with "Prep needed" to see details and suggestions.
        </p>
      )}
    </section>
  );
}
