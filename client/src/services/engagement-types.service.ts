import type { EngagementType } from '../types';
import { defaultEngagementTypes, exampleCustomTypes } from '../mocks/engagement-types.mock';

let customTypesData: EngagementType[] = [...exampleCustomTypes];

export interface EngagementTypesService {
  getEngagementTypes(mentorId: string): Promise<EngagementType[]>;
  getEngagementTypeById(id: string): Promise<EngagementType | undefined>;
  createEngagementType(type: Omit<EngagementType, 'id' | 'createdAt'>): Promise<EngagementType>;
  updateEngagementType(id: string, updates: Partial<EngagementType>): Promise<EngagementType>;
  deleteEngagementType(id: string): Promise<void>;
}

export const engagementTypesService: EngagementTypesService = {
  async getEngagementTypes(mentorId: string): Promise<EngagementType[]> {
    await new Promise(r => setTimeout(r, 100));
    return [
      ...defaultEngagementTypes,
      ...customTypesData.filter(t => t.mentorId === mentorId),
    ];
  },

  async getEngagementTypeById(id: string): Promise<EngagementType | undefined> {
    await new Promise(r => setTimeout(r, 50));
    const allTypes = [...defaultEngagementTypes, ...customTypesData];
    return allTypes.find(t => t.id === id);
  },

  async createEngagementType(type: Omit<EngagementType, 'id' | 'createdAt'>): Promise<EngagementType> {
    await new Promise(r => setTimeout(r, 200));
    const newType: EngagementType = {
      ...type,
      id: 'et-' + Date.now(),
      createdAt: new Date(),
    };
    customTypesData.push(newType);
    return newType;
  },

  async updateEngagementType(id: string, updates: Partial<EngagementType>): Promise<EngagementType> {
    await new Promise(r => setTimeout(r, 200));
    
    const defaultType = defaultEngagementTypes.find(t => t.id === id);
    if (defaultType) {
      return { ...defaultType, ...updates };
    }
    
    const index = customTypesData.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Type not found');
    customTypesData[index] = { ...customTypesData[index], ...updates };
    return customTypesData[index];
  },

  async deleteEngagementType(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 150));
    const defaultType = defaultEngagementTypes.find(t => t.id === id);
    if (defaultType) throw new Error('Cannot delete default type');
    
    const index = customTypesData.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Type not found');
    customTypesData.splice(index, 1);
  },
};
