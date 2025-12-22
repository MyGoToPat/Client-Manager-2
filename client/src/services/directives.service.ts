import type { PTDirective } from '../types';
import { mockDirectives } from '../mocks/directives.mock';

export interface DirectivesService {
  getDirectives(mentorId: string): Promise<PTDirective[]>;
  getDirectivesByClient(clientId: string): Promise<PTDirective[]>;
  createDirective(directive: Omit<PTDirective, 'id' | 'triggeredCount' | 'createdAt'>): Promise<PTDirective>;
  updateDirective(id: string, updates: Partial<PTDirective>): Promise<PTDirective>;
  deleteDirective(id: string): Promise<void>;
  toggleDirectiveActive(id: string): Promise<PTDirective>;
}

let directivesData = [...mockDirectives];

export const directivesService: DirectivesService = {
  async getDirectives(_mentorId: string): Promise<PTDirective[]> {
    await new Promise(r => setTimeout(r, 400));
    return directivesData;
  },

  async getDirectivesByClient(clientId: string): Promise<PTDirective[]> {
    await new Promise(r => setTimeout(r, 300));
    return directivesData.filter(d => d.clientId === clientId || !d.clientId);
  },

  async createDirective(directive: Omit<PTDirective, 'id' | 'triggeredCount' | 'createdAt'>): Promise<PTDirective> {
    await new Promise(r => setTimeout(r, 500));
    const newDirective: PTDirective = {
      ...directive,
      id: 'directive-' + Date.now(),
      triggeredCount: 0,
      createdAt: new Date()
    };
    directivesData.push(newDirective);
    return newDirective;
  },

  async updateDirective(id: string, updates: Partial<PTDirective>): Promise<PTDirective> {
    await new Promise(r => setTimeout(r, 400));
    const index = directivesData.findIndex(d => d.id === id);
    if (index !== -1) {
      directivesData[index] = { ...directivesData[index], ...updates };
      return directivesData[index];
    }
    throw new Error('Directive not found');
  },

  async deleteDirective(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    directivesData = directivesData.filter(d => d.id !== id);
  },

  async toggleDirectiveActive(id: string): Promise<PTDirective> {
    await new Promise(r => setTimeout(r, 300));
    const index = directivesData.findIndex(d => d.id === id);
    if (index !== -1) {
      directivesData[index] = { 
        ...directivesData[index], 
        isActive: !directivesData[index].isActive 
      };
      return directivesData[index];
    }
    throw new Error('Directive not found');
  }
};
