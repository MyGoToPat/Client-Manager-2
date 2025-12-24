import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useStore } from '../store/useStore';

const menuItems = [
  { title: 'Dashboard', url: '/', icon: 'dashboard' },
  { title: 'Clients', url: '/clients', icon: 'group' },
  { title: 'Directives', url: '/directives', icon: 'bolt' },
  { title: 'Groups', url: '/groups', icon: 'groups' },
  { title: 'Templates', url: '/program-templates', icon: 'auto_stories' },
  { title: 'Calendar', url: '/calendar', icon: 'calendar_month' },
  { title: 'Analytics', url: '/analytics', icon: 'pie_chart' },
  { title: 'Settings', url: '/settings', icon: 'settings' },
];

const orgMenuItems = [
  { title: 'Organization', url: '/org/org-1', icon: 'business' },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { mentorProfile, darkMode, toggleDarkMode, setUser } = useStore();

  const handleLogout = () => {
    localStorage.removeItem('hipat_user');
    setUser(null);
  };

  return (
    <Sidebar className="bg-sidebar border-r border-sidebar-border">
      <SidebarHeader className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-white text-2xl">smart_toy</span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold text-sidebar-foreground">Mentor AI</span>
            <span className="text-xs text-muted-foreground">Pro Plan</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-3 py-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">
            Main
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {menuItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== '/' && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      data-active={isActive}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary dark:bg-sidebar-accent dark:text-white border-l-2 border-primary' 
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                        <span className={`material-symbols-outlined text-xl ${isActive ? 'filled' : ''}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-6">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground px-3 mb-2">
            Organization
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {orgMenuItems.map((item) => {
                const isActive = location === item.url || 
                  (item.url !== '/' && location.startsWith(item.url));
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      data-active={isActive}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                        isActive 
                          ? 'bg-primary/10 text-primary dark:bg-sidebar-accent dark:text-white border-l-2 border-primary' 
                          : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                      }`}
                    >
                      <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase()}`}>
                        <span className={`material-symbols-outlined text-xl ${isActive ? 'filled' : ''}`}>
                          {item.icon}
                        </span>
                        <span className="text-sm font-medium">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent mb-4">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {mentorProfile?.displayName?.split(' ').map(n => n[0]).join('') || 'CA'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col flex-1 min-w-0">
            <span className="text-sm font-bold text-sidebar-foreground truncate">
              {mentorProfile?.displayName || 'Coach Alex'}
            </span>
            <span className="text-xs text-muted-foreground truncate">
              {mentorProfile?.specializations?.[0] || 'Pro Mentor'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            data-testid="button-theme-toggle"
          >
            <span className="material-symbols-outlined text-xl">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="flex-shrink-0 text-muted-foreground hover:text-foreground"
            data-testid="button-logout"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
