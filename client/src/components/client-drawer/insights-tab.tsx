import { formatDistanceToNow } from 'date-fns';
import { TrendingUp, AlertTriangle, Lightbulb, Trophy, Check, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { AIInsight } from '../../types';
import { cn } from '@/lib/utils';

interface ClientInsightsTabProps {
  insights: AIInsight[];
}

const typeConfig: Record<AIInsight['type'], { icon: React.ElementType; color: string; label: string }> = {
  pattern: { icon: TrendingUp, color: 'text-chart-1 bg-chart-1/10', label: 'Pattern' },
  alert: { icon: AlertTriangle, color: 'text-chart-3 bg-chart-3/10', label: 'Alert' },
  suggestion: { icon: Lightbulb, color: 'text-chart-5 bg-chart-5/10', label: 'Suggestion' },
  achievement: { icon: Trophy, color: 'text-chart-4 bg-chart-4/10', label: 'Achievement' },
};

const priorityColors: Record<AIInsight['priority'], string> = {
  high: 'bg-destructive/10 text-destructive border-destructive/20',
  medium: 'bg-chart-3/10 text-chart-3 border-chart-3/20',
  low: 'bg-muted text-muted-foreground border-muted',
};

export function ClientInsightsTab({ insights }: ClientInsightsTabProps) {
  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Pat's AI Insights</h3>
        <Badge variant="outline" className="font-mono">
          {insights.length} insights
        </Badge>
      </div>

      <div className="space-y-3">
        {sortedInsights.map((insight) => {
          const config = typeConfig[insight.type];
          const Icon = config.icon;
          
          return (
            <Card key={insight.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={cn('flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0', config.color)}>
                    <Icon className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-medium text-foreground">{insight.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className={cn('text-xs capitalize', priorityColors[insight.priority])}>
                            {insight.priority}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{insight.category}</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1">
                          <Progress value={insight.confidence} className="w-12 h-1.5" />
                          <span className="text-xs font-mono text-muted-foreground">{insight.confidence}%</span>
                        </div>
                        <span className="text-xs text-muted-foreground">confidence</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground">{insight.description}</p>

                    {insight.actionable && insight.suggestedAction && (
                      <div className="pt-2 border-t border-border mt-3">
                        <p className="text-xs text-muted-foreground mb-2">Suggested Action:</p>
                        <p className="text-sm text-foreground mb-3">{insight.suggestedAction}</p>
                        <div className="flex items-center gap-2">
                          <Button size="sm" data-testid={`button-implement-${insight.id}`}>
                            <Check className="w-3 h-3 mr-1" />
                            Implement
                          </Button>
                          <Button size="sm" variant="outline" data-testid={`button-later-${insight.id}`}>
                            <Clock className="w-3 h-3 mr-1" />
                            Later
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-1 text-xs text-muted-foreground pt-1">
                      <Clock className="w-3 h-3" />
                      {formatDistanceToNow(new Date(insight.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
