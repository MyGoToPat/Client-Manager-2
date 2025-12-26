import type { Client, ClientPermission, AIInsight, ProgressData, WorkoutPlan } from '../types';
import { mockClients, mockProgressData, mockInsights, mockPermissions, mockWorkoutPlans } from '../mocks/clients.mock';

export interface ClientsService {
  getClients(mentorId: string): Promise<Client[]>;
  getClient(clientId: string): Promise<Client | null>;
  getClientProgress(clientId: string, days: number): Promise<ProgressData[]>;
  getClientInsights(clientId: string): Promise<AIInsight[]>;
  getClientPermissions(clientId: string, mentorId: string): Promise<ClientPermission[]>;
  updateClientPermission(permission: Partial<ClientPermission>): Promise<ClientPermission>;
  inviteClient(email: string, mentorId: string): Promise<{ inviteLink: string }>;
  updateClientStatus(clientId: string, status: Client['status']): Promise<Client>;
  getWorkoutPlans(clientId: string): Promise<WorkoutPlan[]>;
  createClient(client: Partial<Client>): Promise<Client>;
}

let clientsData = [...mockClients];

export const clientsService: ClientsService = {
  async getClients(_mentorId: string): Promise<Client[]> {
    await new Promise(r => setTimeout(r, 400));
    return clientsData;
  },

  async getClient(clientId: string): Promise<Client | null> {
    await new Promise(r => setTimeout(r, 300));
    return clientsData.find(c => c.id === clientId) || null;
  },

  async getClientProgress(_clientId: string, _days: number): Promise<ProgressData[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockProgressData;
  },

  async getClientInsights(_clientId: string): Promise<AIInsight[]> {
    await new Promise(r => setTimeout(r, 500));
    return mockInsights;
  },

  async getClientPermissions(_clientId: string, _mentorId: string): Promise<ClientPermission[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockPermissions;
  },

  async updateClientPermission(permission: Partial<ClientPermission>): Promise<ClientPermission> {
    await new Promise(r => setTimeout(r, 300));
    return permission as ClientPermission;
  },

  async inviteClient(_email: string, _mentorId: string): Promise<{ inviteLink: string }> {
    await new Promise(r => setTimeout(r, 400));
    return { inviteLink: `https://hipat.app/invite/${Date.now()}` };
  },

  async updateClientStatus(clientId: string, status: Client['status']): Promise<Client> {
    await new Promise(r => setTimeout(r, 300));
    const clientIndex = clientsData.findIndex(c => c.id === clientId);
    if (clientIndex !== -1) {
      clientsData[clientIndex] = { ...clientsData[clientIndex], status };
      return clientsData[clientIndex];
    }
    throw new Error('Client not found');
  },

  async getWorkoutPlans(_clientId: string): Promise<WorkoutPlan[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockWorkoutPlans;
  },

  async createClient(clientData: Partial<Client>): Promise<Client> {
    await new Promise(r => setTimeout(r, 400));
    const newClient: Client = {
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: clientData.name || 'New Client',
      email: clientData.email || '',
      phone: clientData.phone,
      avatarUrl: clientData.avatarUrl,
      status: clientData.status || 'pending',
      role: clientData.role || 'client',
      progress: clientData.progress || 0,
      lastLogin: clientData.lastLogin || new Date().toISOString(),
      lastActive: clientData.lastActive || new Date().toISOString(),
      joinedAt: clientData.joinedAt || new Date(),
      goals: clientData.goals,
      metrics: clientData.metrics,
      engagementTypeId: clientData.engagementTypeId,
      patStatus: 'steady',
      compliancePercent: 0,
    };
    clientsData.push(newClient);
    return newClient;
  }
};
