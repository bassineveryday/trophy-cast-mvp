import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Fish, Trophy, MessageSquare, Users } from 'lucide-react';
import { useHybridData } from '@/hooks/useHybridData';
import { DemoContentBadge } from './DemoContentBadge';
import { DemoContentControls } from './DemoContentControls';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import UniversalAvatar from '@/components/UniversalAvatar';

interface ActivityItem {
  id: string;
  type: 'catch' | 'tournament' | 'technique' | 'club';
  user: string;
  avatar?: string;
  action: string;
  details: string;
  timestamp: string;
  is_demo?: boolean;
}

export function EnhancedClubActivity() {
  const { getEnhancedClubActivity, preferences } = useHybridData();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      setLoading(true);
      try {
        const data = await getEnhancedClubActivity();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching club activity:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivity();
  }, [getEnhancedClubActivity, preferences]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'catch':
        return <Fish className="w-4 h-4 text-fishing-green" />;
      case 'tournament':
        return <Trophy className="w-4 h-4 text-trophy-gold" />;
      case 'technique':
        return <MessageSquare className="w-4 h-4 text-primary" />;
      case 'club':
        return <Users className="w-4 h-4 text-blue-500" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getActivityBadge = (type: string) => {
    switch (type) {
      case 'catch':
        return <Badge variant="secondary" className="bg-fishing-green/10 text-fishing-green">Catch</Badge>;
      case 'tournament':
        return <Badge variant="secondary" className="bg-trophy-gold/10 text-trophy-gold">Tournament</Badge>;
      case 'technique':
        return <Badge variant="secondary" className="bg-primary/10 text-primary">Tip</Badge>;
      case 'club':
        return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">Club</Badge>;
      default:
        return <Badge variant="outline">Activity</Badge>;
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Club Activity
            </div>
            <DemoContentControls />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center py-8">
          <LoadingSpinner message="Loading activity..." />
        </CardContent>
      </Card>
    );
  }

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Club Activity
            </div>
            <DemoContentControls />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <Activity className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="font-semibold mb-2">No Recent Activity</h3>
          <p className="text-sm text-muted-foreground">
            Club activity will appear here as members log catches and participate in tournaments
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Club Activity
          </div>
          <DemoContentControls />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-start gap-4 p-4 rounded-lg border bg-card hover:bg-accent/30 transition-colors"
          >
            {/* Activity Icon */}
            <div className="flex-shrink-0 mt-1">
              {getActivityIcon(activity.type)}
            </div>

            {/* User Avatar */}
            <div className="flex-shrink-0">
              <UniversalAvatar
                name={activity.user}
                photoUrl={activity.avatar}
                size="row"
              />
            </div>

            {/* Activity Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">{activity.user}</span>
                {activity.is_demo && (
                  <DemoContentBadge size="sm" variant="subtle" />
                )}
                <span className="text-sm text-muted-foreground">
                  {activity.action}
                </span>
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">
                {activity.details}
              </p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  {activity.timestamp}
                </span>
                {getActivityBadge(activity.type)}
              </div>
            </div>
          </div>
        ))}

        {/* Demo Content Notice */}
        {activities.some(a => a.is_demo) && preferences.showDemoContent && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg border border-dashed">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>
                Activity feed includes demo member activities to demonstrate club engagement features.
                Real member activities will appear as they happen.
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}