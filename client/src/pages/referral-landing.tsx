import { useState, useEffect } from 'react';
import { useParams, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { referralsService } from '../services';
import type { ReferralLink, MentorProfile } from '../types';

export default function ReferralLanding() {
  const params = useParams<{ code: string }>();
  const [referral, setReferral] = useState<ReferralLink | null>(null);
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    loadReferral();
  }, [params.code]);

  const loadReferral = async () => {
    if (!params.code) {
      setNotFound(true);
      setIsLoading(false);
      return;
    }

    try {
      const ref = await referralsService.getReferralByCode(params.code);
      if (ref) {
        setReferral(ref);
        await referralsService.trackClick(params.code);
        const mentorData = await referralsService.getMentorFromReferral(params.code);
        setMentor(mentorData);
      } else {
        setNotFound(true);
      }
    } catch (error) {
      console.error('Failed to load referral:', error);
      setNotFound(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 space-y-4">
            <Skeleton className="h-20 w-20 rounded-full mx-auto" />
            <Skeleton className="h-8 w-48 mx-auto" />
            <Skeleton className="h-4 w-64 mx-auto" />
            <Skeleton className="h-12 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="p-8 space-y-4">
            <span className="material-symbols-outlined text-6xl mx-auto text-muted-foreground block">smart_toy</span>
            <h1 className="text-2xl font-bold">Referral Not Found</h1>
            <p className="text-muted-foreground">
              This referral link is invalid or has expired.
            </p>
            <Link href="/">
              <Button>Go to Homepage</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary text-primary-foreground">
              <span className="material-symbols-outlined text-xl">smart_toy</span>
            </div>
            <span className="text-xl font-bold">HiPat</span>
          </div>
          <Link href="/login">
            <Button variant="ghost" data-testid="button-login">Already have an account?</Button>
          </Link>
        </div>
      </header>

      <main className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card>
            <CardContent className="p-8 text-center space-y-6">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {mentor?.displayName.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>

              <div>
                <h1 className="text-2xl font-bold mb-2">{mentor?.displayName}</h1>
                <p className="text-muted-foreground mb-4">
                  {mentor?.bio || 'Personal Trainer & Fitness Coach'}
                </p>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                  {mentor?.specializations.map((spec) => (
                    <Badge key={spec} variant="secondary">{spec}</Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground py-4 border-y border-border">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">group</span>
                  <span>50+ clients</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-chart-3">star</span>
                  <span>4.9 rating</span>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="font-semibold">What you'll get:</h2>
                <ul className="text-left space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl text-chart-4 flex-shrink-0 mt-0.5">check_circle</span>
                    <span>Personalized workout and nutrition guidance from {mentor?.displayName}</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl text-chart-4 flex-shrink-0 mt-0.5">check_circle</span>
                    <span>24/7 access to Pat, your AI fitness assistant</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-xl text-chart-4 flex-shrink-0 mt-0.5">check_circle</span>
                    <span>Real-time progress tracking and insights</span>
                  </li>
                </ul>
              </div>

              <Link href={`/signup?ref=${params.code}`}>
                <Button size="lg" className="w-full gap-2" data-testid="button-get-started">
                  Get Started with {mentor?.displayName}
                  <span className="material-symbols-outlined text-base">chevron_right</span>
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground">
                Free to start. Download the HiPat app after signing up.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
