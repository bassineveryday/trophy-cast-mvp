import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Crown, Shield, Calendar, FileText, DollarSign, Leaf, User } from 'lucide-react';
import { useDemoMode, DEMO_USERS } from '@/contexts/DemoModeContext';
import { useToast } from '@/hooks/use-toast';

const roleIcons = {
  president: Crown,
  vice_president: Shield,
  tournament_director: Calendar,
  secretary: FileText,
  treasurer: DollarSign,
  conservation_director: Leaf,
  member: User
};

export function DemoQuickSwitcher() {
  const { isDemoMode, currentDemoUser, switchToDemoUser } = useDemoMode();
  const { toast } = useToast();

  if (!isDemoMode) {
    return null;
  }

  const handleQuickSwitch = (user: typeof DEMO_USERS[0]) => {
    switchToDemoUser(user);
    toast({
      title: "Demo Role Switched",
      description: `Now viewing as ${user.name} - ${user.club_role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`,
    });
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap">
        Quick Switch:
      </span>
      {DEMO_USERS.slice(0, 4).map((user) => {
        const RoleIcon = roleIcons[user.club_role as keyof typeof roleIcons];
        const isCurrentUser = currentDemoUser?.id === user.id;
        
        return (
          <Button
            key={user.id}
            variant={isCurrentUser ? "default" : "outline"}
            size="sm"
            onClick={() => handleQuickSwitch(user)}
            disabled={isCurrentUser}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            <RoleIcon className="w-3 h-3" />
            <span className="text-xs">{user.name.split(' ')[0]}</span>
            {isCurrentUser && (
              <Badge variant="secondary" className="ml-1 text-xs">
                Current
              </Badge>
            )}
          </Button>
        );
      })}
      
      <Button variant="ghost" size="sm" className="text-xs" onClick={() => {
        // This would open the full user switcher dialog
        document.querySelector('[data-demo-switcher-trigger]')?.dispatchEvent(new Event('click'));
      }}>
        <Users className="w-3 h-3 mr-1" />
        All Users
      </Button>
    </div>
  );
}