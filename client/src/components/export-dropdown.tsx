import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ExportFormat } from '@/lib/export-utils';

interface ExportDropdownProps {
  onExport: (format: ExportFormat) => void;
  disabled?: boolean;
  label?: string;
}

export function ExportDropdown({ onExport, disabled, label = 'Export' }: ExportDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" disabled={disabled} data-testid="button-export">
          <span className="material-symbols-outlined text-base mr-2">download</span>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onExport('csv')} data-testid="button-export-csv">
          <span className="material-symbols-outlined text-base mr-2">table_chart</span>
          Export as CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport('pdf')} data-testid="button-export-pdf">
          <span className="material-symbols-outlined text-base mr-2">description</span>
          Export as PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
