import { useState } from 'react';
import { useLocation } from 'wouter';
import { Plus, BookOpen, Users, Clock, BarChart2, MoreVertical, Edit, Copy, Trash2, PlayCircle } from 'lucide-react';
import { Header } from '../components/header';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAskPat } from '../App';
import { mockProgramTemplates } from '../mocks/program-templates.mock';
import type { ProgramTemplate } from '../types';

interface ProgramTemplateCardProps {
  template: ProgramTemplate;
  onEdit: () => void;
  onCreateGroup: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

function ProgramTemplateCard({ template, onEdit, onCreateGroup, onDuplicate, onDelete }: ProgramTemplateCardProps) {
  return (
    <Card className="hover-elevate" data-testid={`card-template-${template.id}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-md bg-muted">
              <BookOpen className="w-5 h-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">{template.name}</CardTitle>
              <p className="text-xs text-muted-foreground mt-1">{template.durationWeeks} weeks</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Badge variant={template.isActive ? 'default' : 'secondary'}>
              {template.isActive ? 'Active' : 'Draft'}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid={`button-menu-${template.id}`}>
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDuplicate}>
                  <Copy className="w-4 h-4 mr-2" />
                  Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{template.description}</p>
        
        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <PlayCircle className="w-4 h-4" />
            {template.modules.length} modules
          </span>
          <span className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            {template.timesUsed} uses
          </span>
          <span className="flex items-center gap-1">
            <BarChart2 className="w-4 h-4" />
            {template.avgCompletionRate}%
          </span>
        </div>
        
        {template.allowSelfEnroll && template.price && (
          <Badge variant="secondary" className="mt-3">
            ${template.price} - Self-enroll
          </Badge>
        )}
      </CardContent>
      <CardFooter className="pt-0">
        <Button 
          className="w-full" 
          onClick={onCreateGroup}
          data-testid={`button-create-group-${template.id}`}
        >
          <Users className="w-4 h-4 mr-2" />
          Create Group from Template
        </Button>
      </CardFooter>
    </Card>
  );
}

export default function ProgramTemplates() {
  const [, setLocation] = useLocation();
  const { openAskPat } = useAskPat();
  const [searchQuery, setSearchQuery] = useState('');
  const [templates] = useState<ProgramTemplate[]>(mockProgramTemplates);

  const filteredTemplates = templates.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (templateId: string) => {
    setLocation(`/program-templates/${templateId}`);
  };

  const handleCreateGroup = (template: ProgramTemplate) => {
    setLocation(`/groups?fromTemplate=${template.id}`);
  };

  const handleDuplicate = (templateId: string) => {
    console.log('Duplicate template:', templateId);
  };

  const handleDelete = (templateId: string) => {
    console.log('Delete template:', templateId);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header
        title="Program Templates"
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        onAskPat={openAskPat}
      />

      <main className="flex-1 p-6 space-y-6 overflow-auto">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold">Program Templates</h1>
            <p className="text-muted-foreground">
              Create reusable program structures with content and directives.
            </p>
          </div>
          <Button 
            onClick={() => setLocation('/program-templates/new')}
            data-testid="button-create-template"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Template
          </Button>
        </div>

        {filteredTemplates.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">No templates found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Create your first program template to get started.'}
              </p>
              {!searchQuery && (
                <Button onClick={() => setLocation('/program-templates/new')}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Template
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTemplates.map((template) => (
              <ProgramTemplateCard
                key={template.id}
                template={template}
                onEdit={() => handleEdit(template.id)}
                onCreateGroup={() => handleCreateGroup(template)}
                onDuplicate={() => handleDuplicate(template.id)}
                onDelete={() => handleDelete(template.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
