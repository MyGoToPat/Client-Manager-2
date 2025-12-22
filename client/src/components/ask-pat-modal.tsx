import { useState, useEffect, useCallback } from 'react';
import { Bot, Send, Copy, Check, Sparkles } from 'lucide-react';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface AskPatModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const suggestedQueries = [
  { text: 'How is Sarah doing this week?', category: 'Client' },
  { text: 'Who needs attention?', category: 'Overview' },
  { text: 'Show clients who missed workouts', category: 'Alerts' },
  { text: 'Summarize all client progress', category: 'Reports' },
  { text: 'Create check-in message for Sarah', category: 'Actions' },
];

function getMockPatResponse(query: string): { response: string; actionable: boolean } {
  const q = query.toLowerCase();
  
  if (q.includes('sarah')) {
    return {
      response: `Sarah has been doing great this week:

\u2022 5/5 workouts completed
\u2022 Protein avg: 142g (target: 140g)
\u2022 Sleep avg: 7.2 hours (slightly below 8h goal)

Recommendation: Send encouragement about workout streak and gentle reminder about sleep.`,
      actionable: true
    };
  }
  
  if (q.includes('attention') || q.includes('need')) {
    return {
      response: `3 clients need attention:

\u2022 Emily Rodriguez - inactive for 7 days
\u2022 James Wilson - suspended account
\u2022 David Thompson - trial ending in 3 days

Would you like me to draft check-in messages for any of them?`,
      actionable: true
    };
  }
  
  if (q.includes('missed') || q.includes('workout')) {
    return {
      response: `2 clients missed workouts this week:

\u2022 Emily Rodriguez - 0/3 completed
\u2022 James Wilson - 1/4 completed

Both show declining engagement. Consider reaching out with personalized encouragement.`,
      actionable: true
    };
  }
  
  if (q.includes('summarize') || q.includes('progress') || q.includes('all')) {
    return {
      response: `Weekly Client Summary:

Active Clients: 4/6 (67%)
Avg Workout Completion: 78%
Avg Nutrition Score: 82%
Avg Sleep Score: 76%

Top Performer: Lisa Park (95% progress)
Needs Support: Emily Rodriguez (23% progress)

Overall trend: Slightly improved from last week (+3%)`,
      actionable: false
    };
  }
  
  if (q.includes('check-in') || q.includes('message')) {
    return {
      response: `Here's a personalized check-in message:

"Hey Sarah! I noticed you've been crushing your workouts lately - 5 in a row is amazing! Your consistency is really paying off. 

One thing I noticed: your sleep has been a bit under target. Remember, good sleep = better recovery = stronger gains. Try winding down 30 mins earlier tonight?

Keep up the great work!"`,
      actionable: true
    };
  }
  
  if (q.includes('michael')) {
    return {
      response: `Michael Chen is progressing well:

\u2022 72% overall progress
\u2022 Focus: Muscle mass and strength gains
\u2022 Last active: Yesterday
\u2022 Current weight: 175 lbs
\u2022 TDEE: 2800 kcal

He's on track with his strength goals. Consider increasing his protein target slightly.`,
      actionable: true
    };
  }
  
  return {
    response: `I can help you with:

\u2022 Client summaries and progress reports
\u2022 Identifying clients who need attention
\u2022 Creating personalized messages
\u2022 Workout and nutrition insights

Try asking about a specific client or "who needs attention?"`,
    actionable: false
  };
}

export function AskPatModal({ open, onOpenChange }: AskPatModalProps) {
  const { toast } = useToast();
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<{ response: string; actionable: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSubmit = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    setIsLoading(true);
    setResponse(null);
    
    await new Promise(r => setTimeout(r, 800));
    
    const result = getMockPatResponse(searchQuery);
    setResponse(result);
    setIsLoading(false);
  }, []);

  const handleCopy = useCallback(() => {
    if (response) {
      navigator.clipboard.writeText(response.response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: 'Copied to clipboard',
        description: 'Response has been copied.',
      });
    }
  }, [response, toast]);

  const handleSendToClient = useCallback(() => {
    toast({
      title: 'Message queued',
      description: 'The message will be sent to the client.',
    });
    onOpenChange(false);
  }, [toast, onOpenChange]);

  const handleReset = useCallback(() => {
    setQuery('');
    setResponse(null);
  }, []);

  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setQuery('');
        setResponse(null);
        setCopied(false);
      }, 200);
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-2 px-3 border-b">
        <Bot className="w-5 h-5 text-primary" />
        <CommandInput
          placeholder="Ask Pat anything..."
          value={query}
          onValueChange={setQuery}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query.trim()) {
              e.preventDefault();
              handleSubmit(query);
            }
          }}
          data-testid="input-ask-pat"
        />
        {query && (
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => handleSubmit(query)}
            disabled={isLoading}
            data-testid="button-submit-pat"
          >
            <Send className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <CommandList className="max-h-[400px]">
        {isLoading && (
          <div className="flex items-center justify-center gap-2 py-8">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <span className="text-muted-foreground">Pat is thinking...</span>
          </div>
        )}
        
        {response && !isLoading && (
          <div className="p-4 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary/10 flex-shrink-0">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium mb-2">Pat's Response</p>
                <div className="text-sm text-muted-foreground whitespace-pre-line">
                  {response.response}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2 border-t">
              {response.actionable && (
                <Button size="sm" onClick={handleSendToClient} data-testid="button-send-to-client">
                  <Send className="w-3 h-3 mr-1" />
                  Send to Client
                </Button>
              )}
              <Button size="sm" variant="outline" onClick={handleCopy} data-testid="button-copy-response">
                {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleReset} data-testid="button-new-query">
                New Query
              </Button>
            </div>
          </div>
        )}
        
        {!response && !isLoading && (
          <>
            <CommandEmpty>
              Type your question and press Enter to ask Pat
            </CommandEmpty>
            
            <CommandGroup heading="Suggested">
              {suggestedQueries.map((suggestion) => (
                <CommandItem
                  key={suggestion.text}
                  onSelect={() => {
                    setQuery(suggestion.text);
                    handleSubmit(suggestion.text);
                  }}
                  className="flex items-center justify-between gap-2"
                  data-testid={`suggestion-${suggestion.category.toLowerCase()}`}
                >
                  <span>{suggestion.text}</span>
                  <Badge variant="secondary" className="text-xs">
                    {suggestion.category}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
