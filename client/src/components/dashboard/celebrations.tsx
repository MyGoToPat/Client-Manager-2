import { CelebrationItem } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

interface CelebrationsProps {
  items: CelebrationItem[];
  onViewClient: (clientId: string) => void;
  onCelebrate: (clientId: string) => void;
}

export function Celebrations({ items, onViewClient, onCelebrate }: CelebrationsProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <span className="material-symbols-outlined text-amber-500">celebration</span>
        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
          Worth Celebrating
        </h2>
      </div>

      <Card className="overflow-hidden bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border-emerald-200 dark:border-emerald-800">
        <CardContent className="p-4 md:p-5">
          <div className="divide-y divide-emerald-200 dark:divide-emerald-800">
            {items.map((item, index) => (
              <div 
                key={item.id} 
                className={`flex items-start gap-3 ${index > 0 ? 'pt-4' : ''} ${index < items.length - 1 ? 'pb-4' : ''}`}
                data-testid={`celebration-item-${item.id}`}
              >
                <span className="material-symbols-outlined text-2xl text-amber-500">{item.icon}</span>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {item.client.name}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500">-</span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {formatDistanceToNow(new Date(item.timestamp), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="font-medium text-emerald-800 dark:text-emerald-300 mt-0.5">
                    {item.headline}
                  </p>
                  
                  <p className="text-sm text-emerald-700 dark:text-emerald-400 mt-1">
                    {item.details}
                  </p>
                  
                  {item.patAlreadyDid && (
                    <p className="text-xs text-emerald-600 dark:text-emerald-500 mt-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">check_circle</span>
                      Pat: {item.patAlreadyDid}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-white dark:bg-slate-800 border-emerald-300 dark:border-emerald-700"
                    onClick={() => onCelebrate(item.client.id)}
                    data-testid={`button-congrats-${item.id}`}
                  >
                    <span className="material-symbols-outlined text-base mr-1">celebration</span>
                    Congrats
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewClient(item.client.id)}
                    data-testid={`button-view-${item.id}`}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
