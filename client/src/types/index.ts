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
  lastActive: string;
  joinedAt: Date;
  goals?: string[];
  metrics?: ClientMetrics;
  orgId?: string;
  groups?: string[];
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

export type TriggerEvent = 
  | 'workout_completed'
  | 'workout_missed'
  | 'meal_logged'
  | 'day_end'
  | 'week_end'
  | 'streak_milestone'
  | 'weight_logged'
  | 'goal_achieved'
  | 'check_in_time'
  | 'rest_day'
  | 'before_workout'
  | 'app_opened'
  | 'inactive_period';

export type DataPoint =
  | 'workout_summary'
  | 'workout_volume'
  | 'workout_duration'
  | 'exercises_completed'
  | 'intensity_rating'
  | 'calories_burned'
  | 'protein_intake'
  | 'calorie_intake'
  | 'water_intake'
  | 'sleep_hours'
  | 'sleep_quality'
  | 'weight'
  | 'body_measurements'
  | 'streak_count'
  | 'weekly_compliance'
  | 'mood_rating'
  | 'energy_level'
  | 'progress_photos'
  | 'personal_records';

export interface DataPointConfig {
  dataPoint: DataPoint;
  comparison?: 'previous' | 'average' | 'goal' | 'best';
  timeframe?: 'today' | 'this_week' | 'this_month' | 'last_7_days' | 'last_30_days';
}

export interface DirectiveTrigger {
  event?: TriggerEvent;
  eventConditions?: Record<string, any>;
  schedule?: {
    type: 'daily' | 'weekly' | 'monthly';
    time?: string;
    days?: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[];
    dayOfMonth?: number;
  };
  condition?: {
    metric: string;
    operator: 'above' | 'below' | 'equals' | 'missing_for';
    value: number;
    unit?: string;
  };
}

export interface DirectiveAction {
  actionType: 'analyze' | 'summarize' | 'compare' | 'alert' | 'remind' | 'encourage' | 'ask' | 'deliver_message';
  analysisInstructions?: string;
  compareWith?: 'last_session' | 'last_week' | 'baseline' | 'goal';
  highlightImprovements?: boolean;
  highlightConcerns?: boolean;
  questions?: string[];
  alertCondition?: string;
  reminderType?: 'water' | 'meal' | 'photos' | 'workout' | 'sleep' | 'custom';
  customMessage?: string;
}

export type DirectiveType = 'analysis' | 'summary' | 'alert' | 'reminder' | 'encouragement' | 'check_in' | 'coaching_cue';

