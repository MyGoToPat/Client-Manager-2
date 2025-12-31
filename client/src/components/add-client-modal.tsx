import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { leadGenToolsService } from '@/services/lead-gen-tools.service';
import { ToolLoaderModal } from './tool-loader-modal';
import { ToolCompletionModal } from './tool-completion-modal';
import { GetLinkModal } from './get-link-modal';
import type { LeadGenTool, ToolSubmission } from '@/types';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStartLive?: (tool: LeadGenTool) => void;
  onGetLink?: (tool: LeadGenTool) => void;
  onConnectExisting?: () => void;
  onReferralLink?: () => void;
  onQuickAdd?: (data: QuickAddData) => void;
}

interface QuickAddData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface ToolCardProps {
  tool: LeadGenTool;
  onStartLive: (tool: LeadGenTool) => void;
  onGetLink: (tool: LeadGenTool) => void;
}

function ToolCard({ tool, onStartLive, onGetLink }: ToolCardProps) {
  const isComingSoon = !tool.isActive;
  const isNotConfigured = tool.isActive && !tool.isConfigured;

  return (
    <div
      className={`relative flex flex-col p-4 rounded-lg border border-border bg-card ${
        isComingSoon ? 'opacity-60' : ''
      }`}
      data-testid={`card-tool-${tool.id}`}
    >
      {isComingSoon && (
        <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
          Coming Soon
        </Badge>
      )}

      <div className="flex items-start gap-3 mb-3">
        <div
          className="flex items-center justify-center w-10 h-10 rounded-lg"
          style={{ backgroundColor: tool.color ? `${tool.color}20` : undefined }}
        >
          <span
            className="material-symbols-outlined text-xl"
            style={{ color: tool.color || undefined }}
          >
            {tool.icon}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-sm">{tool.name}</h4>
          <p className="text-xs text-muted-foreground">{tool.description}</p>
        </div>
      </div>

      {isComingSoon ? (
        <div className="h-9" />
      ) : isNotConfigured ? (
        <div className="space-y-2">
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-sm">warning</span>
            Not configured
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onClick={() => {
              window.location.href = '/settings?tab=lead-generation';
            }}
            data-testid={`button-configure-${tool.id}`}
          >
            Configure in Settings
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          <Button
            size="sm"
            className="flex-1"
            onClick={() => onStartLive(tool)}
            data-testid={`button-start-live-${tool.id}`}
          >
            <span className="material-symbols-outlined text-sm mr-1">videocam</span>
            Start Live
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={() => onGetLink(tool)}
            data-testid={`button-get-link-${tool.id}`}
          >
            <span className="material-symbols-outlined text-sm mr-1">link</span>
            Get Link
          </Button>
        </div>
      )}
    </div>
  );
}

interface ActionCardProps {
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
  testId: string;
  disabled?: boolean;
}

