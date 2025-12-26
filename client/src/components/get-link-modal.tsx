import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { leadGenToolsService } from '@/services/lead-gen-tools.service';
import type { LeadGenTool } from '@/types';

interface GetLinkModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: LeadGenTool | null;
  mentorId: string;
  mentorName: string;
}

export function GetLinkModal({
  open,
  onOpenChange,
  tool,
  mentorId,
  mentorName,
}: GetLinkModalProps) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ views: 0, completed: 0, signups: 0 });

  useEffect(() => {
    if (open && tool) {
      loadStats();
    }
  }, [open, tool]);

  async function loadStats() {
    if (!tool) return;
    try {
      const toolStats = await leadGenToolsService.getToolStats(tool.id, mentorId);
      setStats(toolStats);
    } catch {
      // Stats not available
    }
  }

  const selfServiceUrl = tool?.selfServiceUrl
    ? leadGenToolsService.buildToolUrl(
        tool.selfServiceUrl,
        mentorId,
        mentorName,
        'self-service',
        'light'
      )
    : '';

  const handleCopy = async () => {
    if (!selfServiceUrl) return;
    
    try {
      await navigator.clipboard.writeText(selfServiceUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Link copied',
        description: 'Shareable link copied to clipboard.',
      });
    } catch {
      toast({
        title: 'Copy failed',
        description: 'Please copy the link manually.',
        variant: 'destructive',
      });
    }
  };

  const handleShowQR = () => {
    toast({
      title: 'QR Code',
      description: 'QR code generation coming soon.',
    });
  };

  if (!tool) return null;

  const hasUrl = Boolean(tool.selfServiceUrl);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg"
              style={{ backgroundColor: tool.color ? `${tool.color}20` : undefined }}
            >
              <span
                className="material-symbols-outlined text-lg"
                style={{ color: tool.color || undefined }}
              >
                link
              </span>
            </div>
            {tool.name} Link
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <p className="text-sm text-muted-foreground">
            Share this link for people to use your {tool.name}. When they complete it, 
            they'll be prompted to create a Pat account to save their results - and connect with you.
          </p>

          {hasUrl ? (
            <>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={selfServiceUrl}
                    readOnly
                    className="font-mono text-sm"
                    data-testid="input-shareable-link"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleCopy}
                    data-testid="button-copy-link"
                  >
                    <span className="material-symbols-outlined text-base">
                      {copied ? 'check' : 'content_copy'}
                    </span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleShowQR}
                    data-testid="button-show-qr"
                  >
                    <span className="material-symbols-outlined text-base">qr_code_2</span>
                  </Button>
                </div>
              </div>

              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-base text-muted-foreground">
                      analytics
                    </span>
                    <span className="font-medium text-sm">Stats</span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.views > 0 ? stats.views : '--'}
                      </div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.completed > 0 ? stats.completed : '--'}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold">
                        {stats.signups > 0 ? stats.signups : '--'}
                      </div>
                      <div className="text-xs text-muted-foreground">Sign Ups</div>
                    </div>
                  </div>
                  {stats.views === 0 && stats.completed === 0 && stats.signups === 0 && (
                    <p className="text-xs text-muted-foreground text-center mt-3">
                      Stats will appear once people start using your link
                    </p>
                  )}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10 mx-auto mb-4">
                  <span className="material-symbols-outlined text-2xl text-amber-500">
                    settings
                  </span>
                </div>
                <h3 className="font-semibold mb-1">Self-Service URL not configured</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Configure a Self-Service URL in Settings to generate shareable links.
                </p>
                <Button
                  onClick={() => {
                    onOpenChange(false);
                    window.location.href = '/settings?tab=lead-generation';
                  }}
                >
                  Go to Settings
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
