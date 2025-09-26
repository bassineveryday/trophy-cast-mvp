import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Crown, Shield, Calendar, FileEdit, DollarSign, Leaf, Users, Settings, 
  BarChart3, Mail, UserPlus, ClipboardList, TrendingUp, Target, 
  MessageSquare, Book, Calculator, TreePine, Award, Megaphone 
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useUserEffectiveRoles, usePermission } from '@/hooks/useRBAC';
import { PermissionGuard } from '@/components/rbac/PermissionGuard';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  permission?: string;
  variant?: 'default' | 'outline' | 'secondary';
}

interface OfficerQuickActionsProps {
  clubId?: string;
}

export default function OfficerQuickActions({ clubId }: OfficerQuickActionsProps) {
  const navigate = useNavigate();
  const { data: userRoles = [] } = useUserEffectiveRoles(clubId);

  // Get club roles only
  const clubRoles = userRoles.filter(role => 
    role.role_type === 'club' && 
    (role.club_id === clubId || role.club_id === null)
  );

  const presidentActions: QuickAction[] = [
    {
      title: 'Club Management',
      description: 'Manage all club operations',
      icon: Settings,
      action: () => navigate(`/clubs/${clubId}/manage`),
      permission: 'club.manage.settings'
    },
    {
      title: 'Assign Roles',
      description: 'Manage officer assignments',
      icon: Crown,
      action: () => navigate(`/clubs/${clubId}/roles`),
      permission: 'club.assign.roles'
    },
    {
      title: 'Club Analytics',
      description: 'View member engagement stats',
      icon: BarChart3,
      action: () => navigate(`/clubs/${clubId}/analytics`),
      permission: 'club.view.analytics'
    },
    {
      title: 'Send Club Update',
      description: 'Mass communication to members',
      icon: Megaphone,
      action: () => navigate(`/clubs/${clubId}/communications`),
      permission: 'communication.send.email'
    },
    {
      title: 'Club Settings',
      description: 'Edit club info and bylaws',
      icon: Settings,
      action: () => navigate(`/clubs/${clubId}/settings`),
      permission: 'club.manage.settings'
    }
  ];

  const vicePresidentActions: QuickAction[] = [
    {
      title: 'Member Management',
      description: 'Approve and remove members',
      icon: UserPlus,
      action: () => navigate(`/clubs/${clubId}/members`),
      permission: 'club.manage.members'
    },
    {
      title: 'Event Planning',
      description: 'Organize club events',
      icon: Calendar,
      action: () => navigate(`/clubs/${clubId}/events`),
      permission: 'club.manage.events'
    },
    {
      title: 'Club Management',
      description: 'Backup access to management',
      icon: Shield,
      action: () => navigate(`/clubs/${clubId}/manage`),
      permission: 'club.manage.settings'
    },
    {
      title: 'Member Communication',
      description: 'Direct member messaging',
      icon: MessageSquare,
      action: () => navigate(`/clubs/${clubId}/messages`),
      permission: 'communication.send.email'
    }
  ];

  const tournamentDirectorActions: QuickAction[] = [
    {
      title: 'Create Tournament',
      description: 'Quick tournament setup',
      icon: Award,
      action: () => navigate('/tournaments/create'),
      permission: 'tournament.create'
    },
    {
      title: 'Manage Active Tournaments',
      description: 'Current tournaments',
      icon: Calendar,
      action: () => navigate('/tournaments/active'),
      permission: 'tournament.manage' 
    },
    {
      title: 'Tournament Registration',
      description: 'Member signups',
      icon: ClipboardList,
      action: () => navigate('/tournaments/registration'),
      permission: 'tournament.register.members'
    },
    {
      title: 'Live Scoring',
      description: 'Real-time management',
      icon: Target,
      action: () => navigate('/tournaments/live-scoring'),
      permission: 'tournament.record.results'
    },
    {
      title: 'Tournament Announcements',
      description: 'Tournament communications',
      icon: Megaphone,
      action: () => navigate('/tournaments/announcements'),
      permission: 'tournament.announcements'
    }
  ];

  const secretaryActions: QuickAction[] = [
    {
      title: 'Send Newsletter',
      description: 'Club communications',
      icon: Mail,
      action: () => navigate(`/clubs/${clubId}/newsletter`),
      permission: 'communication.send.email'
    },
    {
      title: 'Meeting Minutes',
      description: 'Record and edit minutes',
      icon: FileEdit,
      action: () => navigate(`/clubs/${clubId}/minutes`),
      permission: 'communication.manage.records'
    },
    {
      title: 'Member Directory',
      description: 'Manage member information',
      icon: Book,
      action: () => navigate(`/clubs/${clubId}/directory`),
      permission: 'club.view.members'
    },
    {
      title: 'Club Records',
      description: 'Maintain documentation',
      icon: ClipboardList,
      action: () => navigate(`/clubs/${clubId}/records`),
      permission: 'communication.manage.records'
    },
    {
      title: 'Attendance Tracking',
      description: 'Track meeting attendance',
      icon: Users,
      action: () => navigate(`/clubs/${clubId}/attendance`),
      permission: 'club.track.attendance'
    }
  ];

  const treasurerActions: QuickAction[] = [
    {
      title: 'Collect Dues',
      description: 'Payment processing',
      icon: DollarSign,
      action: () => navigate(`/clubs/${clubId}/dues`),
      permission: 'financial.manage.dues'
    },
    {
      title: 'Financial Reports',
      description: 'Club finances overview',
      icon: BarChart3,
      action: () => navigate(`/clubs/${clubId}/finances`),
      permission: 'financial.view.reports'
    },
    {
      title: 'Tournament Fees',
      description: 'Fee collection management',
      icon: Calculator,
      action: () => navigate(`/clubs/${clubId}/tournament-fees`),
      permission: 'financial.manage.fees'
    },
    {
      title: 'Budget Planning',
      description: 'Annual budget management',
      icon: TrendingUp,
      action: () => navigate(`/clubs/${clubId}/budget`),
      permission: 'financial.manage.budget'
    },
    {
      title: 'Expense Tracking',
      description: 'Track club expenses',
      icon: Calculator,
      action: () => navigate(`/clubs/${clubId}/expenses`),
      permission: 'financial.track.expenses'
    }
  ];

  const conservationDirectorActions: QuickAction[] = [
    {
      title: 'Create Conservation Project',
      description: 'Start new initiatives',
      icon: TreePine,
      action: () => navigate(`/clubs/${clubId}/conservation/new`),
      permission: 'conservation.manage.projects'
    },
    {
      title: 'Post Educational Content',
      description: 'Share conservation education',
      icon: Book,
      action: () => navigate(`/clubs/${clubId}/conservation/education`),
      permission: 'conservation.create.content'
    },
    {
      title: 'Conservation Reports',
      description: 'Submit project reports',
      icon: FileEdit,
      action: () => navigate(`/clubs/${clubId}/conservation/reports`),
      permission: 'conservation.submit.reports'
    },
    {
      title: 'Habitat Projects',
      description: 'Manage habitat work',
      icon: Leaf,
      action: () => navigate(`/clubs/${clubId}/habitat`),
      permission: 'conservation.manage.habitat'
    },
    {
      title: 'Environmental Updates',
      description: 'Share environmental news',
      icon: Megaphone,
      action: () => navigate(`/clubs/${clubId}/environmental-updates`),
      permission: 'conservation.share.updates'
    }
  ];

  // Determine which actions to show based on user roles
  const getActionsForRole = (roleName: string) => {
    switch (roleName) {
      case 'president':
      case 'club_admin':
        return presidentActions;
      case 'vice_president':
        return vicePresidentActions;
      case 'tournament_director':
        return tournamentDirectorActions;
      case 'secretary':
        return secretaryActions;
      case 'treasurer':
        return treasurerActions;
      case 'conservation_director':
        return conservationDirectorActions;
      default:
        return [];
    }
  };

  // Get all unique actions for user's roles
  const allActions = clubRoles.reduce<QuickAction[]>((acc, role) => {
    const roleActions = getActionsForRole(role.role_name);
    roleActions.forEach(action => {
      if (!acc.find(existing => existing.title === action.title)) {
        acc.push(action);
      }
    });
    return acc;
  }, []);

  const getRoleIcon = (roleName: string) => {
    const icons = {
      'club_admin': Crown,
      'president': Crown,
      'vice_president': Shield,
      'tournament_director': Calendar,
      'secretary': FileEdit,
      'treasurer': DollarSign,
      'conservation_director': Leaf,
    } as const;
    return icons[roleName as keyof typeof icons] || Users;
  };

  const getRoleColor = (roleName: string) => {
    const colors = {
      'club_admin': 'destructive',
      'president': 'destructive',
      'vice_president': 'default',
      'tournament_director': 'secondary',
      'secretary': 'secondary',
      'treasurer': 'secondary',
      'conservation_director': 'secondary',
    } as const;
    return colors[roleName as keyof typeof colors] || 'outline';
  };

  if (clubRoles.length === 0 || allActions.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5" />
              Officer Quick Actions
            </CardTitle>
            <CardDescription>
              Quick access to your officer responsibilities
            </CardDescription>
          </div>
          <div className="flex gap-2">
            {clubRoles.map((role, index) => {
              const Icon = getRoleIcon(role.role_name);
              return (
                <Badge 
                  key={index} 
                  variant={getRoleColor(role.role_name) as any}
                  className="flex items-center gap-1"
                >
                  <Icon className="h-3 w-3" />
                  {role.role_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
              );
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {allActions.map((action, index) => (
            <PermissionGuard 
              key={index} 
              permission={action.permission || ''} 
              clubId={clubId}
            >
              <Button
                variant={action.variant || 'outline'}
                className="h-auto p-4 flex flex-col items-center gap-2 hover:shadow-md transition-shadow"
                onClick={action.action}
              >
                <action.icon className="h-6 w-6" />
                <div className="text-center">
                  <div className="font-medium text-sm">{action.title}</div>
                  <div className="text-xs text-muted-foreground mt-1 leading-tight">
                    {action.description}
                  </div>
                </div>
              </Button>
            </PermissionGuard>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}