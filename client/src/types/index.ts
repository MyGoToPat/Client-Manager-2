export interface User {
  id: string;
  email: string;
  role: 'mentor' | 'manager' | 'admin';
  createdAt: Date;
}

export interface MentorProfile {
  id: string;
  userId: string;
  displayName: string;
  specializations: string[];
  certifications: string[];
  bio: string;
  hourlyRate: number;
  availability: Record<string, string[]>;
  referralCode: string;
  avatarUrl: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  status: 'active' | 'inactive' | 'pending' | 'trial' | 'suspended';
  role: 'client' | 'premium' | 'enterprise';
  progress: number;
  lastLogin: string;
  joinedAt: Date;
  goals?: string[];
  metrics?: ClientMetrics;
  orgId?: string;
}

export interface ClientMetrics {
  tdee: number;
  bmr: number;
  proteinGoal: number;
  carbsGoal: number;
  fatGoal: number;
  hydrationGoal: number;
  bodyFatPercent?: number;
  weight?: number;
}

export interface ClientMentorRelationship {
  id: string;
  clientId: string;
  mentorId: string;
  orgId?: string;
  domains: ('workout' | 'nutrition' | 'mindset' | 'all')[];
  status: 'pending' | 'active' | 'paused' | 'ended';
  createdAt: Date;
}

export interface DomainAssignment {
  id: string;
  clientId: string;
  domain: 'workout' | 'nutrition' | 'mindset';
  handlerType: 'mentor' | 'pat';
  handlerId?: string;
  handlerName?: string;
}

export interface ClientPermission {
  id: string;
  clientId: string;
  mentorId: string;
  dataCategory: 'workout' | 'nutrition' | 'sleep' | 'chat' | 'progress_photos' | 'body_metrics';
  accessLevel: 'none' | 'view' | 'view_edit' | 'full';
}

export interface MentorDirective {
  id: string;
  mentorId: string;
  assignmentType: 'all' | 'group' | 'individual';
  clientId?: string;
  groupId?: string;
  name: string;
  triggerEvent: string;
  triggerConditions: Record<string, any>;
  messageTemplate: string;
  category: 'nutrition' | 'workout' | 'recovery' | 'motivation' | 'general';
  priority: 'low' | 'medium' | 'high';
  isActive: boolean;
  triggeredCount: number;
  effectivenessScore?: number;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ClientGroup {
  id: string;
  mentorId: string;
  name: string;
  description?: string;
  clientIds: string[];
  createdAt: Date;
}

export interface Organization {
  id: string;
  name: string;
  type: 'gym' | 'studio' | 'independent';
  logoUrl?: string;
  brandingConfig: Record<string, unknown>;
  createdAt: Date;
}

export interface OrgMembership {
  id: string;
  orgId: string;
  userId: string;
  mentorId: string;
  role: 'owner' | 'manager' | 'mentor';
  permissions: Record<string, unknown>;
}

export interface Booking {
  id: string;
  mentorId: string;
  clientId: string;
  clientName?: string;
  scheduledAt: Date;
  durationMinutes: number;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no_show';
  calendarEventId?: string;
  notes?: string;
}

export interface ReferralLink {
  id: string;
  mentorId: string;
  code: string;
  orgId?: string;
  clickCount: number;
  conversions: number;
  createdAt: Date;
}

export interface MentorNote {
  id: string;
  mentorId: string;
  clientId: string;
  content: string;
  visibility: 'private' | 'shared_client' | 'shared_team';
  createdAt: Date;
}

export interface AIInsight {
  id: string;
  type: 'pattern' | 'suggestion' | 'alert' | 'achievement';
  title: string;
  description: string;
  confidence: number;
  category: string;
  priority: 'low' | 'medium' | 'high';
  timestamp: Date;
  actionable?: boolean;
  suggestedAction?: string;
}

export interface ProgressData {
  date: string;
  workouts: number;
  nutrition: number;
  sleep: number;
}

export interface WorkoutPlan {
  id: string;
  name: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  durationWeeks: number;
  completionPercent: number;
  assignedDays: string[];
  status: 'active' | 'paused' | 'completed';
}
