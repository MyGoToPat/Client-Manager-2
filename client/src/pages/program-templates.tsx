import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Header } from '../components/header';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useAskPat } from '../App';
import { mockProgramTemplates } from '../mocks/program-templates.mock';
import { clientsService } from '../services/clients.service';
import { groupsService } from '../services/groups.service';
import { CreateGroupFromTemplateModal } from '../components/program-templates/create-group-from-template-modal';
import type { ProgramTemplate, Client, ClientGroup, PatInsightType } from '../types';

type FilterType = 'all' | 'highest_rated' | 'short_duration' | 'needs_optimization';

function getInsightStyles(type: PatInsightType) {
  switch (type) {
    case 'positive':
      return {
        bg: 'bg-indigo-50 dark:bg-indigo-950/40',
        border: 'border-indigo-200 dark:border-indigo-800/50',
        text: 'text-indigo-700 dark:text-indigo-300',
        label: 'text-indigo-600 dark:text-indigo-400',
        icon: 'text-indigo-500 dark:text-indigo-400',
      };
    case 'optimization':
      return {
        bg: 'bg-amber-50 dark:bg-amber-950/40',
        border: 'border-amber-200 dark:border-amber-800/50',
        text: 'text-amber-700 dark:text-amber-300',
        label: 'text-amber-600 dark:text-amber-400',
        icon: 'text-amber-500 dark:text-amber-400',
      };
    case 'data_trend':
      return {
        bg: 'bg-cyan-50 dark:bg-cyan-950/40',
        border: 'border-cyan-200 dark:border-cyan-800/50',
        text: 'text-cyan-700 dark:text-cyan-300',
        label: 'text-cyan-600 dark:text-cyan-400',
        icon: 'text-cyan-500 dark:text-cyan-400',
      };
    default:
      return {
        bg: 'bg-slate-50 dark:bg-slate-800/40',
        border: 'border-slate-200 dark:border-slate-700/50',
        text: 'text-slate-700 dark:text-slate-300',
        label: 'text-slate-600 dark:text-slate-400',
        icon: 'text-slate-500 dark:text-slate-400',
      };
  }
}

interface ProgramTemplateCardProps {
  template: ProgramTemplate;
  onEdit: () => void;
  onDeploy: () => void;
  onDuplicate: () => void;
}

