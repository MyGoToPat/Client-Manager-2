import { AttentionItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface NeedsAttentionProps {
  items: AttentionItem[];
  onViewClient: (clientId: string) => void;
  onMessageClient: (clientId: string) => void;
  onAdjustPlan: (clientId: string, type: 'macros' | 'workout') => void;
}

export function NeedsAttention({ items, onViewClient, onMessageClient, onAdjustPlan }: NeedsAttentionProps) {
  const getUrgencyStyles = (urgency: string) => {
    const styles: Record<string, { border: string; bg: string; icon: string; label: string; labelClass: string }> = {
      urgent: {
        border: 'border-l-red-500',
        bg: 'bg-red-50 dark:bg-red-900/10',
        icon: 'error',
        label: 'Urgent',
        labelClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      },
      attention: {
        border: 'border-l-amber-500',
        bg: 'bg-amber-50 dark:bg-amber-900/10',
        icon: 'warning',
        label: 'Attention',
        labelClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
      },
      monitor: {
        border: 'border-l-blue-500',
        bg: 'bg-blue-50 dark:bg-blue-900/10',
        icon: 'visibility',
        label: 'Monitor',
        labelClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      },
    };
    return styles[urgency] || styles.monitor;
  };

  const handleAction = (item: AttentionItem, action: string) => {
    switch (action) {
      case 'message':
        onMessageClient(item.client.id);
        break;
      case 'view':
        onViewClient(item.client.id);
        break;
      case 'adjust_macros':
        onAdjustPlan(item.client.id, 'macros');
        break;
      case 'adjust_workout':
        onAdjustPlan(item.client.id, 'workout');
        break;
      default:
        onViewClient(item.client.id);
    }
  };

  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-slate-400">priority_high</span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Needs Your Attention
        </h2>
        <Badge variant="secondary" className="ml-2">{items.length}</Badge>
      </div>

      <div className="space-y-4">
        {items.map((item) => {
          const styles = getUrgencyStyles(item.urgency);
          
          return (
            <Card 
              key={item.id} 
              className={`overflow-hidden border-l-4 ${styles.border}`}
              data-testid={`card-attention-${item.id}`}
            >
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
                        {item.client.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-900 dark:text-white">
                          {item.client.name}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles.labelClass}`}>
                          <span className="material-symbols-outlined text-sm">{styles.icon}</span>
                          {styles.label}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mt-0.5">
                        {item.headline}
                      </p>
                    </div>
                  </div>
                  
                  {item.daysInactive && (
                    <span className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {item.daysInactive} days inactive
                    </span>
                  )}
                </div>

                <div className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                  {item.observation}
                </div>

                {item.clientSaid && (
                  <div className="mb-3 p-3 rounded-lg bg-slate-100 dark:bg-slate-800 border-l-2 border-slate-400">
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">What they told Pat:</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 italic">
                      "{item.clientSaid}"
                    </p>
                  </div>
                )}

                {item.pattern && (
                  <div className="mb-3 p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-start gap-2">
                      <span className="material-symbols-outlined text-slate-400 text-sm mt-0.5">analytics</span>
                      <div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-0.5">Pattern I noticed:</p>
                        <p className="text-sm text-slate-600 dark:text-slate-400">{item.pattern}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mb-4 p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <div className="flex items-start gap-2">
                    <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400">lightbulb</span>
                    <div>
                      <p className="text-sm font-medium text-indigo-800 dark:text-indigo-300 mb-1">My suggestion:</p>
                      <p className="text-sm text-indigo-700 dark:text-indigo-400">{item.patSuggestion}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {item.suggestedActions.map((action, i) => (
                    <Button
                      key={i}
                      variant={action.primary ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleAction(item, action.action)}
                      data-testid={`button-action-${item.id}-${i}`}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </section>
  );
}
