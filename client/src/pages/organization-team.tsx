import { useState, useEffect } from 'react';
import { useParams } from 'wouter';
import { Users, UserPlus, MoreVertical, Shield, User } from 'lucide-react';
import { Header } from '../components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { organizationsService } from '../services';
import { useAskPat } from '../App';

interface TeamMentor {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  clientCount: number;
  lastActive: string;
  specializations: string[];
}

export default function OrganizationTeam() {
  const params = useParams<{ id: string }>();
  const orgId = params.id || 'org-1';
  const { openAskPat } = useAskPat();
  const [mentors, setMentors] = useState<TeamMentor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeam();
  }, [orgId]);

  const loadTeam = async () => {
    try {
      const data = await organizationsService.getTeamMentors(orgId);
      setMentors(data);
    } catch (error) {
      console.error('Failed to load team:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <Badge className="bg-chart-1/10 text-chart-1 border-chart-1/20">Owner</Badge>;
      case 'manager':
        return <Badge className="bg-chart-4/10 text-chart-4 border-chart-4/20">Manager</Badge>;
      default:
        return <Badge variant="secondary">Mentor</Badge>;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header 
        title="Team Management" 
        onAskPat={openAskPat}
      />
      
      <main className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">FitLife Gym Team</h2>
            <p className="text-sm text-muted-foreground">Manage your organization's mentors</p>
          </div>
          <Button data-testid="button-invite-mentor">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Mentor
          </Button>
        </div>

        <div className="grid gap-4">
          {isLoading ? (
            <>
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </>
          ) : (
            mentors.map((mentor) => (
              <Card key={mentor.id} className="hover-elevate">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {mentor.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{mentor.name}</span>
                          {getRoleBadge(mentor.role)}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {mentor.clientCount} clients
                          </span>
                          <span>Last active: {mentor.lastActive}</span>
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          {mentor.specializations.map((spec) => (
                            <Badge key={spec} variant="outline" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" data-testid={`button-mentor-menu-${mentor.id}`}>
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <User className="w-4 h-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Users className="w-4 h-4" />
                          View Clients
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2">
                          <Shield className="w-4 h-4" />
                          Change Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
