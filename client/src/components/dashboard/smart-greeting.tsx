import { SmartGreeting } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

interface SmartGreetingProps {
  greeting: SmartGreeting;
  isLoading: boolean;
}

export function SmartGreetingComponent({ greeting, isLoading }: SmartGreetingProps) {
  if (isLoading) {
    return (
      <div className="space-y-3" data-testid="smart-greeting-loading">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-5 w-96" />
        <Skeleton className="h-8 w-80" />
      </div>
    );
  }

  return (
    <div className="space-y-4" data-testid="smart-greeting">
      <div className="flex items-start gap-4">
        <div className="hidden sm:block">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
          </div>
        </div>
        
        <div className="flex-1">
          <h1 
            className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white"
            data-testid="text-smart-greeting"
          >
            {greeting.greeting}
          </h1>
          
          <p 
            className="text-slate-600 dark:text-slate-300 mt-1 text-base md:text-lg"
            data-testid="text-context-line"
          >
            {greeting.contextLine}
          </p>
          
          {greeting.urgentContext && (
            <p 
              className="text-indigo-600 dark:text-indigo-400 mt-2 text-sm font-medium flex items-center gap-2"
              data-testid="text-urgent-context"
            >
              <span className="material-symbols-outlined text-lg">schedule</span>
              {greeting.urgentContext}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2" data-testid="segment-pills">
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 hover-elevate transition-colors"
          data-testid="pill-in-person"
        >
          <span className="material-symbols-outlined text-lg">fitness_center</span>
          <span>In-Person: {greeting.segments.inPerson.count}</span>
          {greeting.segments.inPerson.todayCount !== undefined && greeting.segments.inPerson.todayCount > 0 && (
            <Badge variant="secondary" className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200">
              {greeting.segments.inPerson.todayCount} today
            </Badge>
          )}
        </button>
        
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 hover-elevate transition-colors"
          data-testid="pill-online"
        >
          <span className="material-symbols-outlined text-lg">videocam</span>
          <span>Online 1:1: {greeting.segments.online.count}</span>
          {greeting.segments.online.thisWeekCount !== undefined && greeting.segments.online.thisWeekCount > 0 && (
            <Badge variant="secondary" className="bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200">
              {greeting.segments.online.thisWeekCount} this week
            </Badge>
          )}
        </button>
        
        <button 
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 hover-elevate transition-colors"
          data-testid="pill-programs"
        >
          <span className="material-symbols-outlined text-lg">school</span>
          <span>Programs: {greeting.segments.programs.groupCount}</span>
          <Badge variant="secondary" className="bg-emerald-200 dark:bg-emerald-800 text-emerald-800 dark:text-emerald-200">
            {greeting.segments.programs.memberCount} members
          </Badge>
        </button>
      </div>
    </div>
  );
}
