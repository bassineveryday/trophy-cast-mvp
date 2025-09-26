import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, Shield, Calendar, FileText, DollarSign, Leaf, User,
  Users, Trophy, TrendingUp, DollarSign as Dollar, 
  Bell, MessageSquare, Settings, Plus, BarChart3
} from 'lucide-react';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { DemoPermissionGuard } from './DemoPermissionGuard';
import { DemoDataIndicator } from './DemoDataIndicator';

const roleQuickActions = {
  president: [
    { icon: Users, label: 'Manage Officers', permission: 'officer_assignments' },
    { icon: Settings, label: 'Club Settings', permission: 'club_management' },
    { icon: BarChart3, label: 'Club Analytics', permission: 'financial_overview' },
    { icon: Bell, label: 'Send Announcements', permission: 'member_management' }
  ],
  vice_president: [
    { icon: Calendar, label: 'Plan Events', permission: 'event_planning' },
    { icon: Users, label: 'Member Directory', permission: 'member_management' },
    { icon: MessageSquare, label: 'Communications', permission: 'coordination_tools' },
    { icon: Settings, label: 'Backup Admin', permission: 'backup_admin_access' }
  ],
  tournament_director: [
    { icon: Plus, label: 'Create Tournament', permission: 'tournament_creation' },
    { icon: Trophy, label: 'Live Scoring', permission: 'live_scoring' },
    { icon: Calendar, label: 'Tournament Calendar', permission: 'tournament_management' },
    { icon: Settings, label: 'Equipment Setup', permission: 'equipment_management' }
  ],
  secretary: [
    { icon: FileText, label: 'Meeting Minutes', permission: 'meeting_minutes' },
    { icon: MessageSquare, label: 'Newsletter', permission: 'newsletter_tools' },
    { icon: Users, label: 'Member Records', permission: 'member_directory' },
    { icon: Bell, label: 'Club Communications', permission: 'club_correspondence' }
  ],
  treasurer: [
    { icon: Dollar, label: 'Financial Dashboard', permission: 'financial_dashboard' },
    { icon: TrendingUp, label: 'Budget Planning', permission: 'budget_planning' },
    { icon: DollarSign, label: 'Collect Dues', permission: 'dues_collection' },
    { icon: BarChart3, label: 'Expense Reports', permission: 'expense_tracking' }
  ],
  conservation_director: [
    { icon: Leaf, label: 'Conservation Projects', permission: 'conservation_projects' },
    { icon: FileText, label: 'Educational Content', permission: 'educational_content' },
    { icon: BarChart3, label: 'Environmental Reports', permission: 'environmental_reporting' },
    { icon: Settings, label: 'Habitat Tracking', permission: 'habitat_tracking' }
  ],
  member: [
    { icon: User, label: 'My Profile', permission: 'personal_profile' },
    { icon: Trophy, label: 'Log Catch', permission: 'catch_logging' },
    { icon: Calendar, label: 'Join Tournament', permission: 'tournament_participation' },
    { icon: MessageSquare, label: 'Club Feed', permission: 'personal_profile' }
  ]
};

