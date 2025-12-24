import { Link, useLocation } from 'wouter';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
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
  { title: 'Programs', url: '/program-templates', icon: 'menu_book' },
  { title: 'Analytics', url: '/analytics', icon: 'pie_chart' },
  { title: 'Settings', url: '/settings', icon: 'settings' },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { mentorProfile, darkMode, toggleDarkMode, setUser } = useStore();

  const handleLogout = () => {
    localStorage.removeItem('hipat_user');
    setUser(null);
  };

  return (
    <Sidebar className="bg-white dark:bg-[#111722] border-r border-slate-200 dark:border-[#324467]">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary/20 p-2 rounded-lg">
            <span className="material-symbols-outlined text-primary">psychology</span>
          </div>
          <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">MentorAI</span>
        </div>
        
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-[#232f48] mb-6" data-testid="profile-card">
          <Avatar className="w-10 h-10">
            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-bold">
              {mentorProfile?.displayName?.split(' ').map(n => n[0]).join('') || 'AP'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <h3 className="text-sm font-bold truncate dark:text-white">
              {mentorProfile?.displayName || 'Dr. Alex P.'}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#92a4c9]">Pro Mentor</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="px-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex flex-col gap-2">
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
                          ? 'bg-primary/10 text-primary dark:bg-[#232f48] dark:text-white' 
                          : 'text-slate-600 dark:text-[#92a4c9] hover:bg-slate-100 dark:hover:bg-[#232f48]'
                      }`}
                    >
                      <Link href={item.url} data-testid={`link-nav-${item.title.toLowerCase().replace(' ', '-')}`}>
                        <span className={`material-symbols-outlined ${isActive ? 'fill-1' : ''}`}>
                          {item.icon}
                        </span>
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto p-6 border-t border-slate-200 dark:border-[#324467]">
        <div className="flex items-center justify-between">
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-3 px-3 py-2 text-slate-500 dark:text-[#92a4c9] hover:text-red-500 transition-colors"
            data-testid="button-logout"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="text-sm font-medium">Log Out</span>
          </button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            className="text-slate-400 dark:text-[#92a4c9] hover:text-slate-600 dark:hover:text-white"
            data-testid="button-theme-toggle"
          >
            <span className="material-symbols-outlined text-lg">
              {darkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