export interface MentorDirective {
  id: string;
  mentorId: string;
  name: string;
  description?: string;
  assignmentType: 'all' | 'group' | 'individual';
  clientId?: string;
  groupId?: string;
  directiveType: DirectiveType;
  trigger: DirectiveTrigger;
  dataPoints: DataPointConfig[];
  action: DirectiveAction;
  recipients: {
    sendToClient: boolean;
    sendToMentor: boolean;
  };
  delivery: {
    tone: 'encouraging' | 'neutral' | 'direct' | 'celebratory';
    urgency: 'low' | 'medium' | 'high';
    format: 'brief' | 'detailed' | 'bullet_points';
  };
  customMessage?: string;
  isActive: boolean;
  category: 'workout' | 'nutrition' | 'recovery' | 'motivation' | 'general';
  triggeredCount: number;
  effectivenessScore?: number;
  lastTriggered?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type GroupType = 
  | 'program_cohort'  // Running through a structured program
  | 'custom'          // General grouping (e.g., "Morning Warriors")
  | 'promotion'       // Limited-time promotional group
  | 'organization';   // Gym/studio based group

export interface ProgramInfo {
  templateId?: string;
  name: string;
  durationWeeks: number;
  startDate: Date;
  currentWeek: number;
  endDate?: Date;
}

export interface ClientGroup {
  id: string;
  mentorId: string;
  name: string;
  description?: string;
  type: GroupType;
  color?: string;
  icon?: string;
  program?: ProgramInfo;
  clientIds: string[];
  maxCapacity?: number;
  isActive: boolean;
  isArchived: boolean;
  allowNewMembers: boolean;
  memberCount: number;
  avgProgress: number;
  avgCompliance: number;
  autoAssignRules?: {
    goalType?: string[];
    activityLevel?: string[];
    subscriptionTier?: string[];
  };
  modules?: ProgramModule[];
  directives?: TemplateDirective[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupPostAttachment {
  type: 'image' | 'video' | 'file' | 'link';
  url: string;
  name?: string;
}

export interface GroupPost {
  id: string;
  groupId: string;
  mentorId: string;
  title?: string;
  content: string;
  attachments?: GroupPostAttachment[];
  isPinned: boolean;
  notifyMembers: boolean;
  viewCount: number;
  reactions: Record<string, string[]>;
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupComment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  userType: 'mentor' | 'client';
  content: string;
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

// Dashboard Types
export interface ClientActivity {
  id: string;
  clientId: string;
  clientName: string;
  type: 'workout_completed' | 'message_sent' | 'meal_logged' | 'streak_milestone' | 'check_in' | 'joined_group';
  description: string;
  timestamp: Date;
  metadata?: Record<string, unknown>;
}

export interface BusinessStats {
  mrr: number;
  mrrChange: number;
  newClients: number;
  churnedClients: number;
  avgCompliance: number;
  complianceChange: number;
  revenuePerClient: number;
}

export interface NeedsAttentionClient {
  client: Client;
  complianceDrop: number;
  previousCompliance: number;
  currentCompliance: number;
  daysSinceActive: number;
  reason: string;
}

// Program Template Types
export type PatInsightType = 'positive' | 'optimization' | 'data_trend';

export interface PatInsight {
  type: PatInsightType;
  label: string;
  message: string;
}

export interface ProgramTemplate {
  id: string;
  mentorId: string;
  name: string;
  description: string;
  coverImage?: string;
  coverGradient?: string;
  durationWeeks: number;
  modules: ProgramModule[];
  directives: TemplateDirective[];
  requireSequentialCompletion: boolean;
  allowSelfEnroll: boolean;
  price?: number;
  timesUsed: number;
  avgCompletionRate: number;
  activeUsers: number;
  patInsight?: PatInsight;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProgramModule {
  id: string;
  week: number;
  day?: number;
  title: string;
  description?: string;
  type: 'video' | 'pdf' | 'workout' | 'quiz' | 'checkin' | 'text';
  content: {
    url?: string;
    videoUrl?: string;
    pdfUrl?: string;
    workoutId?: string;
    textContent?: string;
    questions?: QuizQuestion[];
  };
  requiresCompletion: boolean;
  estimatedMinutes?: number;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'text' | 'scale';
  options?: string[];
  correctAnswer?: string;
}

export interface ProgramOffset {
  week: number;
  day: number;
}

export interface TemplateDirective {
  id: string;
  name: string;
  description: string;
  triggerType?: 'program' | 'event' | 'schedule';
  programOffset?: ProgramOffset;
  week?: number;
  day?: number;
  eventType?: string;
  directiveType: string;
  action: DirectiveAction;
  delivery: {
    tone: string;
    format: string;
  };
}

// Calendar & Availability Types
export interface Availability {
  id: string;
  mentorId: string;
  dayOfWeek: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  startTime: string;
  endTime: string;
  isActive: boolean;
}

export interface BookingSettings {
  mentorId: string;
  defaultSessionLength: number;
  bufferBetweenSessions: number;
  minimumNotice: number;
  maximumAdvanceBooking: number;
  defaultMeetingType: 'in_person' | 'zoom' | 'google_meet';
  zoomConnected: boolean;
  googleMeetConnected: boolean;
  autoGenerateMeetingLink: boolean;
  sendReminder24h: boolean;
  sendReminder1h: boolean;
}

export interface BlockedTime {
  id: string;
  mentorId: string;
  date: Date;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  reason?: string;
}

// Analytics Types
export interface AnalyticsData {
  mrr: number;
  mrrChange: number;
  revenueByMonth: { month: string; revenue: number }[];
  revenueBySource: { source: string; amount: number; percentage: number }[];
  totalClients: number;
  activeClients: number;
  newClientsThisMonth: number;
  churnedClientsThisMonth: number;
  churnRate: number;
  retentionRate: number;
  avgClientLifespan: number;
  revenuePerClient: number;
  ltv: number;
  avgCompliance: number;
  complianceChange: number;
  sessionsCompleted: number;
  directivesTriggered: number;
  avgDirectiveEffectiveness: number;
  complianceByGroup: { groupName: string; compliance: number }[];
  retentionCohort: { month: string; retained: number }[];
  topClientsByLtv: { client: Client; ltv: number }[];
  atRiskClients: { client: Client; compliance: number }[];
}
