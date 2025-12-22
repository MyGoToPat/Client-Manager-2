import type { ClientGroup } from '../types';

export const mockClientGroups: ClientGroup[] = [
  {
    id: 'group-1',
    mentorId: 'mentor-1',
    name: 'Weight Loss Clients',
    description: 'Clients focused on losing weight',
    clientIds: ['client-1', 'client-3'],
    createdAt: new Date('2024-06-01')
  },
  {
    id: 'group-2',
    mentorId: 'mentor-1',
    name: 'Muscle Building',
    description: 'Clients focused on gaining muscle',
    clientIds: ['client-2', 'client-4'],
    createdAt: new Date('2024-06-15')
  },
  {
    id: 'group-3',
    mentorId: 'mentor-1',
    name: 'Morning Warriors',
    description: 'Clients who train in the morning',
    clientIds: ['client-1', 'client-4', 'client-5'],
    createdAt: new Date('2024-07-01')
  },
];
