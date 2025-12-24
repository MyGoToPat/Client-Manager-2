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
import { useToast } from '@/hooks/use-toast';
import { useStore } from '../store/useStore';
import { authService, referralsService } from '../services';
import type { MentorProfile, ReferralLink } from '../types';

export default function Settings() {
  const { toast } = useToast();
  const { mentorProfile, setMentorProfile, user, darkMode, toggleDarkMode } = useStore();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [referral, setReferral] = useState<ReferralLink | null>(null);
  const [copied, setCopied] = useState(false);

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
        const [profile, referralData] = await Promise.all([
          authService.getMentorProfile(user.id),
          referralsService.getReferralLink('mentor-1'),
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
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setIsLoading(false);
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
        </Tabs>
      </main>
    </div>
  );
}