const roleDashboardStats = {
  president: [
    { label: 'Active Members', value: '28', change: '+2 this month' },
    { label: 'Club Revenue', value: '$4,250', change: '+15% vs last year' },
    { label: 'Tournament Participation', value: '92%', change: 'Above target' },
    { label: 'Officer Positions Filled', value: '6/6', change: 'All filled' }
  ],
  vice_president: [
    { label: 'Events Planned', value: '12', change: '+3 this quarter' },
    { label: 'Member Engagement', value: '89%', change: '+5% improvement' },
    { label: 'Event Attendance', value: '24 avg', change: 'Strong turnout' },
    { label: 'Volunteer Hours', value: '156', change: 'This month' }
  ],
  tournament_director: [
    { label: 'Tournaments This Year', value: '8', change: '2 remaining' },
    { label: 'Average Participation', value: '22', change: '+3 vs last year' },
    { label: 'Tournament Revenue', value: '$2,840', change: 'On target' },
    { label: 'Equipment Status', value: '98%', change: 'Ready for use' }
  ],
  secretary: [
    { label: 'Meeting Minutes', value: '9', change: 'All up to date' },
    { label: 'Newsletter Subscribers', value: '45', change: '+8 new' },
    { label: 'Member Records', value: '100%', change: 'Complete' },
    { label: 'Communications Sent', value: '23', change: 'This month' }
  ],
  treasurer: [
    { label: 'Club Balance', value: '$8,450', change: '+12% vs last year' },
    { label: 'Outstanding Dues', value: '$320', change: '2 members pending' },
    { label: 'Monthly Expenses', value: '$890', change: 'Within budget' },
    { label: 'Tournament Fees Collected', value: '94%', change: 'Above average' }
  ],
  conservation_director: [
    { label: 'Active Projects', value: '3', change: '1 new this quarter' },
    { label: 'Habitat Improvements', value: '450 sq ft', change: 'This year' },
    { label: 'Educational Posts', value: '18', change: 'High engagement' },
    { label: 'Volunteer Participation', value: '67%', change: 'Excellent' }
  ],
  member: [
    { label: 'Tournament Entries', value: '6', change: 'This season' },
    { label: 'Personal Best', value: '6.8 lbs', change: 'New PB this month!' },
    { label: 'Club Ranking', value: '#12', change: 'Moved up 3 spots' },
    { label: 'Catches Logged', value: '34', change: 'This year' }
  ]
};

export function DemoRoleBasedDashboard() {
  const { currentDemoUser, isDemoMode } = useDemoMode();

  if (!isDemoMode || !currentDemoUser) {
    return null;
  }

  const userRole = currentDemoUser.club_role as keyof typeof roleQuickActions;
  const quickActions = roleQuickActions[userRole] || [];
  const stats = roleDashboardStats[userRole] || [];

  const getRoleIcon = () => {
    const roleIcons = {
      president: Crown,
      vice_president: Shield,
      tournament_director: Calendar,
      secretary: FileText,
      treasurer: DollarSign,
      conservation_director: Leaf,
      member: User
    };
    return roleIcons[userRole] || User;
  };

  const RoleIcon = getRoleIcon();

  return (
    <div className="space-y-6">
      {/* Role Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <RoleIcon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">
                  {currentDemoUser.club_role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Dashboard
                </CardTitle>
                <CardDescription>
                  Welcome back, {currentDemoUser.name} - {currentDemoUser.club_abbreviation}
                </CardDescription>
              </div>
            </div>
            <DemoDataIndicator />
          </div>
        </CardHeader>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks for your role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <DemoPermissionGuard 
                key={index} 
                permission={action.permission}
                showFallback={false}
              >
                <Button 
                  variant="outline" 
                  className="h-20 flex-col gap-2 hover:bg-primary/5"
                >
                  <action.icon className="w-5 h-5" />
                  <span className="text-xs text-center">{action.label}</span>
                </Button>
              </DemoPermissionGuard>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Your Overview</CardTitle>
          <CardDescription>
            Key metrics for your responsibilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Role-Specific Content Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DemoPermissionGuard permission="financial_overview">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Financial Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Monthly Budget Usage</span>
                  <span>78%</span>
                </div>
                <Progress value={78} className="h-2" />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>$2,340 of $3,000</span>
                  <span>$660 remaining</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </DemoPermissionGuard>

        <DemoPermissionGuard permission="tournament_management">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Tournaments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Lake Guntersville Open</p>
                    <p className="text-sm text-muted-foreground">Oct 15, 2024</p>
                  </div>
                  <Badge>18 registered</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Wheeler Lake Classic</p>
                    <p className="text-sm text-muted-foreground">Nov 5, 2024</p>
                  </div>
                  <Badge variant="outline">Planning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </DemoPermissionGuard>

        <DemoPermissionGuard permission="member_management">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent Member Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <User className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Jennifer Hayes joined</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Robert Foster - Tournament Win</p>
                    <p className="text-sm text-muted-foreground">5 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </DemoPermissionGuard>

        <DemoPermissionGuard permission="conservation_projects">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Conservation Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Wilson Lake Habitat</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Fish Attractors</span>
                    <span className="text-sm">60%</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
        </DemoPermissionGuard>
      </div>
    </div>
  );
}