import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'wouter';
import { Header } from '../components/header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useToast } from '@/hooks/use-toast';
import { useAskPat } from '../App';
import { mockProgramTemplates } from '../mocks/program-templates.mock';
import type { ProgramTemplate, ProgramModule, TemplateDirective } from '../types';

const moduleTypeIcons = {
  video: 'videocam',
  pdf: 'description',
  workout: 'fitness_center',
  quiz: 'assignment',
  checkin: 'fact_check',
  text: 'chat_bubble',
};

const moduleTypeLabels = {
  video: 'Video',
  pdf: 'PDF',
  workout: 'Workout',
  quiz: 'Quiz',
  checkin: 'Check-in',
  text: 'Text',
};

interface WeekContentEditorProps {
  week: number;
  modules: ProgramModule[];
  onAddModule: () => void;
  onRemoveModule: (moduleId: string) => void;
}

function WeekContentEditor({ week, modules, onAddModule, onRemoveModule }: WeekContentEditorProps) {
  const [isOpen, setIsOpen] = useState(week === 1);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <div className="flex items-center gap-3 p-3 rounded-md bg-muted/50 cursor-pointer hover-elevate">
          {isOpen ? (
            <span className="material-symbols-outlined text-xl">keyboard_arrow_down</span>
          ) : (
            <span className="material-symbols-outlined text-xl">keyboard_arrow_right</span>
          )}
          <span className="font-medium">Week {week}</span>
          <Badge variant="secondary" className="ml-auto">
            {modules.length} {modules.length === 1 ? 'module' : 'modules'}
          </Badge>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-3 pl-8 space-y-2">
        {modules.length === 0 ? (
          <p className="text-sm text-muted-foreground py-2">
            No modules added for this week.
          </p>
        ) : (
          modules.map((module) => {
            const iconName = moduleTypeIcons[module.type];
            return (
              <div 
                key={module.id}
                className="flex items-center gap-3 p-2 rounded-md bg-background border"
              >
                <span className="material-symbols-outlined text-xl text-muted-foreground cursor-grab">drag_indicator</span>
                <div className="p-1.5 rounded bg-muted">
                  <span className="material-symbols-outlined text-xl text-muted-foreground">{iconName}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{module.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {moduleTypeLabels[module.type]}
                    {module.day && ` - Day ${module.day}`}
                    {module.estimatedMinutes && ` - ${module.estimatedMinutes} min`}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => onRemoveModule(module.id)}
                >
                  <span className="material-symbols-outlined text-xl text-muted-foreground">delete</span>
                </Button>
              </div>
            );
          })
        )}
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={onAddModule}
        >
          <span className="material-symbols-outlined text-xl mr-2">add</span>
          Add Module
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function ProgramTemplateBuilder() {
  const params = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { openAskPat } = useAskPat();
  const { toast } = useToast();
  const isEditing = params.id && params.id !== 'new';

  const [template, setTemplate] = useState<Partial<ProgramTemplate>>({
    name: '',
    description: '',
    durationWeeks: 12,
    modules: [],
    directives: [],
    requireSequentialCompletion: true,
    allowSelfEnroll: false,
    isActive: true,
  });

  useEffect(() => {
    if (isEditing && params.id) {
      const existingTemplate = mockProgramTemplates.find(t => t.id === params.id);
      if (existingTemplate) {
        setTemplate(existingTemplate);
      }
    }
  }, [isEditing, params.id]);

  const handleSave = () => {
    if (!template.name) {
      toast({
        title: 'Error',
        description: 'Please enter a program name',
        variant: 'destructive',
      });
      return;
    }

    toast({
      title: 'Success',
      description: isEditing ? 'Template updated successfully' : 'Template created successfully',
    });
    setLocation('/program-templates');
  };

  const handleAddModule = (week: number) => {
    const newModule: ProgramModule = {
      id: `mod-${Date.now()}`,
      week,
      day: 1,
      title: 'New Module',
      type: 'video',
      content: {},
      requiresCompletion: true,
      estimatedMinutes: 15,
    };
    setTemplate(prev => ({
      ...prev,
      modules: [...(prev.modules || []), newModule],
    }));
  };

  const handleRemoveModule = (moduleId: string) => {
    setTemplate(prev => ({
      ...prev,
      modules: prev.modules?.filter(m => m.id !== moduleId) || [],
    }));
  };

  const handleAddDirective = () => {
    const newDirective: TemplateDirective = {
      id: `dir-${Date.now()}`,
      week: 1,
      day: 1,
      name: 'New Directive',
      description: '',
      directiveType: 'encouragement',
      action: { actionType: 'encourage' },
      delivery: { tone: 'encouraging', format: 'brief' },
    };
    setTemplate(prev => ({
      ...prev,
      directives: [...(prev.directives || []), newDirective],
    }));
  };

  const handleRemoveDirective = (directiveId: string) => {
    setTemplate(prev => ({
      ...prev,
      directives: prev.directives?.filter(d => d.id !== directiveId) || [],
    }));
  };

  const durationOptions = [4, 6, 8, 10, 12, 16, 20, 24];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title={isEditing ? 'Edit Template' : 'Create Template'}
        onAskPat={openAskPat}
      />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setLocation('/program-templates')}
              data-testid="button-back"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">
                {isEditing ? 'Edit Template' : 'Create Program Template'}
              </h1>
              <p className="text-muted-foreground">
                Build a reusable program with content and automated directives.
              </p>
            </div>
          </div>
          <Button onClick={handleSave} data-testid="button-save-template">
            <span className="material-symbols-outlined text-xl mr-2">save</span>
            Save Template
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Program Name *</Label>
              <Input
                id="name"
                value={template.name}
                onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                placeholder="e.g., 12-Week Shred"
                data-testid="input-template-name"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Duration *</Label>
                <Select
                  value={template.durationWeeks?.toString()}
                  onValueChange={(v) => setTemplate({ ...template, durationWeeks: parseInt(v) })}
                >
                  <SelectTrigger data-testid="select-duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {durationOptions.map((w) => (
                      <SelectItem key={w} value={w.toString()}>
                        {w} weeks
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={template.description}
                onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                placeholder="Describe what this program is about..."
                rows={3}
                data-testid="input-template-description"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Content</CardTitle>
            <CardDescription>
              Add videos, PDFs, workouts, and check-ins for each week.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: template.durationWeeks || 12 }).map((_, weekIndex) => (
              <WeekContentEditor
                key={weekIndex}
                week={weekIndex + 1}
                modules={template.modules?.filter((m) => m.week === weekIndex + 1) || []}
                onAddModule={() => handleAddModule(weekIndex + 1)}
                onRemoveModule={handleRemoveModule}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Automated Directives</CardTitle>
            <CardDescription>
              Set up Pat to automatically send messages at specific points in the program.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {template.directives?.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No automated directives configured.
              </p>
            ) : (
              template.directives?.map((directive) => (
                <div
                  key={directive.id}
                  className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{directive.name}</p>
                      <Badge variant="secondary">
                        Week {directive.week}{directive.day ? `, Day ${directive.day}` : ''}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {directive.description || 'No description'}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveDirective(directive.id)}
                  >
                    <span className="material-symbols-outlined text-xl text-muted-foreground">delete</span>
                  </Button>
                </div>
              ))
            )}
            <Button variant="outline" onClick={handleAddDirective}>
              <span className="material-symbols-outlined text-xl mr-2">add</span>
              Add Directive
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sequential"
                checked={template.requireSequentialCompletion}
                onCheckedChange={(checked) =>
                  setTemplate({ ...template, requireSequentialCompletion: checked as boolean })
                }
                data-testid="checkbox-sequential"
              />
              <Label htmlFor="sequential">
                Require sequential completion (can't skip ahead)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="selfEnroll"
                checked={template.allowSelfEnroll}
                onCheckedChange={(checked) =>
                  setTemplate({ ...template, allowSelfEnroll: checked as boolean })
                }
                data-testid="checkbox-self-enroll"
              />
              <Label htmlFor="selfEnroll">Allow clients to purchase directly</Label>
            </div>
            {template.allowSelfEnroll && (
              <div className="space-y-2 pl-6">
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  value={template.price || ''}
                  onChange={(e) =>
                    setTemplate({ ...template, price: parseFloat(e.target.value) || undefined })
                  }
                  placeholder="297"
                  className="max-w-[200px]"
                  data-testid="input-price"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
