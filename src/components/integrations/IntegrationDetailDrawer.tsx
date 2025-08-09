import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import type { IntegrationInfo } from './IntegrationLogoCloud';

interface IntegrationDetailDrawerProps {
  integration: IntegrationInfo | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntegrationDetailDrawer({ integration, open, onOpenChange }: IntegrationDetailDrawerProps): JSX.Element {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{integration?.name ?? 'Integration'}</SheetTitle>
          <SheetDescription>{integration?.category}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            {integration?.description || 'Connect to external tools to enhance your workflows. This is a demo view.'}
          </p>
          <div className="rounded-lg border border-dashed border-border/60 p-4 text-sm text-muted-foreground">
            OAuth demo placeholder — clicking Connect will show a mock success.
          </div>
          <div className="flex gap-2">
            <Button onClick={() => alert('Connected (demo)')}>Connect</Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
