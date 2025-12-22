import type { ClientGroup } from '../types';

export const mockClientGroups: ClientGroup[] = [
  {
    id: 'group-1',
    mentorId: 'mentor-1',
    name: 'Weight Loss Clients',
    description: 'Clients focused on losing weight',
    color: '#3B82F6',
    icon: 'scale',
    clientIds: ['client-1', 'client-3'],
    autoAssignRules: {
      goalType: ['weight_loss'],
    },
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-01'),
  },
  {
    id: 'group-2',
    mentorId: 'mentor-1',
    name: 'Muscle Building',
    description: 'Clients focused on gaining muscle',
    color: '#8B5CF6',
    icon: 'dumbbell',
    clientIds: ['client-2', 'client-4'],
    autoAssignRules: {
      goalType: ['muscle_gain'],
    },
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
  },
  {
    id: 'group-3',
    mentorId: 'mentor-1',
    name: 'Morning Warriors',
    description: 'Clients who train in the morning',
    color: '#F59E0B',
    icon: 'sunrise',
    clientIds: ['client-1', 'client-4', 'client-5'],
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-01'),
  },
];
