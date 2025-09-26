import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserEffectiveRoles, usePermission } from '@/hooks/useRBAC';
import { Crown, Shield, Calendar, FileEdit, DollarSign, Leaf, Users, Settings, BarChart3, Mail, Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PermissionGuard } from './PermissionGuard';

const roleIcons = {
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

const dashboardSections = [
  {
    title: 'Club Management',
    permission: 'club.manage.settings',
    icon: Settings,
    description: 'Manage club settings and configuration',
    actions: ['Edit club details', 'Manage membership', 'Club announcements']
  },
  {
    title: 'Tournament Management',
    permission: 'tournament.create',
    icon: Trophy,
    description: 'Create and manage tournaments',
    actions: ['Create tournament', 'Manage registrations', 'Record results']
  },
  {
    title: 'Financial Management',
    permission: 'financial.view.reports',
    icon: DollarSign,
    description: 'Manage club finances and dues',
    actions: ['View financial reports', 'Manage dues', 'Process payments']
  },
  {
    title: 'Communications',
    permission: 'communication.send.email',
    icon: Mail,
    description: 'Send club communications',
    actions: ['Send club emails', 'Manage announcements', 'Newsletter management']
  },
  {
    title: 'Analytics',
    permission: 'platform.view.analytics',
    icon: BarChart3,
    description: 'View platform and club analytics',
    actions: ['Member statistics', 'Tournament analytics', 'Performance metrics']
  },
];

interface RoleBasedDashboardProps {
  clubId?: string;
}

export default function RoleBasedDashboard({ clubId }: RoleBasedDashboardProps) {
  const { user } = useAuth();
  const { data: userRoles = [], isLoading } = useUserEffectiveRoles(clubId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const platformRoles = userRoles.filter(role => role.role_type === 'platform');
  const clubRoles = userRoles.filter(role => role.role_type === 'club');
  const temporaryRoles = userRoles.filter(role => role.role_type === 'temporary');

  return (
    <div className="space-y-6">
      {/* User Roles Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Your Roles & Permissions
          </CardTitle>
          <CardDescription>
            Current active roles and access levels
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {platformRoles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">Platform Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {platformRoles.map((role, index) => {
                    const Icon = roleIcons[role.role_name as keyof typeof roleIcons] || Shield;
                    return (
                      <Badge key={index} variant="destructive" className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {role.role_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {clubRoles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">Club Roles</h4>
                <div className="flex flex-wrap gap-2">
                  {clubRoles.map((role, index) => {
                    const Icon = roleIcons[role.role_name as keyof typeof roleIcons] || Users;
                    return (
                      <Badge key={index} variant="default" className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {role.role_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        {role.expires_at && (
                          <span className="text-xs opacity-75">
                            (expires {new Date(role.expires_at).toLocaleDateString()})
                          </span>
                        )}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {temporaryRoles.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2 text-sm">Temporary Elevations</h4>
                <div className="flex flex-wrap gap-2">
                  {temporaryRoles.map((role, index) => {
                    const Icon = roleIcons[role.role_name as keyof typeof roleIcons] || Shield;
                    return (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        <Icon className="h-3 w-3" />
                        {role.role_name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        <span className="text-xs opacity-75">
                          (until {new Date(role.expires_at!).toLocaleDateString()})
                        </span>
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}

            {userRoles.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No active roles assigned. Contact your club administrator for role assignments.
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Available Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {dashboardSections.map((section) => (
          <PermissionGuard 
            key={section.title} 
            permission={section.permission} 
            clubId={clubId}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <section.icon className="h-5 w-5" />
                  {section.title}
                </CardTitle>
                <CardDescription>
                  {section.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <ul className="text-sm space-y-1">
                    {section.actions.map((action, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-primary rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full" size="sm">
                    Access {section.title}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </PermissionGuard>
        ))}
      </div>

      {/* Quick Actions for specific roles */}
      <div className="grid gap-4 md:grid-cols-2">
        <PermissionGuard permission="tournament.create" clubId={clubId}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Tournament Director Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Create New Tournament</Button>
              <Button className="w-full" variant="outline">Manage Registrations</Button>
              <Button className="w-full" variant="outline">Update Results</Button>
            </CardContent>
          </Card>
        </PermissionGuard>

        <PermissionGuard permission="financial.manage.dues" clubId={clubId}>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Treasurer Tools</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="outline">Financial Reports</Button>
              <Button className="w-full" variant="outline">Manage Dues</Button>
              <Button className="w-full" variant="outline">Process Payments</Button>
            </CardContent>
          </Card>
        </PermissionGuard>
      </div>
    </div>
  );
}