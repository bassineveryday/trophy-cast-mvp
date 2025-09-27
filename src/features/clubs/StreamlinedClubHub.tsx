import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Crown, 
  MessageSquare, 
  Calendar, 
  UserPlus,
  Settings,
  BarChart3,
  FileText,
  Bell,
  ArrowRight,
  Shield
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useIsClubOfficer } from '@/hooks/useRoles';
import { EnhancedBreadcrumb } from '@/components/EnhancedBreadcrumb';

export default function StreamlinedClubHub() {
  const { profile } = useAuth();
  const isClubOfficer = useIsClubOfficer();

  // Member actions
  const memberActions = [
    {
      title: 'Club Directory',
      description: 'Browse and connect with members',
      icon: Users,
      href: '/clubs',
      color: 'from-water-blue/10 to-water-blue/20 border-water-blue/30',
      badge: '47 members',
      priority: 'normal' as const
    },
    {
      title: 'Club Announcements',
      description: 'Latest news and updates',
      icon: Bell,
      href: '/messages?tab=club',
      color: 'from-fishing-green/10 to-fishing-green/20 border-fishing-green/30',
      badge: '3 new',
      priority: 'normal' as const
    },
    {
      title: 'Tournament Schedule',
      description: 'Upcoming club events',
      icon: Calendar,
      href: '/tournaments',
      color: 'from-trophy-gold/10 to-trophy-gold/20 border-trophy-gold/30',
      badge: '2 upcoming',
      priority: 'normal' as const
    }
  ];

  // Officer actions
  const officerActions = [
    {
      title: 'Club Management',
      description: 'Full officer dashboard',
      icon: Crown,
      href: '/clubs/demo-alabama-bass-chapter-12/manage',
      color: 'from-orange-500/10 to-orange-500/20 border-orange-500/30',
      badge: 'Officer Only',
      priority: 'high' as const
    },
    {
      title: 'Member Management',
      description: 'Add, remove, and manage roles',
      icon: UserPlus,
      href: '/clubs/demo-alabama-bass-chapter-12/manage?tab=members',
      color: 'from-primary/10 to-primary/20 border-primary/30',
      priority: 'normal' as const
    },
    {
      title: 'Create Tournament',
      description: 'Schedule new events',
      icon: Calendar,
      href: '/tournaments',
      color: 'from-trophy-gold/10 to-trophy-gold/20 border-trophy-gold/30',
      priority: 'normal' as const
    },
    {
      title: 'Officer Notes',
      description: 'Internal communications',
      icon: FileText,
      href: '/messages?tab=club',
      color: 'from-red-500/10 to-red-500/20 border-red-500/30',
      badge: '3 pending',
      priority: 'normal' as const
    },
    {
      title: 'Club Analytics',
      description: 'Performance and insights',
      icon: BarChart3,
      href: '/clubs/demo-alabama-bass-chapter-12/manage?tab=overview',
      color: 'from-purple-500/10 to-purple-500/20 border-purple-500/30',
      priority: 'normal' as const
    },
    {
      title: 'Club Settings',
      description: 'Configuration and preferences',
      icon: Settings,
      href: '/clubs/demo-alabama-bass-chapter-12/manage?tab=settings',
      color: 'from-muted to-muted border-border',
      priority: 'normal' as const
    }
  ];

  const displayActions = isClubOfficer ? [...memberActions, ...officerActions] : memberActions;
  const primaryActions = displayActions.filter(action => action.priority === 'high' || !isClubOfficer);
  const secondaryActions = displayActions.filter(action => action.priority !== 'high' && isClubOfficer);

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Breadcrumb */}
      <EnhancedBreadcrumb />

      {/* Header */}
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-water-blue/5 to-fishing-green/5 rounded-lg border">
        <div className="w-12 h-12 bg-water-blue/10 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-water-blue" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Alabama Bass Nation</h1>
          <p className="text-muted-foreground">Chapter 12 • Huntsville, AL</p>
          {isClubOfficer && (
            <Badge className="mt-1 bg-orange-500/10 text-orange-700 border-orange-500/20">
              <Shield className="w-3 h-3 mr-1" />
              Officer Access
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
              Officer Actions
            </>
          ) : (
            <>
              <Users className="w-5 h-5 mr-2 text-primary" />
              Club Features
            </>
          )}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(isClubOfficer ? [officerActions[0], ...memberActions.slice(0, 2)] : memberActions).map((action) => (
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

      {/* Secondary Actions for Officers */}
      {isClubOfficer && secondaryActions.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Settings className="w-5 h-5 mr-2 text-muted-foreground" />
            Management Tools
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

      {/* Member Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            Club Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-water-blue">47</p>
              <p className="text-sm text-muted-foreground">Members</p>
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
        </CardContent>
      </Card>
    </div>
  );
}