import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { groupsService } from '../../services/groups.service';
import { format } from 'date-fns';
import type { ClientGroup, GroupPost, GroupComment } from '../../types';

interface Props {
  group: ClientGroup;
}

const reactionIcons: Record<string, string> = {
  thumbsup: 'thumb_up',
  heart: 'favorite',
  fire: 'local_fire_department',
  trophy: 'emoji_events',
};

export function GroupMessageBoardTab({ group }: Props) {
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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Message Board</h2>
        <Button onClick={() => setNewPostOpen(true)} data-testid="button-new-post">
          <span className="material-symbols-outlined text-base mr-2">add</span>
          New Post
        </Button>
      </div>

      {pinnedPosts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="material-symbols-outlined text-base">push_pin</span>
            Pinned
          </div>
          {pinnedPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              comments={comments[post.id] || []}
              expanded={expandedPost === post.id}
              onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onTogglePin={() => handleTogglePin(post)}
              onDelete={() => handleDeletePost(post.id)}
              newComment={newComment}
              onNewCommentChange={setNewComment}
              onAddComment={() => handleAddComment(post.id)}
            />
          ))}
        </div>
      )}

      {recentPosts.length > 0 && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">Recent Posts</div>
          {recentPosts.map(post => (
            <PostCard 
              key={post.id} 
              post={post}
              comments={comments[post.id] || []}
              expanded={expandedPost === post.id}
              onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
              onTogglePin={() => handleTogglePin(post)}
              onDelete={() => handleDeletePost(post.id)}
              newComment={newComment}
              onNewCommentChange={setNewComment}
              onAddComment={() => handleAddComment(post.id)}
            />
          ))}
        </div>
      )}

      {posts.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <span className="material-symbols-outlined text-5xl text-muted-foreground mb-4">chat_bubble</span>
            <h3 className="font-medium mb-2">No posts yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Start engaging with your group by creating a post
            </p>
            <Button onClick={() => setNewPostOpen(true)}>
              <span className="material-symbols-outlined text-base mr-2">add</span>
              Create First Post
            </Button>
          </CardContent>
        </Card>
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
              <Button onClick={handleCreatePost} disabled={!newPostContent.trim()} data-testid="button-submit-post">
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
    <Card data-testid={`post-card-${post.id}`}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback>CA</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">Coach Alex</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(post.createdAt), 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {post.isPinned && (
              <Badge variant="secondary">
                <span className="material-symbols-outlined text-xs mr-1">push_pin</span>
                Pinned
              </Badge>
            )}
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
        </div>
        {post.title && <CardTitle className="text-base mt-2">{post.title}</CardTitle>}
      </CardHeader>
      <CardContent>
        <p className="text-sm whitespace-pre-line">{post.content}</p>
        <div className="flex items-center gap-4 mt-4 pt-4 border-t">
          <div className="flex items-center gap-2">
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
          <button 
            onClick={onToggleExpand}
            className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <span className="material-symbols-outlined text-base">chat_bubble</span>
            {comments.length} comments
          </button>
        </div>

        {expanded && comments.length > 0 && (
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
