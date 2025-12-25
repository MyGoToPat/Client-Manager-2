import { ProgramHealthSummary } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface ProgramHealthProps {
  programs: ProgramHealthSummary[];
  onViewProgram: (programId: string) => void;
  onViewFlagged: (programId: string) => void;
}

export function ProgramHealth({ programs, onViewProgram, onViewFlagged }: ProgramHealthProps) {
  if (programs.length === 0) return null;
  
  const totalMembers = programs.reduce((sum, p) => sum + p.memberCount, 0);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cohort': return 'calendar_month';
      case 'challenge': return 'emoji_events';
      case 'course': return 'menu_book';
      default: return 'school';
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'bg-emerald-500';
      case 'needs_attention': return 'bg-amber-500';
      case 'at_risk': return 'bg-red-500';
      default: return 'bg-slate-400';
    }
  };
  
  const getUrgencyDot = (urgency: string) => {
    switch (urgency) {
      case 'urgent': return 'bg-red-500';
      case 'attention': return 'bg-amber-500';
      case 'monitor': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <section data-testid="program-health-section">
      <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-emerald-500">school</span>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
            Your Programs
          </h2>
          <Badge variant="secondary">{totalMembers} members</Badge>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <span className="material-symbols-outlined text-indigo-500 text-lg">smart_toy</span>
          <span>Pat's handling these - Only flags shown</span>
        </div>
      </div>

      <div className="space-y-3">
        {programs.map((program) => (
          <Card 
            key={program.id} 
            className={`overflow-visible transition-all hover-elevate cursor-pointer ${
              program.status === 'at_risk' ? 'border-red-300 dark:border-red-800' :
              program.status === 'needs_attention' ? 'border-amber-300 dark:border-amber-800' : ''
            }`}
            onClick={() => onViewProgram(program.id)}
            data-testid={`program-card-${program.id}`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="material-symbols-outlined text-slate-400">
                      {getTypeIcon(program.type)}
                    </span>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {program.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      Week {program.currentWeek}/{program.totalWeeks}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400 flex-wrap">
                    <span>{program.memberCount} members</span>
                    <span className="hidden sm:inline">-</span>
                    <span className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(program.status)}`}></div>
                      {program.onTrackPercent}% on track
                    </span>
                  </div>
                  
                  <div className="mt-2">
                    <Progress value={program.onTrackPercent} className="h-1.5" />
                  </div>
                </div>
                
                <div className="text-right shrink-0">
                  {program.flaggedCount > 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-amber-600 border-amber-300 dark:text-amber-400 dark:border-amber-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewFlagged(program.id);
                      }}
                      data-testid={`button-view-flagged-${program.id}`}
                    >
                      <span className="material-symbols-outlined text-base mr-1">flag</span>
                      {program.flaggedCount} flagged
                    </Button>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-sm text-emerald-600 dark:text-emerald-400">
                      <span className="material-symbols-outlined text-base">check_circle</span>
                      All good
                    </span>
                  )}
                </div>
              </div>
              
              {program.flaggedCount > 0 && program.flaggedMembers.length > 0 && (
                <div className="mt-3 p-2 rounded-md bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="space-y-1">
                    {program.flaggedMembers.slice(0, 2).map((flagged, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span className={`w-1.5 h-1.5 rounded-full ${getUrgencyDot(flagged.urgency)}`}></span>
                        <span className="font-medium text-slate-700 dark:text-slate-300">
                          {flagged.client.name}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400">
                          - {flagged.reason}
                        </span>
                      </div>
                    ))}
                    {program.flaggedMembers.length > 2 && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 pl-3">
                        + {program.flaggedMembers.length - 2} more
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {program.recentWins.length > 0 && program.flaggedCount === 0 && (
                <div className="mt-3 flex items-center gap-2 text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="material-symbols-outlined text-lg">celebration</span>
                  <span>{program.recentWins[0].description}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
