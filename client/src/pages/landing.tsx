import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
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
  {
    icon: 'toll',
    title: 'Token-Based Flexibility',
    description: 'Clients get AI access on their terms. Start free, top up as needed, or go unlimited.',
  },
  {
    icon: 'groups',
    title: 'Join My Circle',
    description: 'Your clients can join Pat\'s beta program and earn referral income.',
  },
  {
    icon: 'payments',
    title: 'Referral Revenue',
    description: 'Earn ongoing fees when your clients upgrade to Plus or Circle plans.',
  },
  {
    icon: 'trending_down',
    title: 'Scalable Pricing',
    description: 'Pay less per client as you grow. Pro plan saves $4/seat vs Starter.',
  },
];

const steps = [
  { step: 1, title: 'Invite Clients', description: 'Send a simple link to onboard clients to the HiPat app.' },
  { step: 2, title: 'Set Up Directives', description: 'Create personalized triggers that automate your coaching.' },
  { step: 3, title: 'Let Pat Work', description: 'Pat provides 24/7 support while you focus on what matters.' },
];

const mentorPlans = [
  {
    name: 'Starter',
    price: 99,
    seatsIncluded: 0,
    overageCost: 9,
    payer: 'client',
    popular: false,
    features: [
      'Full HiPat dashboard',
      'Pat AI co-pilot',
      'Smart Directives',
      'Analytics',
      'Lead Gen Tools',
    ],
    note: 'Clients pay for their own seat ($9/$29/$49)',
  },
  {
    name: 'Growth',
    price: 199,
    seatsIncluded: 20,
    overageCost: 7,
    payer: 'mentor',
    popular: true,
    features: [
      'Everything in Starter',
      '20 seats included',
      'Priority support',
    ],
    note: 'You pay $7/seat, client gets $9 worth of tokens',
  },
  {
    name: 'Pro',
    price: 599,
    seatsIncluded: 100,
    overageCost: 5,
    payer: 'mentor',
    popular: false,
    features: [
      'Everything in Growth',
      '100 seats included',
      'White-glove onboarding',
      'API access',
    ],
    note: 'You pay $5/seat, client gets $9 worth of tokens',
  },
  {
    name: 'Enterprise',
    price: null,
    seatsIncluded: null,
    overageCost: null,
    payer: 'custom',
    popular: false,
    features: [
      'Unlimited seats',
      'Custom SLA',
      'Dedicated support',
      'Custom features',
    ],
    note: 'Custom pricing for large organizations',
  },
];

const clientPlans = [
  {
    name: 'Basic',
    price: 9,
    type: 'reloadable',
    popular: false,
    features: [
      'Workout logging',
      'Nutrition tracking',
      'Progress photos',
      'Token-based "Ask Pat" (runs out, must reload)',
    ],
    referralFee: false,
  },
  {
    name: 'Plus',
    price: 29,
    type: 'monthly',
    popular: false,
    features: [
      'Everything in Basic',
      'UNLIMITED "Ask Pat" queries',
      'Advanced AI insights',
    ],
    referralFee: true,
  },
  {
    name: 'Circle',
    price: 49,
    type: 'monthly',
    popular: true,
    features: [
      'Everything in Plus',
      'Join My Circle beta program',
      'EARN referral income',
      'Early feature access',
    ],
    referralFee: true,
  },
];

const faqs = [
  {
    question: 'Do my clients have to pay?',
    answer: 'Depends on your plan. On Starter, clients pay for their own Pat subscription ($9+). On Growth and Pro, you fund their initial tokens ($7 or $5 per seat), and they top up when empty.',
  },
  {
    question: 'What happens when a client\'s tokens run out?',
    answer: 'They can reload $9, upgrade to unlimited ($29), or join Circle ($49). Logging and workouts still work - just AI queries pause.',
  },
  {
    question: 'How do referral fees work?',
    answer: 'You earn ongoing fees when clients you referred subscribe to Plus ($29) or Circle ($49). Basic ($9) doesn\'t generate referrals. You keep earning even if they leave your program.',
  },
  {
    question: 'What is "Join My Circle"?',
    answer: 'Pat\'s beta program. Circle members ($49/mo) get early features and can earn income by referring others. It\'s a Pat feature - stays with the user, not tied to any mentor.',
  },
  {
    question: 'What\'s included in a "seat"?',
    answer: 'On Growth/Pro, each seat gives your client $9 worth of AI tokens. You pay $7 (Growth) or $5 (Pro) per seat - you\'re saving $2-$4 per client while funding their access.',
  },
];

