import { useEffect, useState, useCallback, createContext, useContext } from 'react';
import { Switch, Route, useLocation } from 'wouter';
import { queryClient } from './lib/queryClient';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import { ThemeProvider } from './components/theme-provider';
import { AskPatModal } from './components/ask-pat-modal';
import { useStore } from './store/useStore';
import { authService } from './services';
import NotFound from '@/pages/not-found';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/dashboard';
import Clients from './pages/clients';
import Directives from './pages/directives';
import CalendarPage from './pages/calendar';
import Analytics from './pages/analytics';
import Settings from './pages/settings';
import Landing from './pages/landing';
import OrganizationDashboard from './pages/organization';
import ReferralLanding from './pages/referral-landing';
import Groups from './pages/groups';
import GroupDetail from './pages/group-detail';
import ProgramTemplates from './pages/program-templates';
import ProgramTemplateBuilder from './pages/program-template-builder';

interface AskPatContextType {
  openAskPat: () => void;
}

const AskPatContext = createContext<AskPatContextType>({ openAskPat: () => {} });

export function useAskPat() {
  return useContext(AskPatContext);
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setUser, setMentorProfile } = useStore();
  const [, setLocation] = useLocation();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const user = await authService.getCurrentUser();
      if (user) {
        setUser(user);
        const profile = await authService.getMentorProfile(user.id);
        if (profile) {
          setMentorProfile(profile);
        }
      } else {
        setLocation('/login');
      }
    } catch (error) {
      setLocation('/login');
    } finally {
      setIsChecking(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function AppLayout({ children }: { children: React.ReactNode }) {
  const style = {
    '--sidebar-width': '16rem',
    '--sidebar-width-icon': '3rem',
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
}

function AskPatProvider({ children }: { children: React.ReactNode }) {
  const [askPatOpen, setAskPatOpen] = useState(false);
  const { isAuthenticated } = useStore();

  const openAskPat = useCallback(() => {
    if (isAuthenticated) {
      setAskPatOpen(true);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openAskPat();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [openAskPat]);

  return (
    <AskPatContext.Provider value={{ openAskPat }}>
      {children}
      {isAuthenticated && (
        <AskPatModal open={askPatOpen} onOpenChange={setAskPatOpen} />
      )}
    </AskPatContext.Provider>
  );
}

function AuthenticatedHome() {
  const { isAuthenticated } = useStore();
  
  if (!isAuthenticated) {
    return <Landing />;
  }
  
  return (
    <ProtectedRoute>
      <AppLayout>
        <Dashboard />
      </AppLayout>
    </ProtectedRoute>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/ref/:code" component={ReferralLanding} />
      <Route path="/" component={AuthenticatedHome} />
      <Route path="/dashboard">
        <ProtectedRoute>
          <AppLayout>
            <Dashboard />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/clients">
        <ProtectedRoute>
          <AppLayout>
            <Clients />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/directives">
        <ProtectedRoute>
          <AppLayout>
            <Directives />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/calendar">
        <ProtectedRoute>
          <AppLayout>
            <CalendarPage />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/analytics">
        <ProtectedRoute>
          <AppLayout>
            <Analytics />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/settings">
        <ProtectedRoute>
          <AppLayout>
            <Settings />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/org/:id">
        <ProtectedRoute>
          <AppLayout>
            <OrganizationDashboard />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/org/:id/team">
        {({ params }) => {
          window.location.replace(`/org/${params?.id || 'org-1'}?tab=team`);
          return null;
        }}
      </Route>
      <Route path="/groups">
        <ProtectedRoute>
          <AppLayout>
            <Groups />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/groups/:id">
        <ProtectedRoute>
          <AppLayout>
            <GroupDetail />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/program-templates">
        <ProtectedRoute>
          <AppLayout>
            <ProgramTemplates />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route path="/program-templates/:id">
        <ProtectedRoute>
          <AppLayout>
            <ProgramTemplateBuilder />
          </AppLayout>
        </ProtectedRoute>
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <AskPatProvider>
            <Toaster />
            <Router />
          </AskPatProvider>
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
