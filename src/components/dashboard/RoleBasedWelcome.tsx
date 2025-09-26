import React from 'react';
import { Crown, Shield, Calendar, FileEdit, DollarSign, Leaf, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserEffectiveRoles } from '@/hooks/useRBAC';

interface RoleBasedWelcomeProps {
  clubId?: string;
  userName?: string;
}

export default function RoleBasedWelcome({ clubId, userName }: RoleBasedWelcomeProps) {
  const { data: userRoles = [] } = useUserEffectiveRoles(clubId);

  // Get club roles only
  const clubRoles = userRoles.filter(role => 
    role.role_type === 'club' && 
    (role.club_id === clubId || role.club_id === null)
  );

  const platformRoles = userRoles.filter(role => role.role_type === 'platform');

  const getRoleIcon = (roleName: string) => {
    const icons = {
      'super_admin': Crown,
      'platform_admin': Shield,
      'club_admin': Crown,
      'president': Crown,
      'vice_president': Shield,
      'tournament_director': Calendar,
      'secretary': FileEdit,
      'treasurer': DollarSign,
      'conservation_director': Leaf,
      'member': Users,
      'guest': Users,
    } as const;
    return icons[roleName as keyof typeof icons] || Users;
  };

  const getRoleColor = (roleName: string, roleType: string) => {
    if (roleType === 'platform') {
      return 'destructive';
    }
    
    const colors = {
      'club_admin': 'destructive',
      'president': 'destructive',
      'vice_president': 'default',
      'tournament_director': 'secondary',
      'secretary': 'secondary',
      'treasurer': 'secondary',
      'conservation_director': 'secondary',
      'member': 'outline',
      'guest': 'outline',
    } as const;
    return colors[roleName as keyof typeof colors] || 'outline';
  };

  const getWelcomeMessage = () => {
    if (platformRoles.length > 0) {
      const role = platformRoles[0];
      return `Welcome back, ${role.role_name === 'super_admin' ? 'Super Admin' : 'Platform Admin'}!`;
    }

    if (clubRoles.length > 0) {
      const primaryRole = clubRoles[0];
      const roleTitle = primaryRole.role_name
        .replace('_', ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      return `Welcome back, ${roleTitle}!`;
    }

    return `Welcome back${userName ? `, ${userName}` : ''}!`;
  };

  const hasOfficerRole = clubRoles.some(role => 
    !['member', 'guest'].includes(role.role_name)
  );

  if (!hasOfficerRole && platformRoles.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">{getWelcomeMessage()}</h2>
          <p className="text-sm text-muted-foreground">
            {hasOfficerRole 
              ? "Your officer dashboard is ready with quick access to your responsibilities."
              : "You have administrative access to platform features."
            }
          </p>
        </div>
        <div className="flex flex-wrap gap-1">
          {platformRoles.map((role, index) => {
            const Icon = getRoleIcon(role.role_name);
            return (
              <Badge 
                key={`platform-${index}`} 
                variant={getRoleColor(role.role_name, role.role_type) as any}
                className="flex items-center gap-1"
              >
                <Icon className="h-3 w-3" />
                {role.role_name === 'super_admin' ? 'Super Admin' : 'Platform Admin'}
              </Badge>
            );
          })}
          {clubRoles.map((role, index) => {
            const Icon = getRoleIcon(role.role_name);
            return (
              <Badge 
                key={`club-${index}`} 
                variant={getRoleColor(role.role_name, role.role_type) as any}
                className="flex items-center gap-1"
              >
                <Icon className="h-3 w-3" />
                {role.role_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}