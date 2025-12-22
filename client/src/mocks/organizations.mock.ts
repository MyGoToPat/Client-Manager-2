import type { Organization, OrgMembership, DomainAssignment } from '../types';

export const mockOrganizations: Organization[] = [
  { 
    id: 'org-1', 
    name: 'FitLife Gym', 
    type: 'gym',
    logoUrl: undefined,
    brandingConfig: { primaryColor: '#3B82F6' },
    createdAt: new Date('2023-01-01') 
  },
  { 
    id: 'org-2', 
    name: 'Wellness Studio', 
    type: 'studio',
    logoUrl: undefined,
    brandingConfig: { primaryColor: '#10B981' },
    createdAt: new Date('2023-06-15') 
  },
];

export const mockOrgMemberships: OrgMembership[] = [
  { id: 'mem-1', orgId: 'org-1', userId: 'user-1', mentorId: 'mentor-1', role: 'owner', permissions: {} },
  { id: 'mem-2', orgId: 'org-1', userId: 'user-2', mentorId: 'mentor-2', role: 'mentor', permissions: {} },
  { id: 'mem-3', orgId: 'org-1', userId: 'user-3', mentorId: 'mentor-3', role: 'mentor', permissions: {} },
];

export const mockDomainAssignments: DomainAssignment[] = [
  { id: 'da-1', clientId: 'client-1', domain: 'workout', handlerType: 'mentor', handlerId: 'mentor-1', handlerName: 'Coach Alex' },
  { id: 'da-2', clientId: 'client-1', domain: 'nutrition', handlerType: 'pat', handlerId: undefined, handlerName: undefined },
  { id: 'da-3', clientId: 'client-1', domain: 'mindset', handlerType: 'pat', handlerId: undefined, handlerName: undefined },
  { id: 'da-4', clientId: 'client-2', domain: 'workout', handlerType: 'mentor', handlerId: 'mentor-1', handlerName: 'Coach Alex' },
  { id: 'da-5', clientId: 'client-2', domain: 'nutrition', handlerType: 'mentor', handlerId: 'mentor-2', handlerName: 'Dr. Sarah' },
  { id: 'da-6', clientId: 'client-2', domain: 'mindset', handlerType: 'pat', handlerId: undefined, handlerName: undefined },
  { id: 'da-7', clientId: 'client-3', domain: 'workout', handlerType: 'pat', handlerId: undefined, handlerName: undefined },
  { id: 'da-8', clientId: 'client-3', domain: 'nutrition', handlerType: 'pat', handlerId: undefined, handlerName: undefined },
  { id: 'da-9', clientId: 'client-3', domain: 'mindset', handlerType: 'mentor', handlerId: 'mentor-3', handlerName: 'Dr. Mike' },
];

export const mockTeamMentors = [
  { id: 'mentor-1', name: 'Coach Alex', role: 'owner', avatarUrl: undefined, clientCount: 12, lastActive: '2 hours ago', specializations: ['Strength Training', 'HIIT'] },
  { id: 'mentor-2', name: 'Dr. Sarah', role: 'mentor', avatarUrl: undefined, clientCount: 8, lastActive: '1 day ago', specializations: ['Nutrition', 'Weight Loss'] },
  { id: 'mentor-3', name: 'Dr. Mike', role: 'mentor', avatarUrl: undefined, clientCount: 5, lastActive: '3 hours ago', specializations: ['Mindset', 'Recovery'] },
];
