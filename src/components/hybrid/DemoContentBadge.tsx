import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';

interface DemoContentBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'subtle' | 'outline';
  showIcon?: boolean;
  className?: string;
}

export function DemoContentBadge({ 
  size = 'sm', 
  variant = 'subtle',
  showIcon = true,
  className = ''
}: DemoContentBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5'
  };

  const variantClasses = {
    default: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
    subtle: 'bg-muted text-muted-foreground border-muted-foreground/20',
    outline: 'border border-purple-200 text-purple-600 dark:border-purple-800 dark:text-purple-400'
  };

  return (
    <Badge 
      variant="secondary"
      className={`
        ${sizeClasses[size]} 
        ${variantClasses[variant]}
        ${className}
      `}
    >
      {showIcon && <Sparkles className="w-3 h-3 mr-1" />}
      Demo
    </Badge>
  );
}