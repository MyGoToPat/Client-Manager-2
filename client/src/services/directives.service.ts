import type { MentorDirective } from '../types';
import { mockDirectives } from '../mocks/directives.mock';

export interface DirectivesService {
  getDirectives(mentorId: string): Promise<MentorDirective[]>;
  getDirectivesByClient(clientId: string): Promise<MentorDirective[]>;
  createDirective(directive: Omit<MentorDirective, 'id' | 'triggeredCount' | 'effectivenessScore' | 'lastTriggered' | 'createdAt' | 'updatedAt'>): Promise<MentorDirective>;
  updateDirective(id: string, updates: Partial<MentorDirective>): Promise<MentorDirective>;
  deleteDirective(id: string): Promise<void>;
  toggleDirectiveActive(id: string): Promise<MentorDirective>;
  duplicateDirective(id: string): Promise<MentorDirective>;
}

let directivesData = [...mockDirectives];

export const directivesService: DirectivesService = {
  async getDirectives(_mentorId: string): Promise<MentorDirective[]> {
    await new Promise(r => setTimeout(r, 400));
    return directivesData;
  },

  async getDirectivesByClient(clientId: string): Promise<MentorDirective[]> {
    await new Promise(r => setTimeout(r, 300));
    return directivesData.filter(d => 
      d.assignmentType === 'all' || 
      d.clientId === clientId
    );
  },

  async createDirective(directive: Omit<MentorDirective, 'id' | 'triggeredCount' | 'effectivenessScore' | 'lastTriggered' | 'createdAt' | 'updatedAt'>): Promise<MentorDirective> {
    await new Promise(r => setTimeout(r, 500));
    const newDirective: MentorDirective = {
      ...directive,
      id: 'directive-' + Date.now(),
      triggeredCount: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    directivesData.push(newDirective);
    return newDirective;
  },

  async updateDirective(id: string, updates: Partial<MentorDirective>): Promise<MentorDirective> {
    await new Promise(r => setTimeout(r, 400));
    const index = directivesData.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Directive not found');
    directivesData[index] = { 
      ...directivesData[index], 
      ...updates, 
      updatedAt: new Date() 
    };
    return directivesData[index];
  },

  async deleteDirective(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = directivesData.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Directive not found');
    directivesData.splice(index, 1);
  },

  async toggleDirectiveActive(id: string): Promise<MentorDirective> {
    await new Promise(r => setTimeout(r, 300));
    const index = directivesData.findIndex(d => d.id === id);
    if (index === -1) throw new Error('Directive not found');
    directivesData[index] = { 
      ...directivesData[index], 
      isActive: !directivesData[index].isActive,
      updatedAt: new Date()
    };
    return directivesData[index];
  },

  async duplicateDirective(id: string): Promise<MentorDirective> {
    await new Promise(r => setTimeout(r, 400));
    const original = directivesData.find(d => d.id === id);
    if (!original) throw new Error('Directive not found');
    const duplicate: MentorDirective = {
      ...original,
      id: 'directive-' + Date.now(),
      name: original.name + ' (Copy)',
      triggeredCount: 0,
      effectivenessScore: undefined,
      lastTriggered: undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    directivesData.push(duplicate);
    return duplicate;
  },
};
