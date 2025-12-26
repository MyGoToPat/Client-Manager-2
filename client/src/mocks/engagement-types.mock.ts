import type { EngagementType } from '../types';

export const defaultEngagementTypes: EngagementType[] = [
  {
    id: 'et-in-person',
    mentorId: 'system',
    name: 'In-Person Training',
    icon: 'fitness_center',
    dashboardBehavior: 'today',
    requiresVenue: true,
    requiresPlatform: false,
    requiresScheduling: true,
    isDefault: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'et-online',
    mentorId: 'system',
    name: 'Online 1:1 Coaching',
    icon: 'videocam',
    dashboardBehavior: 'this_week',
    requiresVenue: false,
    requiresPlatform: true,
    requiresScheduling: true,
    isDefault: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'et-program',
    mentorId: 'system',
    name: 'Program Only',
    icon: 'school',
    dashboardBehavior: 'async_only',
    requiresVenue: false,
    requiresPlatform: false,
    requiresScheduling: false,
    isDefault: true,
    isActive: true,
    createdAt: new Date('2024-01-01'),
  },
];

export const exampleCustomTypes: EngagementType[] = [
  {
    id: 'et-macro',
    mentorId: 'mentor-1',
    name: 'Macro Coaching',
    icon: 'restaurant',
    dashboardBehavior: 'this_week',
    requiresVenue: false,
    requiresPlatform: true,
    requiresScheduling: true,
    isDefault: false,
    isActive: true,
    createdAt: new Date('2024-06-15'),
  },
  {
    id: 'et-mindset',
    mentorId: 'mentor-1',
    name: 'Mindset Coaching',
    icon: 'psychology',
    dashboardBehavior: 'this_week',
    requiresVenue: false,
    requiresPlatform: true,
    requiresScheduling: true,
    isDefault: false,
    isActive: true,
    createdAt: new Date('2024-07-01'),
  },
];

export const availableIcons = [
  { name: 'fitness_center', label: 'Weights' },
  { name: 'sprint', label: 'Running' },
  { name: 'self_improvement', label: 'Yoga' },
  { name: 'sports_martial_arts', label: 'Martial Arts' },
  { name: 'restaurant', label: 'Nutrition' },
  { name: 'lunch_dining', label: 'Meal Prep' },
  { name: 'local_cafe', label: 'Lifestyle' },
  { name: 'videocam', label: 'Video Call' },
  { name: 'psychology', label: 'Mindset' },
  { name: 'school', label: 'Program' },
  { name: 'support_agent', label: 'Support' },
  { name: 'analytics', label: 'Analytics' },
  { name: 'monitoring', label: 'Monitoring' },
  { name: 'timeline', label: 'Progress' },
  { name: 'favorite', label: 'Health' },
  { name: 'bolt', label: 'Energy' },
  { name: 'emoji_events', label: 'Achievement' },
  { name: 'groups', label: 'Group' },
  { name: 'healing', label: 'Recovery' },
  { name: 'spa', label: 'Wellness' },
];

export function getEngagementTypeIdFromLegacy(type: string): string {
  switch (type) {
    case 'in_person':
      return 'et-in-person';
    case 'online_1on1':
      return 'et-online';
    case 'program_only':
      return 'et-program';
    default:
      return 'et-program';
  }
}

export function getLegacyTypeFromEngagementTypeId(id: string): 'in_person' | 'online_1on1' | 'program_only' {
  switch (id) {
    case 'et-in-person':
      return 'in_person';
    case 'et-online':
      return 'online_1on1';
    case 'et-program':
      return 'program_only';
    default:
      return 'program_only';
  }
}
