import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Info } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { cn } from '@/lib/utils';

interface DemoDataBadgeProps {
  className?: string;
  variant?: 'default' | 'outline' | 'secondary';
  size?: 'sm' | 'default';
}

export function DemoDataBadge({ className, variant = 'secondary', size = 'sm' }: DemoDataBadgeProps) {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode) {
    return null;
  }

  return (
    <Badge 
      variant={variant}
      className={cn(
        "bg-orange-100 text-orange-800 border-orange-200 text-xs",
        size === 'sm' && "text-xs px-2 py-0.5",
        className
      )}
    >
      <Info className="w-3 h-3 mr-1" />
      Demo Data
    </Badge>
  );
}