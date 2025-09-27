import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Shield, Calendar, FileText, DollarSign, Leaf, User } from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { cn } from '@/lib/utils';

const roleIcons = {
  president: Crown,
  vice_president: Shield,
  tournament_director: Calendar,
  secretary: FileText,
  treasurer: DollarSign,
  conservation_director: Leaf,
  member: User
};

const roleColors = {
  president: 'bg-amber-100 text-amber-800 border-amber-200',
  vice_president: 'bg-blue-100 text-blue-800 border-blue-200',
  tournament_director: 'bg-green-100 text-green-800 border-green-200',
  secretary: 'bg-purple-100 text-purple-800 border-purple-200',
  treasurer: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  conservation_director: 'bg-teal-100 text-teal-800 border-teal-200',
  member: 'bg-slate-100 text-slate-800 border-slate-200'
};

interface DemoRoleIndicatorProps {
  className?: string;
  showIcon?: boolean;
  size?: 'sm' | 'default';
}

export function DemoRoleIndicator({ className, showIcon = true, size = 'default' }: DemoRoleIndicatorProps) {
  const { isDemoMode, currentDemoUser } = useDemoMode();

  if (!isDemoMode || !currentDemoUser) {
    return null;
  }

  const role = currentDemoUser.club_role;
  const RoleIcon = roleIcons[role as keyof typeof roleIcons] || User;
  const colorClass = roleColors[role as keyof typeof roleColors] || roleColors.member;

  return (
    <Badge 
      variant="outline"
      className={cn(
        colorClass,
        "flex items-center gap-1",
        size === 'sm' && "text-xs px-2 py-0.5",
        className
      )}
    >
      {showIcon && <RoleIcon className="w-3 h-3" />}
      {role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
    </Badge>
  );
}