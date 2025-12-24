import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { authService } from '@/services';
import { useStore } from '@/store/useStore';

const features = [
  {
    icon: 'group',
    title: 'Multi-Mentor Support',
    description: 'Assign different mentors to handle workout, nutrition, and mindset domains for each client.',
  },
  {
    icon: 'smart_toy',
    title: '24/7 Pat AI Assistant',
    description: 'Pat bridges the gap between sessions, providing personalized support when you\'re not available.',
  },
  {
    icon: 'bolt',
    title: 'Smart Directives',
    description: 'Create automated triggers that send personalized messages based on client behavior.',
  },
  {
    icon: 'schedule',
    title: 'Real-time Progress',
    description: 'Track workouts, nutrition, and sleep with AI-powered insights and recommendations.',
  },
];

const steps = [
  { step: 1, title: 'Invite Clients', description: 'Send a simple link to onboard clients to the HiPat app.' },
  { step: 2, title: 'Set Up Directives', description: 'Create personalized triggers that automate your coaching.' },
  { step: 3, title: 'Let Pat Work', description: 'Pat provides 24/7 support while you focus on what matters.' },
];

export default function Landing() {
  const [, setLocation] = useLocation();
  const { setUser, setMentorProfile } = useStore();

  const handleGetStarted = async () => {
    try {
      const user = await authService.login('info@hipat.app', 'admin123');
      setUser(user);
      const profile = await authService.getMentorProfile(user.id);
      if (profile) {
        setMentorProfile(profile);
      }
      setLocation('/dashboard');
    } catch (error) {
      console.error('Auto-login failed:', error);
    }
  };

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
          <Button onClick={handleGetStarted} data-testid="button-get-started">Get Started</Button>
        </div>
      </header>

      <main>
        <section className="py-20 px-4">
          <div className="container mx-auto text-center max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Manage Your Fitness Clients with AI
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              HiPat gives your clients a 24/7 AI assistant that extends your expertise. 
              Pat handles check-ins, tracks progress, and keeps clients engaged between sessions.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Button size="lg" className="gap-2" onClick={handleGetStarted} data-testid="button-hero-cta">
                Start Free Trial
                <span className="material-symbols-outlined text-base">chevron_right</span>
              </Button>
              <Button size="lg" variant="outline" data-testid="button-watch-demo">
                Watch Demo
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <h2 className="text-2xl font-bold text-center mb-12">What Makes HiPat Different</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 bg-background">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                      <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-center mb-12">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((item) => (
                <div key={item.step} className="text-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Coaching?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of fitness professionals using HiPat to scale their impact.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-base text-chart-4">check_circle</span>
                <span>Free 14-day trial</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-base text-chart-4">check_circle</span>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="material-symbols-outlined text-base text-chart-4">check_circle</span>
                <span>Cancel anytime</span>
              </div>
            </div>
            <Button size="lg" onClick={handleGetStarted} data-testid="button-final-cta">
              Start Your Free Trial
            </Button>
          </div>
        </section>
      </main>

      <footer className="border-t border-border py-8 px-4">
        <div className="container mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">smart_toy</span>
            <span>HiPat</span>
          </div>
          <p>Built for fitness professionals who want to scale their impact.</p>
        </div>
      </footer>
    </div>
  );
}
