import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useStore } from '../store/useStore';
import { authService } from '../services';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { setUser, setMentorProfile } = useStore();
  const [email, setEmail] = useState('info@hipat.app');
  const [password, setPassword] = useState('admin123');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (loginEmail: string, loginPassword: string) => {
    setIsLoading(true);
    try {
      const user = await authService.login(loginEmail, loginPassword);
      setUser(user);
      
      const profile = await authService.getMentorProfile(user.id);
      if (profile) {
        setMentorProfile(profile);
      }
      
      toast({
        title: 'Welcome back!',
        description: 'Successfully logged in.',
      });
      setLocation('/');
    } catch (error) {
      toast({
        title: 'Login failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    await handleLogin(email, password);
  };

  const handleGetStarted = () => {
    handleLogin('info@hipat.app', 'admin123');
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-primary text-primary-foreground mb-4">
            <span className="material-symbols-outlined text-3xl">smart_toy</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">HiPat</h1>
          <p className="text-muted-foreground">Client Management Tool</p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>Sign in to your mentor account</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <span className="material-symbols-outlined text-base absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">mail</span>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <span className="material-symbols-outlined text-base absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">lock</span>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="pl-10"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    data-testid="input-password"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading} data-testid="button-login">
                {isLoading ? 'Signing in...' : 'Sign in'}
                <span className="material-symbols-outlined text-base ml-2">arrow_forward</span>
              </Button>
            </form>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or</span>
              </div>
            </div>

            <Button 
              variant="outline" 
              className="w-full" 
              disabled={isLoading}
              onClick={handleGetStarted}
              data-testid="button-get-started"
            >
              Get Started (Demo)
              <span className="material-symbols-outlined text-base ml-2">arrow_forward</span>
            </Button>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link href="/signup" className="text-primary hover:underline" data-testid="link-signup">
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Demo credentials: info@hipat.app / admin123
        </p>
      </div>
    </div>
  );
}
