import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  Trophy, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Activity,
  Crown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Shield,
  Eye
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { platformAdminService } from '@/hooks/usePlatformAdmin';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { EnhancedBreadcrumb } from '@/components/EnhancedBreadcrumb';

interface MetricCard {
  title: string;
  value: string | number;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: {
    direction: 'up' | 'down';
    value: string;
  };
}

export default function PlatformDashboard() {
  const { data: metrics, isLoading } = useQuery({
    queryKey: ['platformMetrics'],
    queryFn: platformAdminService.getPlatformMetrics
  });

  if (isLoading) {
    return <LoadingSpinner message="Loading platform metrics..." />;
  }

  const metricCards: MetricCard[] = [
    {
      title: 'Total Users',
      value: metrics?.totalUsers || 0,
      description: 'Registered anglers',
      icon: Users,
      color: 'text-water-blue',
      trend: {
        direction: 'up',
        value: `+${metrics?.newUsersThisWeek || 0} this week`
      }
    },
    {
      title: 'Active Clubs',
      value: metrics?.activeClubs || 0,
      description: 'Registered clubs',
      icon: Crown,
      color: 'text-orange-500',
      trend: {
        direction: 'up',
        value: '+2 this month'
      }
    },
    {
      title: 'Monthly Tournaments',
      value: metrics?.tournamentsThisMonth || 0,
      description: 'Events this month',
      icon: Trophy,
      color: 'text-trophy-gold',
      trend: {
        direction: 'up',
        value: '+3 from last month'
      }
    },
    {
      title: 'Platform Revenue',
      value: `$${(metrics?.totalRevenue || 0).toLocaleString()}`,
      description: 'Total revenue',
      icon: DollarSign,
      color: 'text-fishing-green',
      trend: {
        direction: 'up',
        value: '+12% this quarter'
      }
    }
  ];

  const quickActions = [
    {
      title: 'User Management',
      description: 'View and manage all platform users',
      icon: Users,
      href: '/admin/users',
      color: 'from-water-blue/10 to-water-blue/20 border-water-blue/30'
    },
    {
      title: 'Club Oversight',
      description: 'Monitor club activity and approve new clubs',
      icon: Crown,
      href: '/admin/clubs',
      color: 'from-orange-500/10 to-orange-500/20 border-orange-500/30'
    },
    {
      title: 'System Health',
      description: 'Monitor app performance and errors',
      icon: Activity,
      href: '/admin/system',
      color: 'from-red-500/10 to-red-500/20 border-red-500/30'
    },
    {
      title: 'Feature Management',
      description: 'Manage feature flags and announcements',
      icon: Target,
      href: '/admin/features',
      color: 'from-purple-500/10 to-purple-500/20 border-purple-500/30'
    }
  ];

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Breadcrumb */}
      <EnhancedBreadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Platform Admin Dashboard' }
      ]} />

      {/* Header */}
      <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-orange-500/5 to-red-500/5 rounded-lg border border-orange-500/20">
        <div className="w-12 h-12 bg-orange-500/10 rounded-full flex items-center justify-center">
          <Crown className="w-6 h-6 text-orange-500" />
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold">Platform Administration</h1>
          <p className="text-muted-foreground">System-wide oversight and management</p>
        </div>
        <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">
          <Shield className="w-3 h-3 mr-1" />
          Super Admin Access
        </Badge>
      </div>

      {/* Platform Metrics */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2 text-primary" />
          Platform Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metricCards.map((metric) => (
            <Card key={metric.title}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                  {metric.trend && (
                    <div className="flex items-center space-x-1">
                      {metric.trend.direction === 'up' ? (
                        <TrendingUp className="w-4 h-4 text-fishing-green" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-2xl font-bold">{metric.value}</p>
                  <p className="text-sm text-muted-foreground">{metric.description}</p>
                  {metric.trend && (
                    <p className={`text-xs mt-1 ${
                      metric.trend.direction === 'up' ? 'text-fishing-green' : 'text-red-500'
                    }`}>
                      {metric.trend.value}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <Target className="w-5 h-5 mr-2 text-primary" />
          Admin Tools
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} to={action.href}>
              <Card className={`bg-gradient-to-br ${action.color} hover:shadow-md transition-all cursor-pointer group`}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <action.icon className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                  </div>
                  <h4 className="font-semibold mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Top Performing Clubs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Crown className="w-5 h-5 mr-2 text-orange-500" />
            Top Performing Clubs
          </CardTitle>
          <CardDescription>Most active clubs on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics?.topClubs?.map((club, index) => (
              <div key={club.name} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{club.name}</p>
                    <p className="text-sm text-muted-foreground">{club.members} members</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs">
                    {club.activity}% active
                  </Badge>
                  <Button size="sm" variant="ghost" asChild>
                    <Link to="/admin/clubs">
                      <Eye className="w-4 h-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">System Status</p>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="w-4 h-4 text-fishing-green" />
                  <span className="text-sm font-semibold">All Systems Operational</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                <p className="text-xl font-bold mt-1">{metrics?.activeUsersToday || 0}</p>
              </div>
              <Activity className="w-5 h-5 text-water-blue" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                <p className="text-xl font-bold mt-1">142ms</p>
              </div>
              <Clock className="w-5 h-5 text-fishing-green" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}