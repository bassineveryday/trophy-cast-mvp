import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Database,
  Server,
  Wifi,
  Zap,
  TrendingUp,
  Users,
  Bug,
  RefreshCw
} from 'lucide-react';
import { EnhancedBreadcrumb } from '@/components/EnhancedBreadcrumb';
import { useQuery } from '@tanstack/react-query';

interface SystemMetric {
  name: string;
  value: string | number;
  status: 'healthy' | 'warning' | 'critical';
  description: string;
  icon: React.ComponentType<any>;
  lastUpdated: string;
}

interface ErrorLog {
  id: string;
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  component: string;
  userId?: string;
}

export default function SystemHealthDashboard() {
  const [refreshing, setRefreshing] = useState(false);

  // Mock system metrics - in real app would come from monitoring service
  const { data: systemMetrics = [], isLoading } = useQuery({
    queryKey: ['systemHealth'],
    queryFn: async () => {
      const metrics: SystemMetric[] = [
        {
          name: 'API Response Time',
          value: '142ms',
          status: 'healthy',
          description: 'Average response time',
          icon: Clock,
          lastUpdated: new Date().toLocaleTimeString()
        },
        {
          name: 'Database Connections',
          value: '12/100',
          status: 'healthy',
          description: 'Active connections',
          icon: Database,
          lastUpdated: new Date().toLocaleTimeString()
        },
        {
          name: 'Server Memory',
          value: '68%',
          status: 'warning',
          description: 'Memory utilization',
          icon: Server,
          lastUpdated: new Date().toLocaleTimeString()
        },
        {
          name: 'Network Latency',
          value: '23ms',
          status: 'healthy',
          description: 'Network performance',
          icon: Wifi,
          lastUpdated: new Date().toLocaleTimeString()
        },
        {
          name: 'Edge Functions',
          value: '3/3',
          status: 'healthy',
          description: 'Functions operational',
          icon: Zap,
          lastUpdated: new Date().toLocaleTimeString()
        },
        {
          name: 'Active Sessions',
          value: 89,
          status: 'healthy',
          description: 'Current user sessions',
          icon: Users,
          lastUpdated: new Date().toLocaleTimeString()
        }
      ];
      return metrics;
    }
  });

  // Mock error logs
  const { data: errorLogs = [] } = useQuery({
    queryKey: ['errorLogs'],
    queryFn: async () => {
      const logs: ErrorLog[] = [
        {
          id: '1',
          timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          level: 'warning',
          message: 'Slow database query detected',
          component: 'TournamentDashboard'
        },
        {
          id: '2',
          timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          level: 'error',
          message: 'Failed to load user profile',
          component: 'ProfileHeader',
          userId: 'user-123'
        },
        {
          id: '3',
          timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          level: 'info',
          message: 'High memory usage detected',
          component: 'SystemMonitor'
        }
      ];
      return logs;
    }
  });

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  const getStatusColor = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return 'text-fishing-green';
      case 'warning': return 'text-orange-500';
      case 'critical': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: SystemMetric['status']) => {
    switch (status) {
      case 'healthy': return CheckCircle;
      case 'warning': return AlertTriangle;
      case 'critical': return AlertTriangle;
      default: return Clock;
    }
  };

  const getLogLevelColor = (level: ErrorLog['level']) => {
    switch (level) {
      case 'error': return 'text-red-600 bg-red-50 border-red-200';
      case 'warning': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'info': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-muted-foreground bg-muted border-border';
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Breadcrumb */}
      <EnhancedBreadcrumb items={[
        { label: 'Home', href: '/' },
        { label: 'Admin Dashboard', href: '/admin/dashboard' },
        { label: 'System Health' }
      ]} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-green-500/5 to-blue-500/5 rounded-lg border border-green-500/20">
          <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center">
            <Activity className="w-6 h-6 text-green-500" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">System Health Dashboard</h1>
            <p className="text-muted-foreground">Real-time monitoring and performance metrics</p>
          </div>
        </div>
        
        <Button 
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* System Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {systemMetrics.map((metric) => {
          const StatusIcon = getStatusIcon(metric.status);
          return (
            <Card key={metric.name}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <metric.icon className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{metric.name}</p>
                      <p className="text-2xl font-bold">{metric.value}</p>
                      <p className="text-xs text-muted-foreground">{metric.description}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-1">
                    <StatusIcon className={`w-5 h-5 ${getStatusColor(metric.status)}`} />
                    <span className="text-xs text-muted-foreground">
                      {metric.lastUpdated}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* System Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Overall Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="w-5 h-5 mr-2 text-fishing-green" />
              System Status
            </CardTitle>
            <CardDescription>Overall platform health</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">API Services</span>
                <Badge className="bg-fishing-green/10 text-fishing-green border-fishing-green/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge className="bg-fishing-green/10 text-fishing-green border-fishing-green/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication</span>
                <Badge className="bg-fishing-green/10 text-fishing-green border-fishing-green/20">
                  Operational
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">File Storage</span>
                <Badge className="bg-orange-500/10 text-orange-700 border-orange-500/20">
                  Degraded
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-water-blue" />
              Performance Metrics
            </CardTitle>
            <CardDescription>Last 24 hours</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Avg Response Time</span>
                <span className="font-mono text-sm">142ms</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-mono text-sm text-fishing-green">99.8%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Peak Concurrent Users</span>
                <span className="font-mono text-sm">234</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Error Rate</span>
                <span className="font-mono text-sm text-orange-600">0.2%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Error Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bug className="w-5 h-5 mr-2 text-red-500" />
              Recent Error Logs
            </div>
            <Badge variant="outline">
              {errorLogs.filter(log => log.level === 'error').length} errors today
            </Badge>
          </CardTitle>
          <CardDescription>Latest system errors and warnings</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {errorLogs.map((log) => (
              <div key={log.id} className={`p-3 rounded-lg border ${getLogLevelColor(log.level)}`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <Badge variant="outline" className="text-xs">
                        {log.level.toUpperCase()}
                      </Badge>
                      <span className="text-sm font-medium">{log.component}</span>
                    </div>
                    <p className="text-sm">{log.message}</p>
                    <div className="flex items-center space-x-4 mt-1 text-xs text-muted-foreground">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      {log.userId && <span>User: {log.userId}</span>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}