import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { clientsService } from '@/services';
import { leadGenToolsService } from '@/services/lead-gen-tools.service';
import type { ToolSubmission, LeadGenTool } from '@/types';

interface ToolCompletionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submission: ToolSubmission | null;
  tool: LeadGenTool | null;
  onClientCreated?: (clientId: string) => void;
}

export function ToolCompletionModal({
  open,
  onOpenChange,
  submission,
  tool,
  onClientCreated,
}: ToolCompletionModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [sendInvite, setSendInvite] = useState(true);
  const [addToRoster, setAddToRoster] = useState(true);

  const handleOpen = (isOpen: boolean) => {
    if (isOpen && submission) {
      setClientName(submission.clientData.name || '');
      setClientEmail(submission.clientData.email || '');
      setClientPhone(submission.clientData.phone || '');
    }
    onOpenChange(isOpen);
  };

  const handleCreateClient = async () => {
    if (!clientEmail) {
      toast({
        title: 'Email required',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    if (!submission) return;

    setIsLoading(true);
    try {
      if (addToRoster) {
        const newClient = await clientsService.createClient({
          name: clientName || clientEmail.split('@')[0],
          email: clientEmail,
          phone: clientPhone || undefined,
          status: 'pending',
          progress: 0,
          lastLogin: new Date().toISOString(),
          lastActive: new Date().toISOString(),
          joinedAt: new Date(),
        });

        await leadGenToolsService.updateSubmissionStatus(
          submission.id,
          sendInvite ? 'invited' : 'submitted',
          newClient.id
        );

        toast({
          title: 'Client added',
          description: `${clientName || clientEmail} has been added to your roster.`,
        });

        if (onClientCreated) {
          onClientCreated(newClient.id);
        }
      } else {
        await leadGenToolsService.updateSubmissionStatus(
          submission.id,
          sendInvite ? 'invited' : 'submitted'
        );

        toast({
          title: 'Results saved',
          description: sendInvite
            ? `Invite sent to ${clientEmail}.`
            : 'Assessment results saved.',
        });
      }

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create client. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!submission || !tool) return null;

  const resultKeys = Object.keys(submission.results);

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-chart-2/20">
              <span className="material-symbols-outlined text-lg text-chart-2">check_circle</span>
            </div>
            Assessment Complete
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Results Summary */}
          {resultKeys.length > 0 && (
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className="material-symbols-outlined text-base"
                    style={{ color: tool.color || undefined }}
                  >
                    {tool.icon}
                  </span>
                  <span className="font-medium text-sm">{tool.name} Results</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {resultKeys.slice(0, 6).map((key) => (
                    <div key={key} className="text-sm">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, ' $1').replace(/_/g, ' ')}:
                      </span>{' '}
                      <span className="font-medium">
                        {typeof submission.results[key] === 'object'
                          ? JSON.stringify(submission.results[key])
                          : String(submission.results[key])}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client Info */}
          <div className="space-y-4">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">person</span>
              Client Information
            </h4>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Client name"
                  data-testid="input-completion-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="Optional"
                  data-testid="input-completion-phone"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@email.com"
                data-testid="input-completion-email"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-3">
            <h4 className="font-medium text-sm flex items-center gap-2">
              <span className="material-symbols-outlined text-base text-muted-foreground">settings</span>
              Options
            </h4>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Checkbox
                id="send-invite"
                checked={sendInvite}
                onCheckedChange={(checked) => setSendInvite(checked as boolean)}
                data-testid="checkbox-send-invite"
              />
              <Label htmlFor="send-invite" className="flex-1 cursor-pointer">
                <div className="font-medium text-sm">Send invite to Pat</div>
                <div className="text-xs text-muted-foreground">
                  Email results with signup link
                </div>
              </Label>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Checkbox
                id="add-roster"
                checked={addToRoster}
                onCheckedChange={(checked) => setAddToRoster(checked as boolean)}
                data-testid="checkbox-add-roster"
              />
              <Label htmlFor="add-roster" className="flex-1 cursor-pointer">
                <div className="font-medium text-sm">Add to my client roster</div>
                <div className="text-xs text-muted-foreground">
                  Create client profile immediately
                </div>
              </Label>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleCreateClient} disabled={isLoading} data-testid="button-create-client">
            {isLoading ? (
              <>
                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                Processing...
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-base mr-1">person_add</span>
                {addToRoster ? 'Add Client' : 'Save Results'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
