import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { TestTube2 } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';

interface DemoDataIndicatorProps {
  show?: boolean;
  label?: string;
  className?: string;
}

export function DemoDataIndicator({ 
  show = true, 
  label = "Demo Data",
  className = "" 
}: DemoDataIndicatorProps) {
  const { isDemoMode } = useDemoMode();

  if (!isDemoMode || !show) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Badge 
            variant="outline" 
            className={`bg-orange-50 border-orange-200 text-orange-700 text-xs ${className}`}
          >
            <TestTube2 className="w-3 h-3 mr-1" />
            {label}
          </Badge>
        </TooltipTrigger>
        <TooltipContent>
          <p>This is demonstration data and won't affect real records</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}