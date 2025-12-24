import { useState } from 'react';
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { clientsService } from '../services';

interface InviteClientDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const domainOptions = [
  { id: 'workout', label: 'Workout' },
  { id: 'nutrition', label: 'Nutrition' },
  { id: 'mindset', label: 'Mindset' },
];

export function InviteClientDialog({ open, onOpenChange }: InviteClientDialogProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [assignTo, setAssignTo] = useState<'personal' | 'org'>('personal');
  const [domains, setDomains] = useState<string[]>(['workout', 'nutrition']);
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

  const handleDomainChange = (domainId: string, checked: boolean) => {
    if (checked) {
      setDomains([...domains, domainId]);
    } else {
      setDomains(domains.filter(d => d !== domainId));
    }
  };

  const handleClose = () => {
    setEmail('');
    setInviteLink('');
    setAssignTo('personal');
    setDomains(['workout', 'nutrition']);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">mail</span>
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
            <Label>Assign to</Label>
            <RadioGroup value={assignTo} onValueChange={(v) => setAssignTo(v as 'personal' | 'org')}>
              <div className="flex items-center gap-3 p-3 rounded-md border border-border hover-elevate cursor-pointer" onClick={() => setAssignTo('personal')}>
                <RadioGroupItem value="personal" id="personal" data-testid="radio-personal" />
                <span className="material-symbols-outlined text-base text-muted-foreground">person</span>
                <Label htmlFor="personal" className="cursor-pointer flex-1">
                  <div className="font-medium">My Personal Clients</div>
                  <div className="text-xs text-muted-foreground">Direct relationship with you</div>
                </Label>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-md border border-border hover-elevate cursor-pointer" onClick={() => setAssignTo('org')}>
                <RadioGroupItem value="org" id="org" data-testid="radio-org" />
                <span className="material-symbols-outlined text-base text-muted-foreground">business</span>
                <Label htmlFor="org" className="cursor-pointer flex-1">
                  <div className="font-medium">FitLife Gym</div>
                  <div className="text-xs text-muted-foreground">Gym-managed client</div>
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <Label>Initial Domains</Label>
            <div className="flex items-center gap-4">
              {domainOptions.map((domain) => (
                <div key={domain.id} className="flex items-center gap-2">
                  <Checkbox
                    id={domain.id}
                    checked={domains.includes(domain.id)}
                    onCheckedChange={(checked) => 
                      handleDomainChange(domain.id, checked as boolean)
                    }
                    data-testid={`checkbox-domain-${domain.id}`}
                  />
                  <Label htmlFor={domain.id} className="text-sm font-normal cursor-pointer">
                    {domain.label}
                  </Label>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              You'll handle these domains. Pat AI handles the rest.
            </p>
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
                  {copied ? (
                    <span className="material-symbols-outlined text-base">check</span>
                  ) : (
                    <span className="material-symbols-outlined text-base">content_copy</span>
                  )}
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
