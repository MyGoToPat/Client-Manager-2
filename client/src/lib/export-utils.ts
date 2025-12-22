import type { Client, MentorDirective, ClientGroup } from '../types';

export type ExportFormat = 'csv' | 'pdf';

interface ExportColumn<T> {
  header: string;
  accessor: (item: T) => string | number;
}

function escapeCsvValue(value: string | number): string {
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

function generateCsv<T>(data: T[], columns: ExportColumn<T>[]): string {
  const headers = columns.map(col => escapeCsvValue(col.header)).join(',');
  const rows = data.map(item => 
    columns.map(col => escapeCsvValue(col.accessor(item))).join(',')
  );
  return [headers, ...rows].join('\n');
}

function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

function generatePdfHtml<T>(data: T[], columns: ExportColumn<T>[], title: string): string {
  const headerCells = columns.map(col => `<th style="border: 1px solid #ddd; padding: 8px; text-align: left; background-color: #f5f5f5;">${col.header}</th>`).join('');
  const rows = data.map(item => {
    const cells = columns.map(col => `<td style="border: 1px solid #ddd; padding: 8px;">${col.accessor(item)}</td>`).join('');
    return `<tr>${cells}</tr>`;
  }).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title}</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; margin-bottom: 20px; }
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f5f5f5; }
        tr:nth-child(even) { background-color: #fafafa; }
        .footer { margin-top: 20px; font-size: 12px; color: #666; }
        @media print {
          body { margin: 0; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <h1>${title}</h1>
      <p style="color: #666; margin-bottom: 16px;">Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
      <table>
        <thead><tr>${headerCells}</tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">
        <p>Total records: ${data.length}</p>
        <p>HiPat Client Management Tool</p>
      </div>
    </body>
    </html>
  `;
}

function openPrintWindow(html: string): void {
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 250);
  }
}

const clientColumns: ExportColumn<Client>[] = [
  { header: 'Name', accessor: (c) => c.name },
  { header: 'Email', accessor: (c) => c.email },
  { header: 'Phone', accessor: (c) => c.phone || '' },
  { header: 'Status', accessor: (c) => c.status },
  { header: 'Role', accessor: (c) => c.role },
  { header: 'Progress %', accessor: (c) => c.progress },
  { header: 'Last Login', accessor: (c) => c.lastLogin },
  { header: 'Joined', accessor: (c) => new Date(c.joinedAt).toLocaleDateString() },
  { header: 'Goals', accessor: (c) => c.goals?.join('; ') || '' },
];

export function exportClients(clients: Client[], format: ExportFormat): void {
  const filename = `clients-export-${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    const csv = generateCsv(clients, clientColumns);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const html = generatePdfHtml(clients, clientColumns, 'Client List Export');
    openPrintWindow(html);
  }
}

const directiveColumns: ExportColumn<MentorDirective>[] = [
  { header: 'Name', accessor: (d) => d.name },
  { header: 'Type', accessor: (d) => d.directiveType },
  { header: 'Assignment', accessor: (d) => d.assignmentType },
  { header: 'Category', accessor: (d) => d.category },
  { header: 'Active', accessor: (d) => d.isActive ? 'Yes' : 'No' },
  { header: 'Triggered Count', accessor: (d) => d.triggeredCount },
  { header: 'Effectiveness', accessor: (d) => d.effectivenessScore ? `${d.effectivenessScore}%` : 'N/A' },
  { header: 'Last Triggered', accessor: (d) => d.lastTriggered ? new Date(d.lastTriggered).toLocaleDateString() : 'Never' },
  { header: 'Created', accessor: (d) => new Date(d.createdAt).toLocaleDateString() },
];

export function exportDirectives(directives: MentorDirective[], format: ExportFormat): void {
  const filename = `directives-export-${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    const csv = generateCsv(directives, directiveColumns);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const html = generatePdfHtml(directives, directiveColumns, 'PT Directives Export');
    openPrintWindow(html);
  }
}

const groupColumns: ExportColumn<ClientGroup>[] = [
  { header: 'Name', accessor: (g) => g.name },
  { header: 'Type', accessor: (g) => g.type.replace('_', ' ') },
  { header: 'Description', accessor: (g) => g.description || '' },
  { header: 'Members', accessor: (g) => g.memberCount || g.clientIds.length },
  { header: 'Active', accessor: (g) => g.isActive ? 'Yes' : 'No' },
  { header: 'Avg Progress', accessor: (g) => g.avgProgress ? `${g.avgProgress}%` : 'N/A' },
  { header: 'Avg Compliance', accessor: (g) => g.avgCompliance ? `${g.avgCompliance}%` : 'N/A' },
  { header: 'Program', accessor: (g) => g.program?.name || 'N/A' },
  { header: 'Program Week', accessor: (g) => g.program?.currentWeek ? `Week ${g.program.currentWeek}` : 'N/A' },
];

export function exportGroups(groups: ClientGroup[], format: ExportFormat): void {
  const filename = `groups-export-${new Date().toISOString().split('T')[0]}`;
  
  if (format === 'csv') {
    const csv = generateCsv(groups, groupColumns);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const html = generatePdfHtml(groups, groupColumns, 'Groups Export');
    openPrintWindow(html);
  }
}

export function exportGroupMembers(groupName: string, members: Client[], format: ExportFormat): void {
  const filename = `${groupName.toLowerCase().replace(/\s+/g, '-')}-members-${new Date().toISOString().split('T')[0]}`;
  
  const memberExportColumns: ExportColumn<Client>[] = [
    { header: 'Name', accessor: (m) => m.name },
    { header: 'Email', accessor: (m) => m.email },
    { header: 'Phone', accessor: (m) => m.phone || '' },
    { header: 'Status', accessor: (m) => m.status },
    { header: 'Progress %', accessor: (m) => m.progress },
    { header: 'Last Login', accessor: (m) => m.lastLogin },
  ];
  
  if (format === 'csv') {
    const csv = generateCsv(members, memberExportColumns);
    downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  } else {
    const html = generatePdfHtml(members, memberExportColumns, `${groupName} - Members Export`);
    openPrintWindow(html);
  }
}