function ProgramTemplateCard({ template, onEdit, onDeploy, onDuplicate }: ProgramTemplateCardProps) {
  const insightStyles = template.patInsight ? getInsightStyles(template.patInsight.type) : null;

  return (
    <Card className="overflow-visible group" data-testid={`card-template-${template.id}`}>
      <div 
        className="relative h-36 rounded-t-md overflow-hidden"
        style={{ background: template.coverGradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
      >
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-slate-700 dark:text-slate-200 backdrop-blur-sm"
        >
          {template.durationWeeks} Weeks
        </Badge>
      </div>

      <CardContent className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-slate-900 dark:text-white">{template.name}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-1">
            {template.description}
          </p>
        </div>

        {template.patInsight && insightStyles && (
          <div className={`p-3 rounded-md border ${insightStyles.bg} ${insightStyles.border}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`material-symbols-outlined text-sm ${insightStyles.icon}`}>auto_awesome</span>
              <span className={`text-xs font-semibold uppercase tracking-wide ${insightStyles.label}`}>
                {template.patInsight.label}
              </span>
            </div>
            <p className={`text-xs ${insightStyles.text}`}>
              {template.patInsight.message}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">trending_up</span>
            {template.avgCompletionRate}% completion
          </span>
          <span className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-lg">group</span>
            {template.activeUsers} active
          </span>
        </div>

        <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
          <Button 
            className="flex-1"
            onClick={onDeploy}
            data-testid={`button-deploy-${template.id}`}
          >
            <span className="material-symbols-outlined text-lg mr-2">rocket_launch</span>
            Deploy Template
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onEdit}
            data-testid={`button-edit-${template.id}`}
          >
            <span className="material-symbols-outlined text-lg">edit</span>
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={onDuplicate}
            data-testid={`button-duplicate-${template.id}`}
          >
            <span className="material-symbols-outlined text-lg">content_copy</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface BuildFromScratchCardProps {
  onClick: () => void;
}

function BuildFromScratchCard({ onClick }: BuildFromScratchCardProps) {
  return (
    <Card 
      className="flex flex-col items-center justify-center min-h-[360px] border-dashed hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid="card-build-from-scratch"
    >
      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <span className="material-symbols-outlined text-2xl text-slate-400">add</span>
      </div>
      <h3 className="font-bold text-lg text-slate-900 dark:text-white">Build from Scratch</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create a custom program template</p>
    </Card>
  );
}

export default function ProgramTemplates() {
  const [, setLocation] = useLocation();
  const { openAskPat } = useAskPat();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [templates] = useState<ProgramTemplate[]>(mockProgramTemplates);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ProgramTemplate | null>(null);
  const [createGroupOpen, setCreateGroupOpen] = useState(false);

  useEffect(() => {
    loadClients();
  }, []);

  const loadClients = async () => {
    try {
      const data = await clientsService.getClients('mentor-1');
      setClients(data);
    } catch (error) {
      console.error('Failed to load clients:', error);
    }
  };

  const filteredTemplates = templates.filter(t => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (activeFilter) {
      case 'highest_rated':
        return t.avgCompletionRate >= 80;
      case 'short_duration':
        return t.durationWeeks <= 6;
      case 'needs_optimization':
        return t.patInsight?.type === 'optimization';
      default:
        return true;
    }
  });

  const handleEdit = (templateId: string) => {
    setLocation(`/program-templates/${templateId}`);
  };

  const handleDeploy = (template: ProgramTemplate) => {
    setSelectedTemplate(template);
    setCreateGroupOpen(true);
  };

  const handleCreateGroupFromTemplate = async (groupData: Partial<ClientGroup>) => {
    try {
      await groupsService.create(groupData as Omit<ClientGroup, 'id' | 'createdAt' | 'updatedAt'>);
      toast({
        title: 'Cohort created',
        description: `${groupData.name} has been created successfully.`,
      });
      setCreateGroupOpen(false);
      setSelectedTemplate(null);
      setLocation('/groups');
    } catch (error) {
      console.error('Failed to create group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create cohort. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleDuplicate = (templateId: string) => {
    toast({
      title: 'Template duplicated',
      description: 'A copy of the template has been created.',
    });
    console.log('Duplicate template:', templateId);
  };

  const handleCreateNew = () => {
    setLocation('/program-templates/new');
  };

  const filterButtons: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All Templates' },
    { key: 'highest_rated', label: 'Highest Rated' },
    { key: 'short_duration', label: 'Short Duration' },
    { key: 'needs_optimization', label: 'Needs Optimization' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Program Library"
        onAskPat={openAskPat}
      />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Program Library
            </h1>
            <p className="text-slate-500 dark:text-[#92a4c9] text-base flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">auto_awesome</span>
              Powered by Pat's AI Insights
            </p>
          </div>
          <Button 
            onClick={handleCreateNew}
            className="shadow-lg shadow-blue-500/20"
            data-testid="button-create-template"
          >
            <span className="material-symbols-outlined text-base mr-2">add</span>
            Create New Template
          </Button>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1 max-w-xl">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <span className="material-symbols-outlined">search</span>
            </span>
            <Input 
              placeholder="Search templates by name, tag, or goal..." 
              className="pl-12 bg-white dark:bg-[#1e2229]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-search"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {filterButtons.map((filter) => (
              <Button
                key={filter.key}
                variant="outline"
                className={activeFilter === filter.key 
                  ? 'border-primary text-primary toggle-elevate toggle-elevated' 
                  : 'toggle-elevate'
                }
                onClick={() => setActiveFilter(filter.key)}
                data-testid={`button-filter-${filter.key}`}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        {filteredTemplates.length === 0 && searchQuery === '' && activeFilter === 'all' ? (
          <Card>
            <CardContent className="py-12 text-center">
              <span className="material-symbols-outlined text-4xl mx-auto mb-4 text-muted-foreground opacity-50 block">book_5</span>
              <h3 className="text-lg font-medium mb-2">No templates yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first program template to get started.
              </p>
              <Button onClick={handleCreateNew}>
                <span className="material-symbols-outlined text-xl mr-2">add</span>
                Create Template
              </Button>
            </CardContent>
          </Card>
        ) : filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <span className="material-symbols-outlined text-4xl mx-auto mb-4 text-muted-foreground opacity-50 block">search_off</span>
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <ProgramTemplateCard
                key={template.id}
                template={template}
                onEdit={() => handleEdit(template.id)}
                onDeploy={() => handleDeploy(template)}
                onDuplicate={() => handleDuplicate(template.id)}
              />
            ))}
            <BuildFromScratchCard onClick={handleCreateNew} />
          </div>
        )}
      </main>

      {selectedTemplate && (
        <CreateGroupFromTemplateModal
          open={createGroupOpen}
          onClose={() => {
            setCreateGroupOpen(false);
            setSelectedTemplate(null);
          }}
          template={selectedTemplate}
          clients={clients}
          onCreateGroup={handleCreateGroupFromTemplate}
        />
      )}
    </div>
  );
}
