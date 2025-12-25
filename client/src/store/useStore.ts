import { create } from 'zustand';
import type { User, MentorProfile, Client } from '../types';

interface AppState {
  user: User | null;
  mentorProfile: MentorProfile | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setMentorProfile: (profile: MentorProfile | null) => void;
  
  clients: Client[];
  selectedClientId: string | null;
  setClients: (clients: Client[]) => void;
  setSelectedClientId: (id: string | null) => void;
  updateClient: (clientId: string, updates: Partial<Client>) => void;
  
  sidebarOpen: boolean;
  clientDrawerOpen: boolean;
  darkMode: boolean;
  setSidebarOpen: (open: boolean) => void;
  setClientDrawerOpen: (open: boolean) => void;
  toggleDarkMode: () => void;
  setDarkMode: (dark: boolean) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  mentorProfile: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  setMentorProfile: (mentorProfile) => set({ mentorProfile }),
  
  clients: [],
  selectedClientId: null,
  setClients: (clients) => set({ clients }),
  setSelectedClientId: (selectedClientId) => set({ selectedClientId, clientDrawerOpen: !!selectedClientId }),
  updateClient: (clientId, updates) => set((state) => ({
    clients: state.clients.map(c => c.id === clientId ? { ...c, ...updates } : c)
  })),
  
  sidebarOpen: true,
  clientDrawerOpen: false,
  darkMode: typeof window !== 'undefined' ? localStorage.getItem('hipat_theme') === 'dark' : false,
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  setClientDrawerOpen: (clientDrawerOpen) => set({ clientDrawerOpen }),
  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    localStorage.setItem('hipat_theme', newMode ? 'dark' : 'light');
    return { darkMode: newMode };
  }),
  setDarkMode: (darkMode) => {
    localStorage.setItem('hipat_theme', darkMode ? 'dark' : 'light');
    set({ darkMode });
  }
}));