function PricingCalculator() {
  const [clientCount, setClientCount] = useState([25]);
  
  const calculateCost = (count: number) => {
    const growthCost = count <= 20 ? 199 : 199 + (count - 20) * 7;
    const proCost = count <= 100 ? 599 : 599 + (count - 100) * 5;
    
    if (growthCost <= proCost) {
      const extraSeats = Math.max(0, count - 20);
      const extraCost = extraSeats * 7;
      return { 
        plan: 'Growth', 
        base: 199, 
        extra: extraCost, 
        total: growthCost, 
        perClient: (growthCost / count).toFixed(2),
        seatsIncluded: 20,
        overageRate: 7
      };
    } else {
      const extraSeats = Math.max(0, count - 100);
      const extraCost = extraSeats * 5;
      return { 
        plan: 'Pro', 
        base: 599, 
        extra: extraCost, 
        total: proCost, 
        perClient: (proCost / count).toFixed(2),
        seatsIncluded: 100,
        overageRate: 5
      };
    }
  };

  const result = calculateCost(clientCount[0]);

  return (
    <Card className="border-0 bg-background" data-testid="card-pricing-calculator">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4 mb-4">
              <span className="text-sm font-medium">How many clients do you have?</span>
              <span className="text-2xl font-bold text-primary" data-testid="text-client-count">{clientCount[0]}</span>
            </div>
            <Slider
              value={clientCount}
              onValueChange={setClientCount}
              max={200}
              min={1}
              step={1}
              className="w-full"
              data-testid="slider-client-count"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>1</span>
              <span>200</span>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" data-testid="badge-recommended-plan">Recommended: {result.plan}</Badge>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Base price</span>
                <span data-testid="text-base-price">${result.base}</span>
              </div>
              {result.plan === 'Growth' && clientCount[0] <= 20 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">20 seats included</span>
                  <span>$0</span>
                </div>
              )}
              {result.plan === 'Growth' && clientCount[0] > 20 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{clientCount[0] - 20} additional seats x $7</span>
                  <span>${result.extra}</span>
                </div>
              )}
              {result.plan === 'Pro' && clientCount[0] <= 100 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">100 seats included</span>
                  <span>$0</span>
                </div>
              )}
              {result.plan === 'Pro' && clientCount[0] > 100 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{clientCount[0] - 100} additional seats x $5</span>
                  <span>${result.extra}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-border pt-2 font-semibold">
                <span>Your monthly cost</span>
                <span className="text-primary" data-testid="text-total-cost">${result.total}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cost per client</span>
                <span className="text-muted-foreground" data-testid="text-per-client-cost">${result.perClient}/client</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
      <header className="border-b border-border sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between gap-4">
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
              {features.map((feature, idx) => (
                <Card key={feature.title} className="border-0 bg-background" data-testid={`card-feature-${idx}`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4">
                      <span className="material-symbols-outlined text-2xl">{feature.icon}</span>
                    </div>
                    <h3 className="font-semibold mb-2" data-testid={`text-feature-title-${idx}`}>{feature.title}</h3>
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
                <div key={item.step} className="text-center" data-testid={`step-${item.step}`}>
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold text-xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="font-semibold mb-2" data-testid={`text-step-title-${item.step}`}>{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="pricing" className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Mentor Pricing</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Choose the plan that fits your practice. All plans include full access to the HiPat dashboard and Pat AI.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {mentorPlans.map((plan) => (
                <Card 
                  key={plan.name} 
                  className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}
                  data-testid={`card-plan-${plan.name.toLowerCase()}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">POPULAR</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      {plan.price !== null ? (
                        <>
                          <span className="text-3xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground">/month</span>
                        </>
                      ) : (
                        <span className="text-2xl font-bold">Custom</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {plan.seatsIncluded !== null && (
                      <div className="text-center text-sm">
                        <span className="font-semibold">{plan.seatsIncluded}</span>
                        <span className="text-muted-foreground"> seats included</span>
                      </div>
                    )}
                    {plan.overageCost !== null && (
                      <div className="text-center text-sm text-muted-foreground">
                        ${plan.overageCost}/seat over {plan.seatsIncluded}
                        {plan.payer === 'client' && ' (client pays)'}
                        {plan.payer === 'mentor' && ' (you pay)'}
                      </div>
                    )}
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="material-symbols-outlined text-base text-chart-4 flex-shrink-0 mt-0.5">check_circle</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-xs text-muted-foreground text-center border-t border-border pt-4">
                      {plan.note}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={plan.price !== null ? handleGetStarted : undefined}
                      data-testid={`button-select-${plan.name.toLowerCase()}`}
                    >
                      {plan.price !== null ? 'Get Started' : 'Contact Sales'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">How Client Access Works</h2>
              <p className="text-muted-foreground">
                Understanding how your clients get access to Pat based on your plan.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-8">
              <Card data-testid="card-access-starter">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-muted-foreground">person</span>
                    Starter Plan
                  </CardTitle>
                  <CardDescription>Client pays for their own subscription</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-semibold flex-shrink-0">1</span>
                      <span className="text-sm">Client joins on FREE tier</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-semibold flex-shrink-0">2</span>
                      <span className="text-sm">Client sees: "To join [Mentor]'s program, upgrade to a paid plan"</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-semibold flex-shrink-0">3</span>
                      <span className="text-sm">Client chooses and pays: $9 (reloadable) / $29/mo / $49/mo</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-sm font-semibold flex-shrink-0">4</span>
                      <span className="text-sm">Client joins your mentor program</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>

              <Card data-testid="card-access-growth-pro">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-2xl text-primary">groups</span>
                    Growth & Pro Plans
                  </CardTitle>
                  <CardDescription>You fund initial tokens for clients</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">1</span>
                      <span className="text-sm">Client joins on FREE tier</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">2</span>
                      <span className="text-sm">Client automatically gets $9 worth of tokens (funded by you)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">3</span>
                      <span className="text-sm">Client uses tokens for "Ask Pat" AI queries</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-sm font-semibold flex-shrink-0">4</span>
                      <span className="text-sm">When tokens run out, client tops up: $9 reload / $29 unlimited / $49 Circle</span>
                    </li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold mb-4">Client Subscription Options</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Your clients choose their own level of AI access. Higher tiers generate referral revenue for you.
              </p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {clientPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={`relative ${plan.popular ? 'border-primary border-2' : ''}`}
                  data-testid={`card-client-plan-${plan.name.toLowerCase()}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground">BEST VALUE</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle>{plan.name}</CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">
                        {plan.type === 'reloadable' ? ' (reloadable)' : '/month'}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-2">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <span className="material-symbols-outlined text-base text-chart-4 flex-shrink-0 mt-0.5">check_circle</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-border pt-4">
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <span className="text-muted-foreground">Mentor referral fee:</span>
                        {plan.referralFee ? (
                          <Badge variant="outline" className="text-chart-4 border-chart-4">YES</Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">NO</Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <div className="grid md:grid-cols-2 gap-8 items-start">
              <div>
                <h2 className="text-2xl font-bold mb-4">Pricing Calculator</h2>
                <p className="text-muted-foreground mb-6">
                  Compare Growth vs Pro plans when you want to fund client tokens. For client-funded seats, choose Starter ($99).
                </p>
                <PricingCalculator />
              </div>
              <div>
                <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full" data-testid="accordion-faq">
                  {faqs.map((faq, idx) => (
                    <AccordionItem key={idx} value={`faq-${idx}`} data-testid={`accordion-item-faq-${idx}`}>
                      <AccordionTrigger className="text-left text-sm" data-testid={`button-faq-trigger-${idx}`}>
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-sm text-muted-foreground" data-testid={`text-faq-answer-${idx}`}>
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 px-4 bg-muted/30">
          <div className="container mx-auto max-w-4xl">
            <Card className="border-0 bg-background" data-testid="card-summary-table">
              <CardContent className="p-8">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm" data-testid="table-pricing-summary">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-3 pr-4 font-semibold">Mentor Plan</th>
                        <th className="text-center py-3 px-4 font-semibold">You Pay/Seat</th>
                        <th className="text-center py-3 px-4 font-semibold">Client Gets</th>
                        <th className="text-center py-3 pl-4 font-semibold">Client Top-Up</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">Starter $99</td>
                        <td className="text-center py-3 px-4 text-muted-foreground">$0 (client pays)</td>
                        <td className="text-center py-3 px-4 text-muted-foreground">-</td>
                        <td className="text-center py-3 pl-4 text-muted-foreground">$9/$29/$49 from start</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">Growth $199</td>
                        <td className="text-center py-3 px-4">$7</td>
                        <td className="text-center py-3 px-4">$9 tokens</td>
                        <td className="text-center py-3 pl-4 text-muted-foreground">When empty</td>
                      </tr>
                      <tr className="border-b border-border/50">
                        <td className="py-3 pr-4">Pro $599</td>
                        <td className="text-center py-3 px-4">$5</td>
                        <td className="text-center py-3 px-4">$9 tokens</td>
                        <td className="text-center py-3 pl-4 text-muted-foreground">When empty</td>
                      </tr>
                      <tr>
                        <td className="py-3 pr-4">Enterprise</td>
                        <td className="text-center py-3 px-4">Custom</td>
                        <td className="text-center py-3 px-4">$9 tokens</td>
                        <td className="text-center py-3 pl-4 text-muted-foreground">When empty</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="py-16 px-4">
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
        <div className="container mx-auto flex items-center justify-between gap-4 flex-wrap text-sm text-muted-foreground">
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
