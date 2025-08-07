import { cn } from "@/lib/utils";

interface LoadingSkeletonProps {
  className?: string;
  variant?: 'default' | 'card' | 'text' | 'avatar' | 'button';
  lines?: number;
  animated?: boolean;
}

const variants = {
  default: "h-4 bg-muted rounded animate-pulse",
  card: "h-32 bg-muted rounded-lg animate-pulse",
  text: "h-3 bg-muted rounded animate-pulse",
  avatar: "h-10 w-10 bg-muted rounded-full animate-pulse",
  button: "h-10 bg-muted rounded-md animate-pulse w-24"
};

export function LoadingSkeleton({ 
  className, 
  variant = 'default', 
  lines = 1,
  animated = true 
}: LoadingSkeletonProps) {
  if (lines > 1) {
    return (
      <div className={cn("space-y-2", className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              variants[variant],
              !animated && "animate-none",
              i === lines - 1 && "w-3/4" // Last line is shorter
            )}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        variants[variant],
        !animated && "animate-none",
        className
      )}
    />
  );
}

// Pre-built skeleton components for common use cases
export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <LoadingSkeleton variant="text" className="w-1/3" />
      <LoadingSkeleton variant="card" />
      <LoadingSkeleton variant="text" lines={2} />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NavigationSkeleton() {
  return (
    <div className="flex items-center justify-between p-4">
      <LoadingSkeleton variant="button" className="w-32" />
      <div className="flex space-x-4">
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="button" />
        <LoadingSkeleton variant="avatar" />
      </div>
    </div>
  );
}