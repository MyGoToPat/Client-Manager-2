import { useState, useEffect } from 'react';
import { Dumbbell, Apple, Brain, Bot, User, ChevronDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { organizationsService } from '../services';
import type { DomainAssignment } from '../types';
import { cn } from '@/lib/utils';

interface DomainAssignmentProps {
  clientId: string;
}

const domainConfig = {
  workout: { icon: Dumbbell, label: 'Workout', color: 'text-chart-1 bg-chart-1/10' },
  nutrition: { icon: Apple, label: 'Nutrition', color: 'text-chart-2 bg-chart-2/10' },
  mindset: { icon: Brain, label: 'Mindset', color: 'text-chart-4 bg-chart-4/10' },
};

const mockMentors = [
  { id: 'mentor-1', name: 'Coach Alex' },
  { id: 'mentor-2', name: 'Dr. Sarah' },
  { id: 'mentor-3', name: 'Dr. Mike' },
];

export function DomainAssignmentCard({ clientId }: DomainAssignmentProps) {
  const [assignments, setAssignments] = useState<DomainAssignment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, [clientId]);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const data = await organizationsService.getDomainAssignments(clientId);
      setAssignments(data);
    } catch (error) {
      console.error('Failed to load domain assignments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAssignmentChange = async (
    assignmentId: string,
    handlerType: 'mentor' | 'pat',
    handlerId?: string,
    handlerName?: string
  ) => {
    try {
      await organizationsService.updateDomainAssignment(assignmentId, {
        handlerType,
        handlerId,
        handlerName,
      });
      await loadAssignments();
    } catch (error) {
      console.error('Failed to update assignment:', error);
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Domain Handlers</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-12 bg-muted rounded-md" />
            <div className="h-12 bg-muted rounded-md" />
            <div className="h-12 bg-muted rounded-md" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center justify-between gap-2">
          <span>Domain Handlers</span>
          <Badge variant="secondary" className="text-xs">Multi-Mentor</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {assignments.map((assignment) => {
          const config = domainConfig[assignment.domain];
          const Icon = config.icon;
          const isPat = assignment.handlerType === 'pat';

          return (
            <div 
              key={assignment.id} 
              className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50"
            >
              <div className="flex items-center gap-3">
                <div className={cn('flex items-center justify-center w-9 h-9 rounded-md', config.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-medium text-sm">{config.label}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    data-testid={`dropdown-domain-${assignment.domain}`}
                  >
                    {isPat ? (
                      <>
                        <Bot className="w-4 h-4 text-primary" />
                        <span>Pat AI</span>
                      </>
                    ) : (
                      <>
                        <User className="w-4 h-4" />
                        <span>{assignment.handlerName || 'Mentor'}</span>
                      </>
                    )}
                    <ChevronDown className="w-3 h-3 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => handleAssignmentChange(assignment.id, 'pat')}
                    className="gap-2"
                  >
                    <Bot className="w-4 h-4 text-primary" />
                    <div className="flex flex-col">
                      <span>Pat AI</span>
                      <span className="text-xs text-muted-foreground">24/7 AI assistant</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {mockMentors.map((mentor) => (
                    <DropdownMenuItem
                      key={mentor.id}
                      onClick={() => handleAssignmentChange(
                        assignment.id, 
                        'mentor', 
                        mentor.id, 
                        mentor.name
                      )}
                      className="gap-2"
                    >
                      <User className="w-4 h-4" />
                      <span>{mentor.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        })}

        {assignments.length === 0 && (
          <div className="text-center py-4 text-muted-foreground text-sm">
            No domain assignments configured
          </div>
        )}

        <p className="text-xs text-muted-foreground text-center pt-2">
          Assign different mentors or Pat AI to handle specific domains
        </p>
      </CardContent>
    </Card>
  );
}
