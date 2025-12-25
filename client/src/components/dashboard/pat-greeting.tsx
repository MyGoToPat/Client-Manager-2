import { DashboardBriefing } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

interface PatGreetingProps {
  briefing: DashboardBriefing;
  isLoading: boolean;
}

export function PatGreeting({ briefing, isLoading }: PatGreetingProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
      </div>
    );
  }

  return (
    <div className="flex items-start gap-4">
      <div className="hidden sm:block">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
        </div>
      </div>
      
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white" data-testid="text-greeting">
          {briefing.greeting}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-300 mt-1 text-base md:text-lg" data-testid="text-sub-greeting">
          {briefing.subGreeting}
        </p>
        
        <div className="flex flex-wrap gap-2 mt-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" data-testid="badge-healthy-clients">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {briefing.clientSummary.healthy} doing great
          </span>
          {briefing.clientSummary.needsAttention > 0 && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" data-testid="badge-attention-clients">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
              {briefing.clientSummary.needsAttention} need attention
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
