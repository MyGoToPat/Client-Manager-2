import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { leadGenToolsService } from '@/services/lead-gen-tools.service';
import type { LeadGenTool, ToolSubmission, ToolSubmissionClientData } from '@/types';

const TOOL_LOAD_TIMEOUT = 30000;

interface ToolLoaderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tool: LeadGenTool | null;
  mode: 'live' | 'self-service';
  mentorId: string;
  mentorName: string;
  onComplete: (submission: ToolSubmission) => void;
}

interface PostMessageData {
  type: 'TOOL_COMPLETE' | 'TOOL_CANCEL' | 'TOOL_RESIZE' | 'TOOL_READY';
  clientData?: ToolSubmissionClientData;
  results?: Record<string, unknown>;
  height?: number;
}

export function ToolLoaderModal({
  open,
  onOpenChange,
  tool,
  mode,
  mentorId,
  mentorName,
  onComplete,
}: ToolLoaderModalProps) {
  const { toast } = useToast();
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [iframeHeight, setIframeHeight] = useState(600);
  const [error, setError] = useState<string | null>(null);

  const toolUrl = tool
    ? leadGenToolsService.buildToolUrl(
        mode === 'live' ? tool.liveUrl || '' : tool.selfServiceUrl || '',
        mentorId,
        mentorName,
        mode,
        document.documentElement.classList.contains('dark') ? 'dark' : 'light'
      )
    : '';

  const handleMessage = useCallback(
    async (event: MessageEvent) => {
      if (!tool) return;

      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      try {
        const baseUrl = mode === 'live' ? tool.liveUrl : tool.selfServiceUrl;
        if (!baseUrl) return;

        const parsedUrl = new URL(baseUrl);
        if (!['https:', 'http:'].includes(parsedUrl.protocol)) {
          return;
        }

        if (event.origin !== parsedUrl.origin) return;
      } catch {
        return;
      }

      const data = event.data as PostMessageData;

      if (data.type === 'TOOL_READY') {
        setIsLoading(false);
      }

      if (data.type === 'TOOL_RESIZE' && data.height) {
        setIframeHeight(Math.min(Math.max(data.height, 400), 800));
      }

      if (data.type === 'TOOL_COMPLETE') {
        if (!data.clientData?.email) {
          toast({
            title: 'Invalid data',
            description: 'Tool did not return valid client data.',
            variant: 'destructive',
          });
          return;
        }

        try {
          const submission = await leadGenToolsService.createSubmission(
            tool.id,
            mentorId,
            data.clientData,
            data.results || {}
          );

          onComplete(submission);
          onOpenChange(false);

          toast({
            title: 'Assessment complete',
            description: `Results received for ${data.clientData.name || data.clientData.email}.`,
          });
        } catch (err) {
          toast({
            title: 'Error',
            description: 'Failed to save assessment results.',
            variant: 'destructive',
          });
        }
      }

      if (data.type === 'TOOL_CANCEL') {
        onOpenChange(false);
      }
    },
    [tool, mode, mentorId, onComplete, onOpenChange, toast]
  );

  useEffect(() => {
    if (!open || !tool) return;

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [open, tool, handleMessage]);

  useEffect(() => {
    if (open) {
      setIsLoading(true);
      setError(null);
    }
  }, [open, tool]);

  const hasValidUrl = !!(tool && (mode === 'live' ? tool.liveUrl : tool.selfServiceUrl));

  useEffect(() => {
    if (!open || !tool || !hasValidUrl) return;

    const timeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Tool is taking too long to respond. It may be unavailable or misconfigured.');
      }
    }, TOOL_LOAD_TIMEOUT);

    return () => clearTimeout(timeout);
  }, [open, tool, isLoading, hasValidUrl]);

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load the tool. Please check your tool configuration.');
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!tool) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden p-0">
        <DialogHeader className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3">
              <div
                className="flex items-center justify-center w-8 h-8 rounded-lg"
                style={{ backgroundColor: tool.color ? `${tool.color}20` : undefined }}
              >
                <span
                  className="material-symbols-outlined text-lg"
                  style={{ color: tool.color || undefined }}
                >
                  {tool.icon}
                </span>
              </div>
              {tool.name}
            </DialogTitle>
            <Badge variant="secondary" className="gap-1">
              <span className="material-symbols-outlined text-xs">
                {mode === 'live' ? 'videocam' : 'link'}
              </span>
              {mode === 'live' ? 'Live Mode' : 'Self-Service'}
            </Badge>
          </div>
          {mode === 'live' && (
            <p className="text-sm text-muted-foreground mt-1">
              Fill this out with your client to calculate their personalized targets
            </p>
          )}
        </DialogHeader>

        <div className="relative" style={{ height: iframeHeight }}>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-sm text-muted-foreground">Loading tool...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-background z-10">
              <div className="flex flex-col items-center gap-4 max-w-md text-center px-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
                  <span className="material-symbols-outlined text-2xl text-destructive">error</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Unable to load tool</h3>
                  <p className="text-sm text-muted-foreground">{error}</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setError(null);
                      setIsLoading(true);
                      if (iframeRef.current) {
                        iframeRef.current.src = toolUrl;
                      }
                    }}
                  >
                    Retry
                  </Button>
                </div>
              </div>
            </div>
          )}

          {!hasValidUrl ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background">
              <div className="flex flex-col items-center gap-4 max-w-md text-center px-6">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-amber-500/10">
                  <span className="material-symbols-outlined text-2xl text-amber-500">settings</span>
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Tool not configured</h3>
                  <p className="text-sm text-muted-foreground">
                    Please configure the {mode === 'live' ? 'Live Mode' : 'Self-Service'} URL in Settings
                    to use this tool.
                  </p>
                </div>
                <Button
                  onClick={() => {
                    handleClose();
                    window.location.href = '/settings?tab=lead-generation';
                  }}
                >
                  Go to Settings
                </Button>
              </div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              src={toolUrl}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-forms allow-same-origin allow-popups"
              allow="clipboard-write"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={`${tool.name} - ${mode}`}
              data-testid="iframe-tool-loader"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
