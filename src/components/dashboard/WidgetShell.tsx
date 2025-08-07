import { cn } from '@/lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ReactNode } from 'react';

export type WidgetStatus = 'default' | 'loading' | 'empty' | 'error';
export type WidgetVariant = 'default' | 'subtle' | 'primary' | 'accent' | 'glass';
export type WidgetSize = 'sm' | 'md' | 'lg';

interface WidgetShellProps {
  title: string;
  icon?: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  footer?: ReactNode;
  status?: WidgetStatus;
  variant?: WidgetVariant;
  size?: WidgetSize;
  className?: string;
  contentClassName?: string;
  children?: ReactNode;
}

const variantCls: Record<WidgetVariant, string> = {
  default: 'bg-card',
  subtle: 'bg-gradient-subtle',
  primary: 'bg-gradient-primary text-primary-foreground',
  accent: 'bg-gradient-accent text-accent-foreground',
  glass: 'glass',
};

const sizeCls: Record<WidgetSize, { header: string; content: string; title: string }> = {
  sm: { header: 'p-4', content: 'px-4 pb-4 pt-0', title: 'text-base' },
  md: { header: 'p-5', content: 'px-5 pb-5 pt-0', title: 'text-lg' },
  lg: { header: 'p-6', content: 'px-6 pb-6 pt-0', title: 'text-xl' },
};

function WidgetEmptyState({ message }: { message?: string }) {
  return (
    <div className="text-center text-muted-foreground text-sm py-6" role="status" aria-live="polite">
      {message ?? 'Nothing to show yet'}
    </div>
  );
}

function WidgetLoading() {
  return (
    <div className="space-y-3" role="status" aria-live="polite">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-2 w-full" />
    </div>
  );
}

function WidgetError({ message }: { message?: string }) {
  return (
    <div className="text-sm text-destructive py-6" role="alert">
      {message ?? 'Something went wrong'}
    </div>
  );
}

export function WidgetShell({
  title,
  icon,
  subtitle,
  actions,
  footer,
  status = 'default',
  variant = 'default',
  size = 'md',
  className,
  contentClassName,
  children,
}: WidgetShellProps) {
  const s = sizeCls[size];

  return (
    <Card className={cn('h-full card-premium animate-fade-in', variantCls[variant], className)}>
      <CardHeader className={cn('pb-3 flex flex-row items-start gap-3', s.header)}>
        {icon && <div className="mt-0.5" aria-hidden>{icon}</div>}
        <div className="flex-1 min-w-0">
          <CardTitle className={cn('flex items-center gap-2', s.title)}>
            <span className="truncate">{title}</span>
          </CardTitle>
          {subtitle && (
            <div className="text-muted-foreground text-sm mt-1 line-clamp-2">{subtitle}</div>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </CardHeader>

      <CardContent className={cn(s.content, contentClassName)}>
        {status === 'loading' && <WidgetLoading />}
        {status === 'empty' && <WidgetEmptyState />}
        {status === 'error' && <WidgetError />}
        {status === 'default' && children}
      </CardContent>

      {footer && <CardFooter className="pt-0">{footer}</CardFooter>}
    </Card>
  );
}
