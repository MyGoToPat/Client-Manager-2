import { Shield, Dumbbell, Apple, Moon, MessageCircle, Camera, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ClientPermission } from '../../types';
import { cn } from '@/lib/utils';

interface ClientPermissionsTabProps {
  permissions: ClientPermission[];
}

const categoryConfig: Record<ClientPermission['dataCategory'], { icon: React.ElementType; label: string; description: string }> = {
  workout: { 
    icon: Dumbbell, 
    label: 'Workout Data', 
    description: 'Exercise logs, sets, reps, and workout history' 
  },
  nutrition: { 
    icon: Apple, 
    label: 'Nutrition Logs', 
    description: 'Food diary, macros, and meal tracking' 
  },
  sleep: { 
    icon: Moon, 
    label: 'Sleep Tracking', 
    description: 'Sleep duration, quality, and patterns' 
  },
  chat: { 
    icon: MessageCircle, 
    label: 'Chat History', 
    description: 'Conversations with Pat AI assistant' 
  },
  progress_photos: { 
    icon: Camera, 
    label: 'Progress Photos', 
    description: 'Before/after and progress images' 
  },
  body_metrics: { 
    icon: Activity, 
    label: 'Body Metrics', 
    description: 'Weight, body fat, measurements' 
  },
};

const accessLevelLabels: Record<ClientPermission['accessLevel'], string> = {
  none: 'No Access',
  view: 'View Only',
  view_edit: 'View & Edit',
  full: 'Full Access',
};

export function ClientPermissionsTab({ permissions }: ClientPermissionsTabProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Shield className="w-4 h-4" />
        <span>Control what data you can access for this client</span>
      </div>

      <div className="space-y-3">
        {permissions.map((permission) => {
          const config = categoryConfig[permission.dataCategory];
          const Icon = config.icon;
          const isEnabled = permission.accessLevel !== 'none';

          return (
            <Card key={permission.id} className={cn(!isEnabled && 'opacity-60')}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={cn(
                      'flex items-center justify-center w-10 h-10 rounded-md flex-shrink-0',
                      isEnabled ? 'bg-primary/10' : 'bg-muted'
                    )}>
                      <Icon className={cn('w-5 h-5', isEnabled ? 'text-primary' : 'text-muted-foreground')} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{config.label}</h4>
                      <p className="text-xs text-muted-foreground">{config.description}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Select defaultValue={permission.accessLevel}>
                      <SelectTrigger className="w-[130px]" data-testid={`select-permission-${permission.dataCategory}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No Access</SelectItem>
                        <SelectItem value="view">View Only</SelectItem>
                        <SelectItem value="view_edit">View & Edit</SelectItem>
                        <SelectItem value="full">Full Access</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <p className="text-xs text-muted-foreground text-center pt-4">
        Permission changes are saved automatically and take effect immediately
      </p>
    </div>
  );
}
