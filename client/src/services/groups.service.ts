import type { ClientGroup } from '../types';
import { mockClientGroups } from '../mocks/groups.mock';

export interface GroupsService {
  getGroups(mentorId: string): Promise<ClientGroup[]>;
  getGroup(id: string): Promise<ClientGroup | null>;
}

export const groupsService: GroupsService = {
  async getGroups(mentorId: string): Promise<ClientGroup[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockClientGroups.filter(g => g.mentorId === mentorId);
  },

  async getGroup(id: string): Promise<ClientGroup | null> {
    await new Promise(r => setTimeout(r, 200));
    return mockClientGroups.find(g => g.id === id) || null;
  },
};
