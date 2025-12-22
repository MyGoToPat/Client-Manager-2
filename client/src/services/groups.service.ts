import type { ClientGroup, GroupPost, GroupComment, GroupType } from '../types';
import { mockClientGroups, mockGroupPosts, mockGroupComments } from '../mocks/groups.mock';

let groups = [...mockClientGroups];
let posts = [...mockGroupPosts];
let comments = [...mockGroupComments];

export const groupsService = {
  getAll: async (): Promise<ClientGroup[]> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    return groups.filter(g => !g.isArchived);
  },

  getById: async (id: string): Promise<ClientGroup | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return groups.find(g => g.id === id);
  },

  getByType: async (type: GroupType): Promise<ClientGroup[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return groups.filter(g => g.type === type && !g.isArchived);
  },

  create: async (group: Omit<ClientGroup, 'id' | 'createdAt' | 'updatedAt' | 'memberCount' | 'avgProgress' | 'avgCompliance'>): Promise<ClientGroup> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newGroup: ClientGroup = {
      ...group,
      id: `group-${Date.now()}`,
      memberCount: group.clientIds.length,
      avgProgress: 0,
      avgCompliance: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    groups.push(newGroup);
    return newGroup;
  },

  update: async (id: string, updates: Partial<ClientGroup>): Promise<ClientGroup | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    
    groups[index] = {
      ...groups[index],
      ...updates,
      memberCount: updates.clientIds?.length ?? groups[index].memberCount,
      updatedAt: new Date(),
    };
    return groups[index];
  },

  delete: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) return false;
    groups.splice(index, 1);
    return true;
  },

  archive: async (id: string): Promise<ClientGroup | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = groups.findIndex(g => g.id === id);
    if (index === -1) return undefined;
    groups[index] = { ...groups[index], isArchived: true, isActive: false, updatedAt: new Date() };
    return groups[index];
  },

  addMembers: async (id: string, clientIds: string[]): Promise<ClientGroup | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const group = groups.find(g => g.id === id);
    if (!group) return undefined;
    const uniqueIds = Array.from(new Set([...group.clientIds, ...clientIds]));
    return groupsService.update(id, { clientIds: uniqueIds });
  },

  removeMembers: async (id: string, clientIds: string[]): Promise<ClientGroup | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const group = groups.find(g => g.id === id);
    if (!group) return undefined;
    const remainingIds = group.clientIds.filter(cid => !clientIds.includes(cid));
    return groupsService.update(id, { clientIds: remainingIds });
  },

  getPosts: async (groupId: string): Promise<GroupPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    return posts.filter(p => p.groupId === groupId).sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  },

  createPost: async (post: Omit<GroupPost, 'id' | 'createdAt' | 'updatedAt' | 'viewCount' | 'reactions'>): Promise<GroupPost> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const newPost: GroupPost = {
      ...post,
      id: `post-${Date.now()}`,
      viewCount: 0,
      reactions: {},
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    posts.push(newPost);
    return newPost;
  },

  updatePost: async (id: string, updates: Partial<GroupPost>): Promise<GroupPost | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return undefined;
    posts[index] = { ...posts[index], ...updates, updatedAt: new Date() };
    return posts[index];
  },

  deletePost: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const index = posts.findIndex(p => p.id === id);
    if (index === -1) return false;
    posts.splice(index, 1);
    comments = comments.filter(c => c.postId !== id);
    return true;
  },

  addReaction: async (postId: string, userId: string, reaction: string): Promise<GroupPost | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const post = posts.find(p => p.id === postId);
    if (!post) return undefined;
    const reactions = { ...post.reactions };
    if (!reactions[reaction]) reactions[reaction] = [];
    if (!reactions[reaction].includes(userId)) {
      reactions[reaction].push(userId);
    }
    return groupsService.updatePost(postId, { reactions });
  },

  removeReaction: async (postId: string, userId: string, reaction: string): Promise<GroupPost | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    const post = posts.find(p => p.id === postId);
    if (!post) return undefined;
    const reactions = { ...post.reactions };
    if (reactions[reaction]) {
      reactions[reaction] = reactions[reaction].filter(id => id !== userId);
    }
    return groupsService.updatePost(postId, { reactions });
  },

  getComments: async (postId: string): Promise<GroupComment[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    return comments.filter(c => c.postId === postId).sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  },

  addComment: async (comment: Omit<GroupComment, 'id' | 'createdAt'>): Promise<GroupComment> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    const newComment: GroupComment = {
      ...comment,
      id: `comment-${Date.now()}`,
      createdAt: new Date(),
    };
    comments.push(newComment);
    return newComment;
  },

  deleteComment: async (id: string): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 150));
    const index = comments.findIndex(c => c.id === id);
    if (index === -1) return false;
    comments.splice(index, 1);
    return true;
  },
};
