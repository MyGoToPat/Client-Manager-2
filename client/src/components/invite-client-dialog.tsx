import { useState } from 'react';
import { Copy, Check, Mail } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { clientsService } from '../services';

interface InviteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const permissionOptions = [
  { id: 'workout', label: 'Workout Data' },
  { id: 'nutrition', label: 'Nutrition Logs' },
  { id: 'sleep', label: 'Sleep Tracking' },
  { id: 'chat', label: 'Chat History' },
  { id: 'progress_photos', label: 'Progress Photos' },
  { id: 'body_metrics', label: 'Body Metrics' },
];

export function InviteClientDialog({ open, onOpenChange }: InviteClientDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [permissions, setPermissions] = useState<string[]>(['workout', 'nutrition']);
  const [inviteLink, setInviteLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateLink = async () => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter a client email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await clientsService.inviteClient(email, 'mentor-1');
      setInviteLink(result.inviteLink);
      toast({
        title: 'Invite link generated',
        description: 'Share this link with your client to get them started.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to generate invite link.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: 'Copied!',
      description: 'Invite link copied to clipboard.',
    });
  };

  const handlePermissionChange = (permId: string, checked: boolean) => {
    if (checked) {
      setPermissions([...permissions, permId]);
    } else {
      setPermissions(permissions.filter(p => p !== permId));
    }
  };

  const handleClose = () => {
    setEmail('');
    setInviteLink('');
    setPermissions(['workout', 'nutrition']);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Invite New Client
          </DialogTitle>
          <DialogDescription>
            Generate an invite link to onboard a new client to HiPat.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Client Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="client@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              data-testid="input-invite-email"
            />
          </div>

          <div className="space-y-3">
            <Label>Default Permissions</Label>
            <div className="grid grid-cols-2 gap-3">
              {permissionOptions.map((perm) => (
                <div key={perm.id} className="flex items-center gap-2">
                  <Checkbox
                    id={perm.id}
                    checked={permissions.includes(perm.id)}
                    onCheckedChange={(checked) => 
                      handlePermissionChange(perm.id, checked as boolean)
                    }
                    data-testid={`checkbox-perm-${perm.id}`}
                  />
                  <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                    {perm.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {inviteLink ? (
            <div className="space-y-2">
              <Label>Invite Link</Label>
              <div className="flex gap-2">
                <Input
                  value={inviteLink}
                  readOnly
                  className="font-mono text-sm"
                  data-testid="input-invite-link"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  data-testid="button-copy-link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>
          ) : (
            <Button
              onClick={handleGenerateLink}
              className="w-full"
              disabled={isLoading}
              data-testid="button-generate-link"
            >
              {isLoading ? 'Generating...' : 'Generate Invite Link'}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
