import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Fish, 
  Target, 
  Users, 
  Calendar, 
  Settings, 
  Bell, 
  MessageSquare,
  PlusCircle,
  BarChart3,
  FileText,
  ArrowRight,
  Crown,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoAwareRoles } from '@/hooks/useDemoRoles';
import UniversalAvatar from '@/components/UniversalAvatar';
import { mockUser, mockCareerStats } from '@/data/mockData';

interface QuickAction {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  color: string;
  badge?: string;
  priority: 'primary' | 'secondary';
}

export function RoleBasedDashboard() {
  const { profile } = useAuth();
  const { isClubOfficer, isPresident, isMember, isDemoMode, currentDemoUser, getUserProfile } = useDemoAwareRoles();
  
  // Get user profile (demo or real)
  const userProfile = getUserProfile() || {
    name: profile?.name || mockUser.name,
    role: 'member',
    club: 'Alabama Bass Nation - Chapter 12',
    avatar_url: profile?.avatar_url || '/placeholder.svg'
  };

  // Define actions based on user role
  const getMemberActions = (): QuickAction[] => [
    {
      title: 'Upcoming Tournaments',
      description: 'View and register for events',
      icon: Trophy,
      href: '/tournaments',
      color: 'from-trophy-gold/10 to-trophy-gold/20 border-trophy-gold/30',
      badge: '3 upcoming',
      priority: 'primary'
    },
    {
      title: 'Log a Catch',
      description: 'Record your latest fish',
      icon: Fish,
      href: '/catch-logging',
      color: 'from-fishing-green/10 to-fishing-green/20 border-fishing-green/30',
      priority: 'primary'
    },
    {
      title: 'My Plans',
      description: 'Tournament preparation',
      icon: Target,
      href: '/plans',
      color: 'from-water-blue/10 to-water-blue/20 border-water-blue/30',
      badge: '3 active',
      priority: 'primary'
    },
    {
      title: 'Club Directory',
      description: 'Connect with members',
      icon: Users,
      href: '/clubs',
      color: 'from-primary/10 to-primary/20 border-primary/30',
      priority: 'secondary'
    },
    {
      title: 'Messages',
      description: 'Club communications',
      icon: MessageSquare,
      href: '/messages',
      color: 'from-muted to-muted border-border',
      badge: '2 new',
      priority: 'secondary'
    },
    {
      title: 'Leaderboard',
      description: 'Rankings and stats',
      icon: BarChart3,
      href: '/leaderboard',
      color: 'from-muted to-muted border-border',
      priority: 'secondary'
    }
  ];

  const getOfficerActions = (): QuickAction[] => {
    const baseActions = getMemberActions().slice(0, 3); // Keep first 3 member actions
    
    const officerSpecificActions: QuickAction[] = [
      {
        title: 'Manage Club',
        description: 'Officer dashboard & tools',
        icon: Crown,
        href: '/clubs/demo-alabama-bass-chapter-12/manage',
        color: 'from-orange-500/10 to-orange-500/20 border-orange-500/30',
        badge: isPresident ? 'President' : 'Officer',
        priority: 'primary'
      }
    ];

    const secondaryOfficerActions: QuickAction[] = [
      {
        title: 'Create Tournament',
        description: 'Schedule new events',
        icon: PlusCircle,
        href: '/tournaments',
        color: 'from-trophy-gold/10 to-trophy-gold/20 border-trophy-gold/30',
        priority: 'secondary'
      },
      {
        title: 'Officer Notes',
        description: 'Club communications',
        icon: FileText,
        href: '/messages?tab=club',
        color: 'from-red-500/10 to-red-500/20 border-red-500/30',
        badge: '3 pending',
        priority: 'secondary'
      }
    ];

    if (isPresident) {
      secondaryOfficerActions.unshift({
        title: 'Member Management',
        description: 'Add, remove & assign roles',
        icon: Users,
        href: '/clubs/demo-alabama-bass-chapter-12/manage?tab=members',
        color: 'from-primary/10 to-primary/20 border-primary/30',
        priority: 'secondary'
      });
    }

    return [...baseActions, ...officerSpecificActions, ...secondaryOfficerActions];
  };

  const actions = isClubOfficer ? getOfficerActions() : getMemberActions();
  const primaryActions = actions.filter(action => action.priority === 'primary');
  const secondaryActions = actions.filter(action => action.priority === 'secondary');

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg border">
        <UniversalAvatar 
          name={userProfile.name}
          photoUrl={userProfile.avatar_url}
          club={{ id: "alabama-bass-nation", abbreviation: "ABN-12" }}
          role={isClubOfficer ? (isPresident ? "Club President" : "Club Officer") : "2019 AOY Champion"}
          city="Huntsville, AL"
          anglerId={isDemoMode ? currentDemoUser?.id.replace('demo-', '') : "jake-patterson"}
          size="card"
          isAOYChampion={isMember}
        />
        <div className="flex-1">
          <h2 className="text-xl font-bold">
            Welcome back, {userProfile.name.split(' ')[0]}!
          </h2>
          <p className="text-muted-foreground">
            {isDemoMode ? currentDemoUser?.club : userProfile.club}
          </p>
          {isClubOfficer && (
            <Badge className="mt-1 bg-orange-500/10 text-orange-700 border-orange-500/20">
              <Shield className="w-3 h-3 mr-1" />
              {isPresident ? 'President Access' : 'Officer Access'}
            </Badge>
          )}
          {isMember && !isClubOfficer && (
            <Badge className="mt-1 bg-water-blue/10 text-water-blue border-water-blue/20">
              <Fish className="w-3 h-3 mr-1" />
              Tournament Angler
            </Badge>
          )}
        </div>
      </div>

      {/* Primary Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          {isClubOfficer ? (
            <>
              <Crown className="w-5 h-5 mr-2 text-orange-500" />
              {isPresident ? 'President Dashboard' : 'Officer Tools'}
            </>
          ) : (
            <>
              <Target className="w-5 h-5 mr-2 text-primary" />
              Quick Actions
            </>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {primaryActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className={`bg-gradient-to-br ${action.color} hover:shadow-md transition-all cursor-pointer group`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <action.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                    {action.badge && (
                      <Badge variant="secondary" className="text-xs">
                        {action.badge}
                      </Badge>
                    )}
                  </div>
                  <h4 className="font-semibold mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                  <ArrowRight className="w-4 h-4 mt-2 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Secondary Actions */}
      {secondaryActions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-muted-foreground" />
            {isClubOfficer ? 'Management Tools' : 'More Features'}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {secondaryActions.map((action) => (
              <Link key={action.title} to={action.href}>
                <Card className="hover:shadow-sm transition-all cursor-pointer group border-dashed">
                  <CardContent className="p-3 text-center">
                    <action.icon className="w-5 h-5 mx-auto mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                    <h5 className="text-sm font-medium mb-1">{action.title}</h5>
                    {action.badge && (
                      <Badge variant="outline" className="text-xs mt-1">
                        {action.badge}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Quick Stats - Show for Members and Officers differently */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            {isClubOfficer ? 'Club Overview' : 'Your Season'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isClubOfficer ? (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-water-blue">47</p>
                <p className="text-sm text-muted-foreground">Active Members</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-trophy-gold">12</p>
                <p className="text-sm text-muted-foreground">Tournaments</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-fishing-green">234</p>
                <p className="text-sm text-muted-foreground">Total Catches</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-fishing-green">{mockCareerStats.wins}</p>
                <p className="text-sm text-muted-foreground">Wins</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-trophy-gold">{mockCareerStats.top10}</p>
                <p className="text-sm text-muted-foreground">Top 10</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-water-blue">{mockCareerStats.personalBest}</p>
                <p className="text-sm text-muted-foreground">Personal Best</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}