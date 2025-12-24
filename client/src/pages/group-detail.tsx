import { useState, useEffect } from 'react';
import { Link, useRoute } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Header } from '@/components/header';
import { groupsService } from '../services/groups.service';
import { clientsService } from '../services/clients.service';
import type { ClientGroup, GroupPost, GroupComment, Client } from '../types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const reactionIcons: Record<string, string> = {
  thumbsup: 'thumb_up',
  heart: 'favorite',
  fire: 'local_fire_department',
  trophy: 'emoji_events',
};

function OverviewTab({ group }: { group: ClientGroup }) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {group.program && (
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <span className="material-symbols-outlined text-base">calendar_month</span>
                <span className="text-sm">Current Week</span>
              </div>
              <div className="text-2xl font-bold">
                {group.program.currentWeek}/{group.program.durationWeeks}
              </div>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="material-symbols-outlined text-base">group</span>
              <span className="text-sm">Members</span>
            </div>
            <div className="text-2xl font-bold">{group.memberCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span className="text-sm">Compliance</span>
            </div>
            <div className="text-2xl font-bold">{group.avgCompliance}%</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <span className="material-symbols-outlined text-base">trending_up</span>
              <span className="text-sm">Avg Progress</span>
            </div>
            <div className="text-2xl font-bold">+{group.avgProgress}%</div>
          </CardContent>
        </Card>
      </div>

      {group.program && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Program Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 overflow-x-auto pb-2">
              {Array.from({ length: group.program.durationWeeks }).map((_, i) => {
                const week = i + 1;
                const isPast = week < group.program!.currentWeek;
                const isCurrent = week === group.program!.currentWeek;
                return (
                  <div key={week} className="flex items-center">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium",
                        isPast && "bg-primary text-primary-foreground",
                        isCurrent && "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background",
                        !isPast && !isCurrent && "bg-muted text-muted-foreground"
                      )}
                    >
                      W{week}
                    </div>
                    {week < group.program!.durationWeeks && (
                      <div className={cn(
                        "w-4 h-0.5",
                        isPast ? "bg-primary" : "bg-muted"
                      )} />
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-2">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 flex-wrap">
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined text-base mr-2">chat</span>
              Post Announcement
            </Button>
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined text-base mr-2">bolt</span>
              Create Directive
            </Button>
            <Button variant="outline" size="sm">
              <span className="material-symbols-outlined text-base mr-2">add</span>
              Add Members
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MembersTab({ group }: { group: ClientGroup }) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadClients();
  }, [group.clientIds]);

  const loadClients = async () => {
    setLoading(true);
    try {
      const allClients = await clientsService.getClients('mentor-1');
      const members = allClients.filter(c => group.clientIds.includes(c.id));
      setClients(members);
    } catch (error) {
      console.error('Failed to load clients:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading members...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">
          {clients.length} member{clients.length !== 1 ? 's' : ''}
        </h3>
        <Button variant="outline" size="sm">
          <span className="material-symbols-outlined text-base mr-2">add</span>
          Add Members
        </Button>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {clients.map(client => (
          <Card key={client.id} className="hover-elevate">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback>
                    {client.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{client.name}</div>
                  <div className="text-sm text-muted-foreground truncate">{client.email}</div>
                </div>
                <Badge variant={client.status === 'active' ? 'default' : 'secondary'}>
                  {client.status}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

function MessageBoardTab({ group }: { group: ClientGroup }) {
  const [posts, setPosts] = useState<GroupPost[]>([]);
  const [comments, setComments] = useState<Record<string, GroupComment[]>>({});
  const [loading, setLoading] = useState(true);
  const [newPostOpen, setNewPostOpen] = useState(false);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [expandedPost, setExpandedPost] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    loadPosts();
  }, [group.id]);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { posts: postsData, comments: commentsData } = await groupsService.getPostsWithComments(group.id);
      setPosts(postsData);
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to load posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPostContent.trim()) return;
    
    await groupsService.createPost({
      groupId: group.id,
      mentorId: 'mentor-1',
      title: newPostTitle.trim() || undefined,
      content: newPostContent.trim(),
      isPinned: false,
      notifyMembers: true,
    });
    
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostOpen(false);
    loadPosts();
  };

  const handleAddComment = async (postId: string) => {
    if (!newComment.trim()) return;
    
    await groupsService.addComment({
      postId,
      userId: 'mentor-1',
      userName: 'Coach Alex',
      userType: 'mentor',
      content: newComment.trim(),
    });
    
    setNewComment('');
    const postComments = await groupsService.getComments(postId);
    setComments(prev => ({ ...prev, [postId]: postComments }));
  };

  const handleTogglePin = async (post: GroupPost) => {
    await groupsService.updatePost(post.id, { isPinned: !post.isPinned });
    loadPosts();
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      await groupsService.deletePost(postId);
      loadPosts();
    }
  };

  if (loading) {
    return <div className="text-center py-8 text-muted-foreground">Loading posts...</div>;
  }

  const pinnedPosts = posts.filter(p => p.isPinned);
  const recentPosts = posts.filter(p => !p.isPinned);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-medium text-muted-foreground">Message Board</h3>
        <Button onClick={() => setNewPostOpen(true)} data-testid="button-new-post">
          <span className="material-symbols-outlined text-base mr-2">add</span>
          New Post
        </Button>
      </div>

      {pinnedPosts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">push_pin</span>
            Pinned
          </h4>
          {pinnedPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              comments={comments[post.id] || []}
              expanded={expandedPost === post.id}
              onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onTogglePin={() => handleTogglePin(post)}
              onDelete={() => handleDeletePost(post.id)}
              newComment={expandedPost === post.id ? newComment : ''}
              onNewCommentChange={setNewComment}
              onAddComment={() => handleAddComment(post.id)}
            />
          ))}
        </div>
      )}

      {recentPosts.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            Recent Posts
          </h4>
          {recentPosts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              comments={comments[post.id] || []}
              expanded={expandedPost === post.id}
              onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onTogglePin={() => handleTogglePin(post)}
              onDelete={() => handleDeletePost(post.id)}
              newComment={expandedPost === post.id ? newComment : ''}
              onNewCommentChange={setNewComment}
              onAddComment={() => handleAddComment(post.id)}
            />
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <div className="text-center py-12">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4">chat</span>
          <h3 className="font-medium mb-2">No posts yet</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Start engaging with your group by creating a post
          </p>
          <Button onClick={() => setNewPostOpen(true)}>
            <span className="material-symbols-outlined text-base mr-2">add</span>
            Create First Post
          </Button>
        </div>
      )}

      <Dialog open={newPostOpen} onOpenChange={setNewPostOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-4">
            <Input
              placeholder="Title (optional)"
              value={newPostTitle}
              onChange={(e) => setNewPostTitle(e.target.value)}
              data-testid="input-post-title"
            />
            <Textarea
              placeholder="What would you like to share with the group?"
              value={newPostContent}
              onChange={(e) => setNewPostContent(e.target.value)}
              rows={4}
              data-testid="input-post-content"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setNewPostOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()}>
                Post
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function PostCard({
  post,
  comments,
  expanded,
  onToggleExpand,
  onTogglePin,
  onDelete,
  newComment,
  onNewCommentChange,
  onAddComment,
}: {
  post: GroupPost;
  comments: GroupComment[];
  expanded: boolean;
  onToggleExpand: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
}) {
  return (
    <Card data-testid={`card-post-${post.id}`}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            {post.title && <h4 className="font-medium mb-1">{post.title}</h4>}
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{post.content}</p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <span className="material-symbols-outlined text-base">more_vert</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onTogglePin}>
                <span className="material-symbols-outlined text-base mr-2">push_pin</span>
                {post.isPinned ? 'Unpin' : 'Pin'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDelete} className="text-destructive">
                <span className="material-symbols-outlined text-base mr-2">delete</span>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <span>{format(new Date(post.createdAt), 'MMM d, yyyy')}</span>
          <span>{post.viewCount} views</span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {Object.entries(post.reactions).map(([reaction, userIds]) => {
            const iconName = reactionIcons[reaction] || 'thumb_up';
            return (
              <Badge key={reaction} variant="secondary" className="gap-1">
                <span className="material-symbols-outlined text-xs">{iconName}</span>
                {userIds.length}
              </Badge>
            );
          })}
        </div>

        {comments.length > 0 && (
          <button
            onClick={onToggleExpand}
            className="text-sm text-primary mt-3"
            data-testid={`button-toggle-comments-${post.id}`}
          >
            {expanded ? 'Hide' : 'Show'} {comments.length} comment{comments.length !== 1 ? 's' : ''}
          </button>
        )}

        {expanded && (
          <div className="mt-4 pt-4 border-t space-y-3">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {comment.userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{comment.userName}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(comment.createdAt), 'MMM d, h:mm a')}
                    </span>
                  </div>
                  <p className="text-sm">{comment.content}</p>
                </div>
              </div>
            ))}
            
            <div className="flex gap-2 pt-2">
              <Input
                placeholder="Write a comment..."
                value={newComment}
                onChange={(e) => onNewCommentChange(e.target.value)}
                className="flex-1"
                data-testid={`input-comment-${post.id}`}
              />
              <Button size="icon" onClick={onAddComment} disabled={!newComment.trim()}>
                <span className="material-symbols-outlined text-base">send</span>
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function DirectivesTab({ group }: { group: ClientGroup }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">Group Directives</h3>
          <p className="text-xs text-muted-foreground">
            These automations only apply to members of this group
          </p>
        </div>
        <Link href={`/directives?group=${group.id}`}>
          <Button variant="outline" size="sm">
            <span className="material-symbols-outlined text-base mr-2">add</span>
            Create Directive
          </Button>
        </Link>
      </div>

      <Card>
        <CardContent className="p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4">bolt</span>
          <h3 className="font-medium mb-2">No group-specific directives</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Create directives that only apply to this group
          </p>
          <Link href={`/directives?group=${group.id}`}>
            <Button>
              <span className="material-symbols-outlined text-base mr-2">add</span>
              Create Directive
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressTab({ group }: { group: ClientGroup }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-8 text-center">
          <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4">trending_up</span>
          <h3 className="font-medium mb-2">Progress Analytics</h3>
          <p className="text-sm text-muted-foreground">
            Aggregate progress data and analytics for this group will be displayed here
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function GroupDetail() {
  const [, params] = useRoute('/groups/:id');
  const groupId = params?.id;
  
  const [group, setGroup] = useState<ClientGroup | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (groupId) {
      loadGroup();
    }
  }, [groupId]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tab = urlParams.get('tab');
    if (tab && ['overview', 'members', 'board', 'directives', 'progress'].includes(tab)) {
      setActiveTab(tab);
    }
  }, []);

  const loadGroup = async () => {
    setLoading(true);
    try {
      const data = await groupsService.getById(groupId!);
      setGroup(data || null);
    } catch (error) {
      console.error('Failed to load group:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header title="Loading..." />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading group...</div>
        </main>
      </>
    );
  }

  if (!group) {
    return (
      <>
        <Header title="Group Not Found" />
        <main className="flex-1 flex flex-col items-center justify-center">
          <h2 className="text-xl font-medium mb-4">Group not found</h2>
          <Link href="/groups">
            <Button variant="outline">
              <span className="material-symbols-outlined text-base mr-2">arrow_back</span>
              Back to Groups
            </Button>
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Header title={group.name} />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-semibold">{group.name}</h1>
              </div>
              {group.program && (
                <p className="text-muted-foreground">
                  Started {format(new Date(group.program.startDate), 'MMM d, yyyy')} - {group.memberCount} members
                </p>
              )}
              {!group.program && (
                <p className="text-muted-foreground">{group.memberCount} members</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <span className="material-symbols-outlined text-base mr-2">edit</span>
                Edit
              </Button>
              <Button variant="outline" size="sm">
                <span className="material-symbols-outlined text-base mr-2">archive</span>
                Archive
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" className="flex items-center gap-2" data-testid="tab-overview">
                <span className="material-symbols-outlined text-base">dashboard</span>
                Overview
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2" data-testid="tab-members">
                <span className="material-symbols-outlined text-base">group</span>
                Members
              </TabsTrigger>
              <TabsTrigger value="board" className="flex items-center gap-2" data-testid="tab-board">
                <span className="material-symbols-outlined text-base">chat</span>
                Message Board
              </TabsTrigger>
              <TabsTrigger value="directives" className="flex items-center gap-2" data-testid="tab-directives">
                <span className="material-symbols-outlined text-base">bolt</span>
                Directives
              </TabsTrigger>
              <TabsTrigger value="progress" className="flex items-center gap-2" data-testid="tab-progress">
                <span className="material-symbols-outlined text-base">trending_up</span>
                Progress
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <OverviewTab group={group} />
            </TabsContent>

            <TabsContent value="members">
              <MembersTab group={group} />
            </TabsContent>

            <TabsContent value="board">
              <MessageBoardTab group={group} />
            </TabsContent>

            <TabsContent value="directives">
              <DirectivesTab group={group} />
            </TabsContent>

            <TabsContent value="progress">
              <ProgressTab group={group} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </>
  );
}