function ActionCard({ icon, title, description, onClick, testId, disabled }: ActionCardProps) {
  return (
    <button
      className={`flex items-start gap-3 p-4 rounded-lg border border-border bg-card text-left hover-elevate active-elevate-2 w-full ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      data-testid={testId}
    >
      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-muted">
        <span className="material-symbols-outlined text-xl text-muted-foreground">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm">{title}</h4>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}

export function AddClientModal({
  open,
  onOpenChange,
  onStartLive,
  onGetLink,
  onConnectExisting,
  onReferralLink,
  onQuickAdd,
}: AddClientModalProps) {
  const { toast } = useToast();
  const [tools, setTools] = useState<LeadGenTool[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedTool, setSelectedTool] = useState<LeadGenTool | null>(null);
  const [loaderModalOpen, setLoaderModalOpen] = useState(false);
  const [getLinkModalOpen, setGetLinkModalOpen] = useState(false);
  const [completionModalOpen, setCompletionModalOpen] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState<ToolSubmission | null>(null);

  // Quick Add form state
  const [quickAddData, setQuickAddData] = useState<QuickAddData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  });
  const [isSubmittingQuickAdd, setIsSubmittingQuickAdd] = useState(false);

  const mentorId = 'mentor-1';
  const mentorName = 'Coach Alex';

  useEffect(() => {
    if (open) {
      loadTools();
    }
  }, [open]);

  async function loadTools() {
    setIsLoading(true);
    try {
      const allTools = await leadGenToolsService.getTools();
      setTools(allTools);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load onboarding tools.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }

  const handleStartLive = (tool: LeadGenTool) => {
    if (onStartLive) {
      onStartLive(tool);
    } else {
      setSelectedTool(tool);
      setLoaderModalOpen(true);
    }
  };

  const handleGetLink = (tool: LeadGenTool) => {
    if (onGetLink) {
      onGetLink(tool);
    } else {
      setSelectedTool(tool);
      setGetLinkModalOpen(true);
    }
  };

  const handleToolComplete = (submission: ToolSubmission) => {
    setCurrentSubmission(submission);
    setLoaderModalOpen(false);
    setCompletionModalOpen(true);
  };

  const handleClientCreated = (_clientId: string) => {
    setCompletionModalOpen(false);
    onOpenChange(false);
  };

  const handleConnectExisting = () => {
    if (onConnectExisting) {
      onConnectExisting();
    } else {
      toast({
        title: 'Connect Existing',
        description: 'Search for existing Pat user.',
      });
    }
  };

  const handleReferralLink = () => {
    if (onReferralLink) {
      onReferralLink();
    } else {
      toast({
        title: 'Referral Link Copied',
        description: 'Your referral link has been copied to clipboard.',
      });
      navigator.clipboard.writeText(`https://hipat.app/ref/${mentorId}`);
    }
  };

  const handleQuickAddSubmit = async () => {
    if (!quickAddData.email.trim() || !quickAddData.firstName.trim()) {
      toast({
        title: 'Missing Information',
        description: 'First name and email are required.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingQuickAdd(true);
    try {
      if (onQuickAdd) {
        onQuickAdd(quickAddData);
      } else {
        toast({
          title: 'Account Created',
          description: `Invite sent to ${quickAddData.email}`,
        });
      }
      setQuickAddData({ firstName: '', lastName: '', email: '', phone: '' });
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create account. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingQuickAdd(false);
    }
  };

  const activeTools = tools.filter(t => t.isActive);
  const comingSoonTools = tools.filter(t => !t.isActive);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">person_add</span>
            Add New Client
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Section 1: Onboarding Tools (Recommended) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">target</span>
              <h3 className="font-semibold text-sm uppercase tracking-wide">Onboarding Tools</h3>
              <Badge variant="secondary" className="text-xs">Recommended</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Run an assessment. Results create their account automatically.
            </p>

            {isLoading ? (
              <div className="grid grid-cols-2 gap-3">
                {[1, 2, 3, 4].map(i => (
                  <div
                    key={i}
                    className="h-32 rounded-lg border border-border bg-muted/50 animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {activeTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onStartLive={handleStartLive}
                    onGetLink={handleGetLink}
                  />
                ))}
                {comingSoonTools.map(tool => (
                  <ToolCard
                    key={tool.id}
                    tool={tool}
                    onStartLive={handleStartLive}
                    onGetLink={handleGetLink}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground uppercase">
              or
            </span>
          </div>

          {/* Section 2: Quick Add (No Assessment) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">person_add</span>
              <h3 className="font-semibold text-sm uppercase tracking-wide">Quick Add</h3>
              <span className="text-xs text-muted-foreground">(No Assessment)</span>
            </div>

            <div className="rounded-lg border border-border bg-card p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="firstName" className="text-xs">First Name *</Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    value={quickAddData.firstName}
                    onChange={(e) => setQuickAddData(prev => ({ ...prev, firstName: e.target.value }))}
                    data-testid="input-quick-add-first-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="lastName" className="text-xs">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Smith"
                    value={quickAddData.lastName}
                    onChange={(e) => setQuickAddData(prev => ({ ...prev, lastName: e.target.value }))}
                    data-testid="input-quick-add-last-name"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-xs">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    value={quickAddData.email}
                    onChange={(e) => setQuickAddData(prev => ({ ...prev, email: e.target.value }))}
                    data-testid="input-quick-add-email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone" className="text-xs">Phone (optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={quickAddData.phone}
                    onChange={(e) => setQuickAddData(prev => ({ ...prev, phone: e.target.value }))}
                    data-testid="input-quick-add-phone"
                  />
                </div>
              </div>
              <Button
                onClick={handleQuickAddSubmit}
                disabled={isSubmittingQuickAdd || !quickAddData.firstName.trim() || !quickAddData.email.trim()}
                className="w-full"
                data-testid="button-quick-add-submit"
              >
                <span className="material-symbols-outlined text-sm mr-2">send</span>
                {isSubmittingQuickAdd ? 'Creating Account...' : 'Create Account & Send Invite'}
              </Button>
            </div>
          </div>

          <div className="relative">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-xs text-muted-foreground uppercase">
              or
            </span>
          </div>

          {/* Section 3: Passive Links */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-primary">link</span>
              <h3 className="font-semibold text-sm uppercase tracking-wide">Passive Links</h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <ActionCard
                icon="share"
                title="My Referral Link"
                description="Generic signup link to share"
                onClick={handleReferralLink}
                testId="button-referral-link"
              />
              <ActionCard
                icon="person_search"
                title="Connect Existing User"
                description="Find by email"
                onClick={handleConnectExisting}
                testId="button-connect-existing"
              />
            </div>
          </div>
        </div>
      </DialogContent>

      <ToolLoaderModal
        open={loaderModalOpen}
        onOpenChange={setLoaderModalOpen}
        tool={selectedTool}
        mode="live"
        mentorId={mentorId}
        mentorName={mentorName}
        onComplete={handleToolComplete}
      />

      <GetLinkModal
        open={getLinkModalOpen}
        onOpenChange={setGetLinkModalOpen}
        tool={selectedTool}
        mentorId={mentorId}
        mentorName={mentorName}
      />

      <ToolCompletionModal
        open={completionModalOpen}
        onOpenChange={setCompletionModalOpen}
        submission={currentSubmission}
        tool={selectedTool}
        onClientCreated={handleClientCreated}
      />
    </Dialog>
  );
}
