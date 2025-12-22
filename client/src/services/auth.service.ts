import type { User, MentorProfile } from '../types';
import { mockMentorProfile } from '../mocks/mentors.mock';

export interface AuthService {
  login(email: string, password: string): Promise<User>;
  signup(email: string, password: string, role: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  getMentorProfile(userId: string): Promise<MentorProfile | null>;
  updateMentorProfile(profile: Partial<MentorProfile>): Promise<MentorProfile>;
}

export const authService: AuthService = {
  async login(email: string, _password: string): Promise<User> {
    await new Promise(r => setTimeout(r, 500));
    const user: User = {
      id: 'mentor-1',
      email,
      role: 'mentor',
      createdAt: new Date()
    };
    localStorage.setItem('hipat_user', JSON.stringify(user));
    return user;
  },

  async signup(email: string, _password: string, role: string): Promise<User> {
    await new Promise(r => setTimeout(r, 500));
    const user: User = {
      id: 'mentor-' + Date.now(),
      email,
      role: role as User['role'],
      createdAt: new Date()
    };
    localStorage.setItem('hipat_user', JSON.stringify(user));
    return user;
  },

  async logout(): Promise<void> {
    await new Promise(r => setTimeout(r, 200));
    localStorage.removeItem('hipat_user');
  },

  async getCurrentUser(): Promise<User | null> {
    const stored = localStorage.getItem('hipat_user');
    if (stored) {
      const user = JSON.parse(stored);
      user.createdAt = new Date(user.createdAt);
      return user;
    }
    return null;
  },

  async getMentorProfile(_userId: string): Promise<MentorProfile | null> {
    await new Promise(r => setTimeout(r, 300));
    return mockMentorProfile;
  },

  async updateMentorProfile(profile: Partial<MentorProfile>): Promise<MentorProfile> {
    await new Promise(r => setTimeout(r, 400));
    return { ...mockMentorProfile, ...profile };
  }
};
