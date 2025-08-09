import { ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Cloud, Database, Mail, MessageSquare, Zap } from 'lucide-react';

export interface IntegrationInfo {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: ReactNode;
}

export const INTEGRATIONS: IntegrationInfo[] = [
  { id: 'chat', name: 'Team Chat', category: 'Communication', description: 'Send updates to your team channels.', icon: <MessageSquare className="h-5 w-5" /> },
  { id: 'email', name: 'Email', category: 'Communication', description: 'Email notifications and digests.', icon: <Mail className="h-5 w-5" /> },
  { id: 'calendar', name: 'Calendar', category: 'Productivity', description: 'Sync events and timelines.', icon: <Calendar className="h-5 w-5" /> },
  { id: 'storage', name: 'Cloud Storage', category: 'Files', description: 'Link files from your drive.', icon: <Cloud className="h-5 w-5" /> },
  { id: 'db', name: 'Database', category: 'Data', description: 'Pull data from your DB.', icon: <Database className="h-5 w-5" /> },
  { id: 'zaps', name: 'Automation', category: 'Automation', description: 'Automate workflows.', icon: <Zap className="h-5 w-5" /> },
];

interface IntegrationLogoCloudProps {
  onSelect: (integration: IntegrationInfo) => void;
  className?: string;
}

export function IntegrationLogoCloud({ onSelect, className }: IntegrationLogoCloudProps): JSX.Element {
  return (
    <div className={cn('grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4', className)}>
      {INTEGRATIONS.map((it) => (
        <Button
          key={it.id}
          variant="outline"
          className="h-20 flex flex-col items-center justify-center gap-2 border-border/50"
          onClick={() => onSelect(it)}
          aria-label={`Open ${it.name} details`}
        >
          <span className="text-primary">{it.icon}</span>
          <span className="text-sm font-medium">{it.name}</span>
        </Button>
      ))}
    </div>
  );
}
