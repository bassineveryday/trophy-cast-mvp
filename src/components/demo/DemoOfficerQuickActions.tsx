import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, Settings, BarChart3, Bell, Calendar, MessageSquare, Plus, Trophy,
  FileText, DollarSign, TrendingUp, Leaf, User, Crown, Shield
} from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { useToast } from '@/hooks/use-toast';

const roleQuickActions = {
  president: [
    { icon: Users, label: 'Manage Officers', action: 'officer_management', description: 'Assign and manage officer roles' },
    { icon: Settings, label: 'Club Settings', action: 'club_settings', description: 'Configure club preferences and rules' },
    { icon: BarChart3, label: 'Club Analytics', action: 'analytics', description: 'View club performance metrics' },
    { icon: Bell, label: 'Send Announcements', action: 'announcements', description: 'Communicate with all members' },
    { icon: DollarSign, label: 'Financial Overview', action: 'finances', description: 'Review club financial status' },
    { icon: Calendar, label: 'Event Planning', action: 'events', description: 'Plan and schedule club events' }
  ],
  vice_president: [
    { icon: Calendar, label: 'Plan Events', action: 'event_planning', description: 'Organize upcoming club activities' },
    { icon: Users, label: 'Member Directory', action: 'member_management', description: 'Manage member information' },
    { icon: MessageSquare, label: 'Communications', action: 'communications', description: 'Handle club communications' },
    { icon: Bell, label: 'Coordination Tools', action: 'coordination', description: 'Coordinate with other officers' }
  ],
  tournament_director: [
    { icon: Plus, label: 'Create Tournament', action: 'create_tournament', description: 'Set up new tournaments' },
    { icon: Trophy, label: 'Live Scoring', action: 'live_scoring', description: 'Manage tournament scoring' },
    { icon: Calendar, label: 'Tournament Calendar', action: 'tournament_calendar', description: 'View tournament schedule' },
    { icon: Settings, label: 'Equipment Setup', action: 'equipment', description: 'Manage tournament equipment' },
    { icon: Users, label: 'Registration Tools', action: 'registration', description: 'Handle tournament registration' }
  ],
  secretary: [
    { icon: FileText, label: 'Meeting Minutes', action: 'meeting_minutes', description: 'Record and manage meeting minutes' },
    { icon: MessageSquare, label: 'Newsletter', action: 'newsletter', description: 'Create and send newsletters' },
    { icon: Users, label: 'Member Records', action: 'member_records', description: 'Maintain member documentation' },
    { icon: Bell, label: 'Club Communications', action: 'club_comms', description: 'Handle official communications' }
  ],
  treasurer: [
    { icon: DollarSign, label: 'Financial Dashboard', action: 'financial_dashboard', description: 'View financial overview' },
    { icon: TrendingUp, label: 'Budget Planning', action: 'budget_planning', description: 'Plan and track budgets' },
    { icon: BarChart3, label: 'Collect Dues', action: 'dues_collection', description: 'Manage member dues collection' },
    { icon: FileText, label: 'Expense Reports', action: 'expense_reports', description: 'Generate expense reports' }
  ],
  conservation_director: [
    { icon: Leaf, label: 'Conservation Projects', action: 'conservation_projects', description: 'Manage environmental projects' },
    { icon: FileText, label: 'Educational Content', action: 'educational_content', description: 'Create educational materials' },
    { icon: BarChart3, label: 'Environmental Reports', action: 'environmental_reports', description: 'Track environmental impact' },
    { icon: Settings, label: 'Habitat Tracking', action: 'habitat_tracking', description: 'Monitor habitat improvements' }
  ],
  member: [
    { icon: User, label: 'My Profile', action: 'profile', description: 'View and edit personal profile' },
    { icon: Trophy, label: 'Log Catch', action: 'log_catch', description: 'Record fishing catches' },
    { icon: Calendar, label: 'Join Tournament', action: 'join_tournament', description: 'Register for tournaments' },
    { icon: MessageSquare, label: 'Club Feed', action: 'club_feed', description: 'View club activity feed' }
  ]
};

const getRoleIcon = (role: string) => {
  const roleIcons = {
    president: Crown,
    vice_president: Shield,
    tournament_director: Calendar,
    secretary: FileText,
    treasurer: DollarSign,
    conservation_director: Leaf,
    member: User
  };
  return roleIcons[role as keyof typeof roleIcons] || User;
};

export function DemoOfficerQuickActions() {
  const { isDemoMode, currentDemoUser } = useDemoMode();
  const { toast } = useToast();

  if (!isDemoMode || !currentDemoUser) {
    return null;
  }

  const userRole = currentDemoUser.club_role as keyof typeof roleQuickActions;
  const quickActions = roleQuickActions[userRole] || [];
  const RoleIcon = getRoleIcon(currentDemoUser.club_role);
  const isOfficer = ['president', 'vice_president', 'tournament_director', 'secretary', 'treasurer', 'conservation_director'].includes(currentDemoUser.club_role);

  const handleDemoAction = (actionName: string, actionLabel: string) => {
    toast({
      title: "Demo Action",
      description: `${actionLabel} feature is available in demo mode. This would normally ${actionName.replace('_', ' ')} in a real club environment.`,
    });
  };

  return (
    <Card className="border-primary/20">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <RoleIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <CardTitle className="text-lg">
              {isOfficer ? 'Officer Quick Actions' : 'Member Quick Actions'}
            </CardTitle>
            <CardDescription>
              {isOfficer ? `${currentDemoUser.club_role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} tools and responsibilities` : 'Member features and activities'}
            </CardDescription>
          </div>
          {isOfficer && (
            <Badge variant="outline" className="ml-auto">
              Officer Access
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/30"
              onClick={() => handleDemoAction(action.action, action.label)}
            >
              <div className="flex items-center gap-2 w-full">
                <action.icon className="w-4 h-4 text-primary" />
                <span className="font-medium text-sm">{action.label}</span>
              </div>
              <p className="text-xs text-muted-foreground text-left">
                {action.description}
              </p>
            </Button>
          ))}
        </div>
        
        {isOfficer && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-xs text-muted-foreground">
              💡 <strong>Demo Tip:</strong> As a {currentDemoUser.club_role.replace('_', ' ')}, you have access to specialized tools for managing {currentDemoUser.club}. Click any action above to see what each feature would do in a live environment.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}