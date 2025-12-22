import { Calendar, Clock, MapPin, Video, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import type { Booking } from '../../types';

interface TodaysSessionsSectionProps {
  sessions: Booking[];
  onViewSession?: (sessionId: string) => void;
  onJoinCall?: (sessionId: string) => void;
}

export function TodaysSessionsSection({ 
  sessions, 
  onViewSession,
  onJoinCall 
}: TodaysSessionsSectionProps) {
  if (sessions.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Calendar className="w-4 h-4" />
            Today's Sessions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No sessions scheduled for today.
          </p>
        </CardContent>
      </Card>
    );
  }

  const now = new Date();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calendar className="w-4 h-4" />
          Today's Sessions
          <Badge variant="secondary" className="ml-auto">{sessions.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sessions.map((session) => {
            const sessionTime = new Date(session.scheduledAt);
            const isPast = sessionTime < now;
            const isUpcoming = !isPast && sessionTime.getTime() - now.getTime() < 60 * 60 * 1000;

            return (
              <div 
                key={session.id}
                className="flex items-center gap-4 p-3 rounded-md bg-muted/50"
                data-testid={`session-${session.id}`}
              >
                <Avatar>
                  <AvatarFallback>
                    {session.clientName?.split(' ').map(n => n[0]).join('') || '??'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium truncate">{session.clientName}</p>
                    {isUpcoming && (
                      <Badge variant="default" className="text-xs">Starting Soon</Badge>
                    )}
                    {isPast && session.status === 'scheduled' && (
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(sessionTime, 'h:mm a')}
                    </span>
                    <span className="flex items-center gap-1">
                      {session.calendarEventId ? (
                        <>
                          <Video className="w-3 h-3" />
                          Zoom
                        </>
                      ) : (
                        <>
                          <MapPin className="w-3 h-3" />
                          In-Person
                        </>
                      )}
                    </span>
                  </div>
                  {session.notes && (
                    <p className="text-xs text-muted-foreground mt-1 truncate">{session.notes}</p>
                  )}
                </div>

                <div className="flex gap-2">
                  {session.calendarEventId && isUpcoming && (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => onJoinCall?.(session.id)}
                      data-testid={`button-join-${session.id}`}
                    >
                      <ExternalLink className="w-4 h-4 mr-1" />
                      Join
                    </Button>
                  )}
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onViewSession?.(session.id)}
                    data-testid={`button-view-session-${session.id}`}
                  >
                    Details
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
