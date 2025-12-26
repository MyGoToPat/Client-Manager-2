import { useState, useEffect } from 'react';
import { Header } from '../components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '../store/useStore';
import { authService, referralsService, engagementTypesService, leadGenToolsService } from '../services';
import { availableIcons } from '../mocks/engagement-types.mock';
import type { MentorProfile, ReferralLink, EngagementType, LeadGenTool } from '../types';

export default function Settings() {
  const { toast } = useToast();
  const { mentorProfile, setMentorProfile, user, darkMode, toggleDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [referral, setReferral] = useState<ReferralLink | null>(null);
  const [copied, setCopied] = useState(false);
  const [engagementTypes, setEngagementTypes] = useState<EngagementType[]>([]);
  const [leadGenTools, setLeadGenTools] = useState<LeadGenTool[]>([]);
  const [showEngagementModal, setShowEngagementModal] = useState(false);
  const [showToolConfigModal, setShowToolConfigModal] = useState(false);
  const [editingTool, setEditingTool] = useState<LeadGenTool | null>(null);
  const [toolForm, setToolForm] = useState({
    liveUrl: '',
    selfServiceUrl: '',
    isActive: true,
    isConfigured: false,
  });
  const [editingType, setEditingType] = useState<EngagementType | null>(null);
  const [engagementForm, setEngagementForm] = useState({
    name: '',
    icon: 'fitness_center',
    dashboardBehavior: 'this_week' as 'today' | 'this_week' | 'async_only',
    requiresVenue: false,
    requiresPlatform: true,
    requiresScheduling: true,
  });

  const [formData, setFormData] = useState({
    displayName: '',
    bio: '',
    hourlyRate: 0,
    specializations: [] as string[],
    certifications: [] as string[],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      if (user) {
        const [profile, referralData, types, tools] = await Promise.all([
          authService.getMentorProfile(user.id),
          referralsService.getReferralLink('mentor-1'),
          engagementTypesService.getEngagementTypes('mentor-1'),
          leadGenToolsService.getTools(),
        ]);
        if (profile) {
          setMentorProfile(profile);
          setFormData({
            displayName: profile.displayName,
            bio: profile.bio,
            hourlyRate: profile.hourlyRate,
            specializations: profile.specializations,
            certifications: profile.certifications,
          });
        }
        setReferral(referralData);
        setEngagementTypes(types);
        setLeadGenTools(tools);
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetEngagementForm = () => {
    setEngagementForm({
      name: '',
      icon: 'fitness_center',
      dashboardBehavior: 'this_week',
      requiresVenue: false,
      requiresPlatform: true,
      requiresScheduling: true,
    });
    setEditingType(null);
  };

  const handleOpenEngagementModal = (type?: EngagementType) => {
    if (type) {
      setEditingType(type);
      setEngagementForm({
        name: type.name,
        icon: type.icon,
        dashboardBehavior: type.dashboardBehavior,
        requiresVenue: type.requiresVenue,
        requiresPlatform: type.requiresPlatform,
        requiresScheduling: type.requiresScheduling,
      });
    } else {
      resetEngagementForm();
    }
    setShowEngagementModal(true);
  };

  const handleSaveEngagementType = async () => {
    if (!engagementForm.name.trim()) {
      toast({
        title: 'Name required',
        description: 'Please enter a name for this engagement type.',
        variant: 'destructive',
      });
      return;
    }

    setIsSaving(true);
    try {
      if (editingType) {
        const updated = await engagementTypesService.updateEngagementType(editingType.id, {
          name: engagementForm.name,
          icon: engagementForm.icon,
          dashboardBehavior: engagementForm.dashboardBehavior,
          requiresVenue: engagementForm.requiresVenue,
          requiresPlatform: engagementForm.requiresPlatform,
          requiresScheduling: engagementForm.requiresScheduling,
        });
        setEngagementTypes(types => types.map(t => t.id === editingType.id ? updated : t));
        toast({
          title: 'Type updated',
          description: 'Engagement type has been updated.',
        });
      } else {
        const created = await engagementTypesService.createEngagementType({
          mentorId: 'mentor-1',
          name: engagementForm.name,
          icon: engagementForm.icon,
          dashboardBehavior: engagementForm.dashboardBehavior,
          requiresVenue: engagementForm.requiresVenue,
          requiresPlatform: engagementForm.requiresPlatform,
          requiresScheduling: engagementForm.requiresScheduling,
          isDefault: false,
          isActive: true,
        });
        setEngagementTypes(types => [...types, created]);
        toast({
          title: 'Type created',
          description: 'New engagement type has been created.',
        });
      }
      setShowEngagementModal(false);
      resetEngagementForm();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save engagement type.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteEngagementType = async (id: string) => {
    try {
      await engagementTypesService.deleteEngagementType(id);
      setEngagementTypes(types => types.filter(t => t.id !== id));
      toast({
        title: 'Type deleted',
        description: 'Engagement type has been removed.',
      });
    } catch (error) {
      toast({
        title: 'Cannot delete',
        description: 'Default types cannot be deleted.',
        variant: 'destructive',
      });
    }
  };

  const getDashboardBehaviorLabel = (behavior: string) => {
    switch (behavior) {
      case 'today': return 'Today\'s Sessions';
      case 'this_week': return 'This Week';
      case 'async_only': return 'Async Only';
      default: return behavior;
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const updated = await authService.updateMentorProfile(formData);
      setMentorProfile(updated);
      toast({
        title: 'Settings saved',
        description: 'Your profile has been updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save settings.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyReferral = () => {
    if (referral) {
      navigator.clipboard.writeText(`https://hipat.app/r/${referral.code}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied!',
        description: 'Referral link copied to clipboard.',
      });
    }
  };

  const handleRegenerateCode = async () => {
    try {
      const newReferral = await referralsService.regenerateCode('mentor-1');
      setReferral(newReferral);
      toast({
        title: 'Code regenerated',
        description: 'Your new referral code is ready.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to regenerate code.',
        variant: 'destructive',
      });
    }
  };

  const handleOpenToolConfig = (tool: LeadGenTool) => {
    setEditingTool(tool);
    setToolForm({
      liveUrl: tool.liveUrl || '',
      selfServiceUrl: tool.selfServiceUrl || '',
      isActive: tool.isActive,
      isConfigured: tool.isConfigured,
    });
    setShowToolConfigModal(true);
  };

  const handleSaveToolConfig = async () => {
    if (!editingTool) return;

    const hasUrls = toolForm.liveUrl.trim() || toolForm.selfServiceUrl.trim();

    setIsSaving(true);
    try {
      const updated = await leadGenToolsService.updateTool(editingTool.id, {
        liveUrl: toolForm.liveUrl.trim() || undefined,
        selfServiceUrl: toolForm.selfServiceUrl.trim() || undefined,
        isActive: toolForm.isActive,
        isConfigured: hasUrls,
      });
      setLeadGenTools((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      setShowToolConfigModal(false);
      toast({
        title: 'Tool updated',
        description: `${editingTool.name} configuration saved.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save tool configuration.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleToolActive = async (tool: LeadGenTool) => {
    try {
      const updated = await leadGenToolsService.updateTool(tool.id, {
        isActive: !tool.isActive,
      });
      setLeadGenTools((prev) =>
        prev.map((t) => (t.id === updated.id ? updated : t))
      );
      toast({
        title: updated.isActive ? 'Tool enabled' : 'Tool disabled',
        description: `${tool.name} is now ${updated.isActive ? 'active' : 'inactive'}.`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update tool.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Settings" />
      
      <main className="flex-1 p-6">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile" data-testid="tab-profile">
              <span className="material-symbols-outlined text-base mr-2">person</span>
              Profile
            </TabsTrigger>
            <TabsTrigger value="notifications" data-testid="tab-notifications">
              <span className="material-symbols-outlined text-base mr-2">notifications</span>
              Notifications
            </TabsTrigger>
            <TabsTrigger value="referrals" data-testid="tab-referrals">
              <span className="material-symbols-outlined text-base mr-2">link</span>
              Referrals
            </TabsTrigger>
            <TabsTrigger value="security" data-testid="tab-security">
              <span className="material-symbols-outlined text-base mr-2">shield</span>
              Security
            </TabsTrigger>
            <TabsTrigger value="engagement" data-testid="tab-engagement">
              <span className="material-symbols-outlined text-base mr-2">category</span>
              Engagement Types
            </TabsTrigger>
            <TabsTrigger value="lead-gen" data-testid="tab-lead-gen">
              <span className="material-symbols-outlined text-base mr-2">rocket_launch</span>
              Lead Generation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-32" />
                <Skeleton className="h-32" />
              </div>
            ) : (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your mentor profile details</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                        data-testid="input-display-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        data-testid="input-bio"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hourlyRate">Hourly Rate ($)</Label>
                      <Input
                        id="hourlyRate"
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => setFormData({ ...formData, hourlyRate: Number(e.target.value) })}
                        data-testid="input-hourly-rate"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Specializations</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.specializations.map((spec, index) => (
                          <Badge key={index} variant="secondary">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Certifications</Label>
                      <div className="flex flex-wrap gap-2">
                        {formData.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button onClick={handleSave} disabled={isSaving} data-testid="button-save-profile">
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Appearance</CardTitle>
                    <CardDescription>Customize your experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">Switch between light and dark theme</p>
                      </div>
                      <Switch
                        checked={darkMode}
                        onCheckedChange={toggleDarkMode}
                        data-testid="switch-dark-mode"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="notifications">
            <div className="space-y-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose what you want to be notified about</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">New Client Signups</p>
                      <p className="text-sm text-muted-foreground">Get notified when clients join via your link</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-signups" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Directive Triggers</p>
                      <p className="text-sm text-muted-foreground">Be alerted when Pat sends messages</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-directives" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Client Activity</p>
                      <p className="text-sm text-muted-foreground">Weekly summary of client progress</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-activity" />
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">At-Risk Alerts</p>
                      <p className="text-sm text-muted-foreground">Immediate alerts for inactive clients</p>
                    </div>
                    <Switch defaultChecked data-testid="switch-notify-risk" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="referrals">
            {isLoading ? (
              <Skeleton className="h-64" />
            ) : referral && (
              <div className="space-y-6 max-w-2xl">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Referral Link</CardTitle>
                    <CardDescription>Share this link to onboard new clients</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-2">
                      <Input
                        value={`https://hipat.app/r/${referral.code}`}
                        readOnly
                        className="font-mono"
                        data-testid="input-referral-link"
                      />
                      <Button variant="outline" size="icon" onClick={handleCopyReferral} data-testid="button-copy-referral">
                        {copied ? (
                          <span className="material-symbols-outlined text-base">check</span>
                        ) : (
                          <span className="material-symbols-outlined text-base">content_copy</span>
                        )}
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button variant="outline" onClick={handleRegenerateCode} data-testid="button-regenerate-code">
                        Regenerate Code
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Referral Stats</CardTitle>
                    <CardDescription>Track your referral performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <div className="text-center">
                        <p className="text-3xl font-mono font-bold">{referral.clickCount}</p>
                        <p className="text-sm text-muted-foreground">Link Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-mono font-bold">{referral.conversions}</p>
                        <p className="text-sm text-muted-foreground">Conversions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-mono font-bold">
                          {referral.clickCount > 0 
                            ? Math.round((referral.conversions / referral.clickCount) * 100)
                            : 0}%
                        </p>
                        <p className="text-sm text-muted-foreground">Conversion Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="security">
            <div className="space-y-6 max-w-2xl">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input id="currentPassword" type="password" data-testid="input-current-password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input id="newPassword" type="password" data-testid="input-new-password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                    <Input id="confirmNewPassword" type="password" data-testid="input-confirm-new-password" />
                  </div>
                  <Button data-testid="button-change-password">Change Password</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>Manage your calendar and app integrations</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <span className="material-symbols-outlined text-base text-muted-foreground">open_in_new</span>
                      </div>
                      <div>
                        <p className="font-medium">Google Calendar</p>
                        <p className="text-sm text-muted-foreground">Sync your bookings</p>
                      </div>
                    </div>
                    <Button variant="outline" data-testid="button-connect-google">Connect</Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                        <span className="material-symbols-outlined text-base text-muted-foreground">open_in_new</span>
                      </div>
                      <div>
                        <p className="font-medium">Apple Calendar</p>
                        <p className="text-sm text-muted-foreground">Sync your bookings</p>
                      </div>
                    </div>
                    <Button variant="outline" data-testid="button-connect-apple">Connect</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement">
            <div className="space-y-6 max-w-3xl">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0 pb-4">
                  <div>
                    <CardTitle>Engagement Types</CardTitle>
                    <CardDescription>Customize how you categorize different client engagement models</CardDescription>
                  </div>
                  <Button onClick={() => handleOpenEngagementModal()} data-testid="button-add-engagement-type">
                    <span className="material-symbols-outlined text-base mr-2">add</span>
                    Add Type
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {engagementTypes.map((type) => (
                    <div
                      key={type.id}
                      className="flex items-center justify-between gap-4 p-4 rounded-md bg-muted/50 hover-elevate"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center">
                          <span className="material-symbols-outlined text-lg text-primary">{type.icon}</span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{type.name}</p>
                            {type.isDefault && (
                              <Badge variant="secondary" className="text-xs">Default</Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1">
                              <span className="material-symbols-outlined text-xs">calendar_today</span>
                              {getDashboardBehaviorLabel(type.dashboardBehavior)}
                            </span>
                            {type.requiresVenue && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">location_on</span>
                                Venue
                              </span>
                            )}
                            {type.requiresPlatform && (
                              <span className="flex items-center gap-1">
                                <span className="material-symbols-outlined text-xs">videocam</span>
                                Platform
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenEngagementModal(type)}
                          data-testid={`button-edit-type-${type.id}`}
                        >
                          <span className="material-symbols-outlined text-base">edit</span>
                        </Button>
                        {!type.isDefault && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEngagementType(type.id)}
                            data-testid={`button-delete-type-${type.id}`}
                          >
                            <span className="material-symbols-outlined text-base text-destructive">delete</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Dashboard Behavior</CardTitle>
                  <CardDescription>How engagement types affect your dashboard view</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-base text-green-500 mt-0.5">today</span>
                    <div>
                      <p className="font-medium text-foreground">Today's Sessions</p>
                      <p>Clients appear in the "In-Person Sessions Today" section of your dashboard</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-base text-blue-500 mt-0.5">date_range</span>
                    <div>
                      <p className="font-medium text-foreground">This Week</p>
                      <p>Clients appear in the "Online Sessions This Week" section, grouped by day</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-base text-gray-500 mt-0.5">schedule</span>
                    <div>
                      <p className="font-medium text-foreground">Async Only</p>
                      <p>Clients are handled asynchronously and appear in Program Health section</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="lead-gen">
            <div className="space-y-6 max-w-3xl">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">rocket_launch</span>
                    Onboarding Tools
                  </CardTitle>
                  <CardDescription>
                    Configure external assessment tools. These tools are loaded via iframe and send results back using the postMessage API.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isLoading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map(i => (
                        <Skeleton key={i} className="h-20" />
                      ))}
                    </div>
                  ) : leadGenTools.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No tools available.</p>
                  ) : (
                    <div className="space-y-3">
                      {leadGenTools.map(tool => (
                        <div
                          key={tool.id}
                          className="flex items-center justify-between gap-4 p-4 border rounded-md"
                          data-testid={`tool-config-${tool.id}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-10 h-10 rounded-md flex items-center justify-center ${tool.isActive ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'}`}>
                              <span className="material-symbols-outlined text-lg">{tool.icon}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="font-medium text-sm">{tool.name}</h4>
                                {tool.isDefault && (
                                  <Badge variant="secondary" className="text-xs">Default</Badge>
                                )}
                                {tool.isActive && !tool.isConfigured && (
                                  <Badge variant="destructive" className="text-xs">Not Configured</Badge>
                                )}
                                {tool.isActive && tool.isConfigured && (
                                  <Badge variant="outline" className="text-xs border-green-500 text-green-600 dark:text-green-400">Configured</Badge>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground">{tool.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch
                              checked={tool.isActive}
                              onCheckedChange={() => handleToggleToolActive(tool)}
                              data-testid={`switch-tool-active-${tool.id}`}
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleOpenToolConfig(tool)}
                              data-testid={`button-configure-${tool.id}`}
                            >
                              <span className="material-symbols-outlined text-base">settings</span>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                  <CardDescription>Understanding the lead generation flow</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-base text-primary mt-0.5">looks_one</span>
                    <div>
                      <p className="font-medium text-foreground">Configure Your Tool URLs</p>
                      <p>Enter the URLs for your external assessment tools. These can be TDEE calculators, workout assessments, or any custom tool.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-base text-primary mt-0.5">looks_two</span>
                    <div>
                      <p className="font-medium text-foreground">Run Live or Share Links</p>
                      <p>Use "Start Live" in client sessions or share self-service links for prospects to complete on their own.</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-base text-primary mt-0.5">looks_3</span>
                    <div>
                      <p className="font-medium text-foreground">Automatic Client Creation</p>
                      <p>When tools complete, Pat captures the results and helps you convert leads into clients.</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={showEngagementModal} onOpenChange={(open) => {
        setShowEngagementModal(open);
        if (!open) resetEngagementForm();
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingType ? 'Edit Engagement Type' : 'Create Engagement Type'}</DialogTitle>
            <DialogDescription>
              Define how clients with this engagement type appear on your dashboard
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="type-name">Name</Label>
              <Input
                id="type-name"
                value={engagementForm.name}
                onChange={(e) => setEngagementForm({ ...engagementForm, name: e.target.value })}
                placeholder="e.g., Macro Coaching"
                data-testid="input-engagement-name"
              />
            </div>

            <div className="space-y-2">
              <Label>Icon</Label>
              <div className="grid grid-cols-5 gap-2 max-h-40 overflow-y-auto p-1">
                {availableIcons.map((icon) => (
                  <button
                    key={icon.name}
                    type="button"
                    onClick={() => setEngagementForm({ ...engagementForm, icon: icon.name })}
                    className={`w-10 h-10 rounded-md flex items-center justify-center transition-colors ${
                      engagementForm.icon === icon.name
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover-elevate'
                    }`}
                    title={icon.label}
                    data-testid={`icon-${icon.name}`}
                  >
                    <span className="material-symbols-outlined text-lg">{icon.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dashboard-behavior">Dashboard Behavior</Label>
              <Select
                value={engagementForm.dashboardBehavior}
                onValueChange={(value: 'today' | 'this_week' | 'async_only') =>
                  setEngagementForm({ ...engagementForm, dashboardBehavior: value })
                }
              >
                <SelectTrigger data-testid="select-dashboard-behavior">
                  <SelectValue placeholder="Select behavior" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today's Sessions</SelectItem>
                  <SelectItem value="this_week">This Week</SelectItem>
                  <SelectItem value="async_only">Async Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Requirements</Label>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Requires Venue</p>
                    <p className="text-xs text-muted-foreground">Client needs a physical location</p>
                  </div>
                  <Switch
                    checked={engagementForm.requiresVenue}
                    onCheckedChange={(checked) => setEngagementForm({ ...engagementForm, requiresVenue: checked })}
                    data-testid="switch-requires-venue"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Requires Platform</p>
                    <p className="text-xs text-muted-foreground">Needs video call platform (Zoom, Meet)</p>
                  </div>
                  <Switch
                    checked={engagementForm.requiresPlatform}
                    onCheckedChange={(checked) => setEngagementForm({ ...engagementForm, requiresPlatform: checked })}
                    data-testid="switch-requires-platform"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Requires Scheduling</p>
                    <p className="text-xs text-muted-foreground">Regular scheduled sessions</p>
                  </div>
                  <Switch
                    checked={engagementForm.requiresScheduling}
                    onCheckedChange={(checked) => setEngagementForm({ ...engagementForm, requiresScheduling: checked })}
                    data-testid="switch-requires-scheduling"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEngagementModal(false)} data-testid="button-cancel-engagement-type">
              Cancel
            </Button>
            <Button onClick={handleSaveEngagementType} disabled={isSaving} data-testid="button-save-engagement-type">
              {isSaving ? 'Saving...' : editingType ? 'Save Changes' : 'Create Type'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showToolConfigModal} onOpenChange={(open) => {
        setShowToolConfigModal(open);
        if (!open) setEditingTool(null);
      }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base">{editingTool?.icon || 'settings'}</span>
              Configure {editingTool?.name}
            </DialogTitle>
            <DialogDescription>
              Enter the URLs for your external tool. The tool should send results via postMessage API.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="live-url">Live Session URL</Label>
              <Input
                id="live-url"
                value={toolForm.liveUrl}
                onChange={(e) => setToolForm({ ...toolForm, liveUrl: e.target.value })}
                placeholder="https://your-tool.com/assessment"
                data-testid="input-live-url"
              />
              <p className="text-xs text-muted-foreground">
                URL opened when running "Start Live" with a client. Parameters like mentorId and mode will be appended.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="self-service-url">Self-Service URL</Label>
              <Input
                id="self-service-url"
                value={toolForm.selfServiceUrl}
                onChange={(e) => setToolForm({ ...toolForm, selfServiceUrl: e.target.value })}
                placeholder="https://your-tool.com/self-service"
                data-testid="input-self-service-url"
              />
              <p className="text-xs text-muted-foreground">
                URL shared via "Get Link" for prospects to complete on their own.
              </p>
            </div>

            <Separator />

            <div className="space-y-3">
              <h4 className="font-medium text-sm">postMessage API Requirements</h4>
              <div className="bg-muted/50 rounded-md p-3 text-xs font-mono">
                <p className="text-muted-foreground mb-1">// Tool should send on completion:</p>
                <pre className="text-foreground">
{`window.parent.postMessage({
  type: 'TOOL_COMPLETE',
  clientData: { name, email, phone },
  results: { ... }
}, '*');`}
                </pre>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowToolConfigModal(false)} data-testid="button-cancel-tool-config">
              Cancel
            </Button>
            <Button onClick={handleSaveToolConfig} disabled={isSaving} data-testid="button-save-tool-config">
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
