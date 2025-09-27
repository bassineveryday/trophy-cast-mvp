import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface LoadingStateProps {
  title?: string;
  description?: string;
  className?: string;
  variant?: 'card' | 'inline' | 'fullscreen';
  rows?: number;
}

export function LoadingState({ 
  title = "Loading...", 
  description,
  className,
  variant = 'card',
  rows = 3
}: LoadingStateProps) {
  if (variant === 'fullscreen') {
    return (
      <div className={cn("min-h-screen flex items-center justify-center", className)}>
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <div>
            <h2 className="text-lg font-semibold">{title}</h2>
            {description && <p className="text-muted-foreground">{description}</p>}
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn("flex items-center space-x-2", className)}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="text-sm text-muted-foreground">{title}</span>
      </div>
    );
  }

  // Card variant (default)
  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-muted rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </div>
          </div>
          
          {[...Array(rows)].map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="h-4 bg-muted rounded"></div>
              <div className="h-4 bg-muted rounded w-5/6"></div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}