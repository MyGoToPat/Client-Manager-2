import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import type { NeedsAttentionClient } from '../../types';

interface NeedsAttentionSectionProps {
  clients: NeedsAttentionClient[];
  onMessageClient?: (clientId: string) => void;
  onViewClient?: (clientId: string) => void;
}

export function NeedsAttentionSection({ 
  clients, 
  onMessageClient, 
  onViewClient 
}: NeedsAttentionSectionProps) {
  if (clients.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <span className="material-symbols-outlined text-lg text-chart-3">warning</span>
            Needs Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            All clients are on track. Great job!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="material-symbols-outlined text-lg text-chart-3">warning</span>
          Needs Attention
          <Badge variant="secondary" className="ml-auto">{clients.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clients.map((item) => (
          <div 
            key={item.client.id}
            className="flex items-center gap-4 p-3 rounded-md bg-muted/50"
            data-testid={`attention-client-${item.client.id}`}
          >
            <Avatar>
              <AvatarFallback>
                {item.client.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-medium truncate">{item.client.name}</p>
                <Badge variant="destructive" className="text-xs">
                  <span className="material-symbols-outlined text-xs mr-1">trending_down</span>
                  -{item.complianceDrop}%
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-2">{item.reason}</p>
              <div className="flex items-center gap-2">
                <Progress value={item.currentCompliance} className="h-1.5 flex-1" />
                <span className="text-xs text-muted-foreground">{item.currentCompliance}%</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onMessageClient?.(item.client.id)}
                data-testid={`button-message-${item.client.id}`}
              >
                <span className="material-symbols-outlined text-base">chat</span>
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={() => onViewClient?.(item.client.id)}
                data-testid={`button-view-${item.client.id}`}
              >
                View
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
