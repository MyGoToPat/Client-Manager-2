import type { LeadGenTool, MentorToolConfig, ToolSubmission, ToolSubmissionClientData } from '@/types';
import { defaultLeadGenTools, mockMentorToolConfigs, mockToolSubmissions } from '@/mocks/lead-gen-tools.mock';

let tools: LeadGenTool[] = [...defaultLeadGenTools];
let mentorConfigs: MentorToolConfig[] = [...mockMentorToolConfigs];
let submissions: ToolSubmission[] = [...mockToolSubmissions];

function generateId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function isValidToolUrl(url: string | undefined): boolean {
  if (!url || url.trim() === '') return true;
  try {
    const parsed = new URL(url);
    return ['https:', 'http:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

function sanitizeToolUrl(url: string | undefined): string | undefined {
  if (!url || url.trim() === '') return undefined;
  if (!isValidToolUrl(url)) return undefined;
  return url.trim();
}

export const leadGenToolsService = {
  async getTools(): Promise<LeadGenTool[]> {
    return tools;
  },

  async getActiveTools(): Promise<LeadGenTool[]> {
    return tools.filter(t => t.isActive);
  },

  async getConfiguredTools(): Promise<LeadGenTool[]> {
    return tools.filter(t => t.isActive && t.isConfigured);
  },

  async getToolById(id: string): Promise<LeadGenTool | undefined> {
    return tools.find(t => t.id === id);
  },

  async createTool(input: Omit<LeadGenTool, 'id' | 'createdAt' | 'updatedAt'>): Promise<LeadGenTool> {
    const newTool: LeadGenTool = {
      ...input,
      id: generateId('tool'),
      isCustom: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    tools.push(newTool);
    return newTool;
  },

  async updateTool(id: string, updates: Partial<LeadGenTool>): Promise<LeadGenTool> {
    const index = tools.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tool not found');
    
    const sanitizedLiveUrl = sanitizeToolUrl(updates.liveUrl);
    const sanitizedSelfServiceUrl = sanitizeToolUrl(updates.selfServiceUrl);
    
    if (updates.liveUrl !== undefined && !isValidToolUrl(updates.liveUrl)) {
      throw new Error('Invalid Live URL. Only http:// and https:// URLs are allowed.');
    }
    if (updates.selfServiceUrl !== undefined && !isValidToolUrl(updates.selfServiceUrl)) {
      throw new Error('Invalid Self-Service URL. Only http:// and https:// URLs are allowed.');
    }
    
    tools[index] = {
      ...tools[index],
      ...updates,
      liveUrl: updates.liveUrl !== undefined ? sanitizedLiveUrl : tools[index].liveUrl,
      selfServiceUrl: updates.selfServiceUrl !== undefined ? sanitizedSelfServiceUrl : tools[index].selfServiceUrl,
      updatedAt: new Date(),
    };
    return tools[index];
  },

  async deleteTool(id: string): Promise<boolean> {
    const tool = tools.find(t => t.id === id);
    if (!tool || !tool.isCustom) return false;
    
    tools = tools.filter(t => t.id !== id);
    return true;
  },

  async configureTool(id: string, liveUrl: string, selfServiceUrl?: string): Promise<LeadGenTool> {
    const index = tools.findIndex(t => t.id === id);
    if (index === -1) throw new Error('Tool not found');
    
    if (liveUrl && !isValidToolUrl(liveUrl)) {
      throw new Error('Invalid Live URL. Only http:// and https:// URLs are allowed.');
    }
    if (selfServiceUrl && !isValidToolUrl(selfServiceUrl)) {
      throw new Error('Invalid Self-Service URL. Only http:// and https:// URLs are allowed.');
    }
    
    const sanitizedLiveUrl = sanitizeToolUrl(liveUrl);
    const sanitizedSelfServiceUrl = sanitizeToolUrl(selfServiceUrl);
    
    const isConfigured = Boolean(sanitizedLiveUrl);
    tools[index] = {
      ...tools[index],
      liveUrl: sanitizedLiveUrl,
      selfServiceUrl: sanitizedSelfServiceUrl,
      isConfigured,
      updatedAt: new Date(),
    };
    return tools[index];
  },

  async getMentorConfigs(mentorId: string): Promise<MentorToolConfig[]> {
    return mentorConfigs.filter(c => c.mentorId === mentorId);
  },

  async getMentorConfig(mentorId: string, toolId: string): Promise<MentorToolConfig | undefined> {
    return mentorConfigs.find(c => c.mentorId === mentorId && c.toolId === toolId);
  },

  async upsertMentorConfig(config: Omit<MentorToolConfig, 'id' | 'createdAt'>): Promise<MentorToolConfig> {
    const existingIndex = mentorConfigs.findIndex(
      c => c.mentorId === config.mentorId && c.toolId === config.toolId
    );

    if (existingIndex >= 0) {
      mentorConfigs[existingIndex] = {
        ...mentorConfigs[existingIndex],
        ...config,
      };
      return mentorConfigs[existingIndex];
    }

    const newConfig: MentorToolConfig = {
      ...config,
      id: generateId('config'),
      createdAt: new Date(),
    };
    mentorConfigs.push(newConfig);
    return newConfig;
  },

  async createSubmission(
    toolId: string,
    mentorId: string,
    clientData: ToolSubmissionClientData,
    results: Record<string, unknown>
  ): Promise<ToolSubmission> {
    const submission: ToolSubmission = {
      id: generateId('sub'),
      toolId,
      mentorId,
      clientData,
      results,
      status: 'submitted',
      submittedAt: new Date(),
    };
    submissions.push(submission);
    return submission;
  },

  async getSubmissions(mentorId: string): Promise<ToolSubmission[]> {
    return submissions.filter(s => s.mentorId === mentorId);
  },

  async getSubmissionsByTool(toolId: string, mentorId: string): Promise<ToolSubmission[]> {
    return submissions.filter(s => s.toolId === toolId && s.mentorId === mentorId);
  },

  async updateSubmissionStatus(
    id: string,
    status: ToolSubmission['status'],
    clientId?: string
  ): Promise<ToolSubmission | undefined> {
    const index = submissions.findIndex(s => s.id === id);
    if (index === -1) return undefined;

    submissions[index] = {
      ...submissions[index],
      status,
      clientId: clientId || submissions[index].clientId,
      invitedAt: status === 'invited' ? new Date() : submissions[index].invitedAt,
      signedUpAt: status === 'signed_up' ? new Date() : submissions[index].signedUpAt,
    };
    return submissions[index];
  },

  async getToolStats(toolId: string, mentorId: string): Promise<{ views: number; completed: number; signups: number }> {
    const toolSubmissions = await this.getSubmissionsByTool(toolId, mentorId);
    return {
      views: 0,
      completed: toolSubmissions.length,
      signups: toolSubmissions.filter(s => s.status === 'signed_up' || s.status === 'became_client').length,
    };
  },

  getEffectiveUrl(tool: LeadGenTool, mentorId: string, mode: 'live' | 'self-service'): string | undefined {
    const override = tool.mentorOverrides?.[mentorId];
    if (mode === 'live') {
      return override?.liveUrl || tool.liveUrl;
    }
    return override?.selfServiceUrl || tool.selfServiceUrl;
  },

  buildToolUrl(
    baseUrl: string,
    mentorId: string,
    mentorName: string,
    mode: 'live' | 'self-service',
    theme: 'light' | 'dark' = 'light'
  ): string {
    if (!baseUrl) return '';
    
    try {
      const url = new URL(baseUrl);
      
      if (!['https:', 'http:'].includes(url.protocol)) {
        return '';
      }
      
      url.searchParams.set('mentorId', mentorId);
      url.searchParams.set('mentorName', mentorName);
      url.searchParams.set('mode', mode);
      url.searchParams.set('callback', 'postMessage');
      url.searchParams.set('theme', theme);
      return url.toString();
    } catch {
      return '';
    }
  },
};
