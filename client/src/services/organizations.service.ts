import type { Organization, OrgMembership, DomainAssignment } from '../types';
import { mockOrganizations, mockOrgMemberships, mockDomainAssignments, mockTeamMentors } from '../mocks/organizations.mock';

export interface OrganizationsService {
  getOrganization(orgId: string): Promise<Organization | null>;
  getOrganizations(userId: string): Promise<Organization[]>;
  getOrgMemberships(orgId: string): Promise<OrgMembership[]>;
  getUserMemberships(userId: string): Promise<OrgMembership[]>;
  getTeamMentors(orgId: string): Promise<typeof mockTeamMentors>;
  getDomainAssignments(clientId: string): Promise<DomainAssignment[]>;
  updateDomainAssignment(assignmentId: string, updates: Partial<DomainAssignment>): Promise<DomainAssignment>;
}

let domainAssignmentsData = [...mockDomainAssignments];

export const organizationsService: OrganizationsService = {
  async getOrganization(orgId: string): Promise<Organization | null> {
    await new Promise(r => setTimeout(r, 200));
    return mockOrganizations.find(o => o.id === orgId) || null;
  },

  async getOrganizations(_userId: string): Promise<Organization[]> {
    await new Promise(r => setTimeout(r, 300));
    return mockOrganizations;
  },

  async getOrgMemberships(orgId: string): Promise<OrgMembership[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockOrgMemberships.filter(m => m.orgId === orgId);
  },

  async getUserMemberships(userId: string): Promise<OrgMembership[]> {
    await new Promise(r => setTimeout(r, 200));
    return mockOrgMemberships.filter(m => m.userId === userId);
  },

  async getTeamMentors(_orgId: string): Promise<typeof mockTeamMentors> {
    await new Promise(r => setTimeout(r, 300));
    return mockTeamMentors;
  },

  async getDomainAssignments(clientId: string): Promise<DomainAssignment[]> {
    await new Promise(r => setTimeout(r, 200));
    return domainAssignmentsData.filter(d => d.clientId === clientId);
  },

  async updateDomainAssignment(assignmentId: string, updates: Partial<DomainAssignment>): Promise<DomainAssignment> {
    await new Promise(r => setTimeout(r, 300));
    const index = domainAssignmentsData.findIndex(d => d.id === assignmentId);
    if (index !== -1) {
      domainAssignmentsData[index] = { ...domainAssignmentsData[index], ...updates };
      return domainAssignmentsData[index];
    }
    throw new Error('Domain assignment not found');
  }
};
