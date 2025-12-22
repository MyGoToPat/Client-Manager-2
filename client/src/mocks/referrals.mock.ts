import type { ReferralLink } from '../types';

export const mockReferralLinks: ReferralLink[] = [
  { 
    id: 'ref-1', 
    mentorId: 'mentor-1', 
    code: 'coach-alex-123',
    orgId: undefined,
    clickCount: 47,
    conversions: 12,
    createdAt: new Date('2024-06-01')
  },
  { 
    id: 'ref-2', 
    mentorId: 'mentor-2', 
    code: 'dr-sarah-456',
    orgId: 'org-1',
    clickCount: 23,
    conversions: 7,
    createdAt: new Date('2024-07-15')
  },
];
