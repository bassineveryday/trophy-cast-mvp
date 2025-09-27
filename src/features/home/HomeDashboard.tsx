import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import UniversalAvatar from '@/components/UniversalAvatar';
import { QuickActions } from '@/components/QuickActions';
import { OnboardingTour } from '@/components/OnboardingTour';
import { DemoUserSwitcher } from '@/components/demo/DemoUserSwitcher';
import { useAuth } from '@/contexts/AuthContext';
import { useDemoAwareRoles } from '@/hooks/useDemoRoles';
import { useDemoMode } from '@/contexts/DemoModeContext';
import { 
  Trophy, 
  Calendar, 
  Users, 
  TrendingUp, 
  Fish, 
  Target,
  Settings,
  UserCheck,
  Crown,
  Anchor,
  Camera,
  MapPin,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { mockTournaments, mockCareerStats } from '@/data/mockData';
import { enhancedMockTournaments, mockClubMembers, enhancedClubFeed } from '@/data/enhancedMockData';

export default function HomeDashboard() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { user } = useAuth();
  const { isDemoMode, currentDemoUser } = useDemoMode();
  const { isClubOfficer, isPresident, getUserProfile } = useDemoAwareRoles();

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding && (user || isDemoMode)) {
      setShowOnboarding(true);
    }
  }, [user, isDemoMode]);

  const handleOnboardingComplete = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  // Get current user data
  const currentUserProfile = getUserProfile();
  const userName = isDemoMode ? currentDemoUser?.name : 'Tai Hunt';
  const userRole = isDemoMode ? currentDemoUser?.club_role : 'member';
  const userClub = isDemoMode ? currentDemoUser?.club : 'Alabama Bass Nation - Chapter 12';
  const userAvatar = isDemoMode ? currentDemoUser?.avatar_url : undefined;

  // Show auth/demo entry if no user and not in demo mode
  if (!user && !isDemoMode) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center space-y-6">
          <div>
            <h1 className="text-2xl font-bold mb-4">Welcome to TrophyCast</h1>
            <p className="text-muted-foreground">Please sign in to continue</p>
          </div>
          
          <Card className="max-w-md mx-auto border-dashed border-primary/30 bg-primary/5">
            <CardContent className="p-6 text-center">
              <Badge className="mb-3 bg-primary/10 text-primary border-primary/20">
                Try Demo Mode
              </Badge>
              <h3 className="font-semibold mb-2">Experience TrophyCast</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Test drive the platform with demo accounts from Alabama Bass Nation - Chapter 12
              </p>
              <DemoUserSwitcher />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      {/* Demo User Switcher */}
      <DemoUserSwitcher />
      
      {/* Demo Mode Callout - Only for demo users */}
      {isDemoMode && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-4"
        >
          <div className="flex items-center gap-3">
            <Badge className="bg-primary/10 text-primary border-primary/20">
              Demo Mode
            </Badge>
            <p className="text-sm text-foreground">
              Viewing as <strong>{userName}</strong> ({userRole === 'president' ? 'Club President' : 'Member'})
            </p>
          </div>
        </motion.div>
      )}

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour 
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-background to-muted/30 rounded-2xl p-6 shadow-card-custom border border-border/50"
      >
        <div className="flex items-center gap-4 mb-4">
          <UniversalAvatar
            name={userName || 'Angler'}
            photoUrl={userAvatar}
            size="hero"
            club={{
              id: 'alabama-bass-nation',
              abbreviation: 'ABN-12',
              name: userClub
            }}
            role={userRole === 'president' ? 'President' : 'Member'}
            city="Alabama"
            showMicroCopy={false}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold">Welcome back, {userName?.split(' ')[0]}!</h1>
              {isPresident && (
                <Crown className="w-5 h-5 text-trophy-gold" />
              )}
            </div>
            <p className="text-muted-foreground">{userClub}</p>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="secondary" className="text-xs">
                {userRole === 'president' ? 'Club President' : 'Tournament Angler'}
              </Badge>
              {isDemoMode && (
                <Badge className="bg-primary/10 text-primary border-primary/20 text-xs">
                  Demo Account
                </Badge>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* President Quick Actions Banner - Only for Mike Rodriguez */}
      {isPresident && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-trophy-gold/10 to-trophy-gold/5 border border-trophy-gold/20 rounded-lg p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown className="w-5 h-5 text-trophy-gold" />
              <div>
                <h3 className="font-semibold text-trophy-gold">Club Management</h3>
                <p className="text-sm text-muted-foreground">Access president tools and member oversight</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to="/clubs/demo-alabama-bass-chapter-12/manage">
                <Button size="sm" className="bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20 hover:bg-trophy-gold/20">
                  <Settings className="w-4 h-4 mr-1" />
                  Manage Club
                </Button>
              </Link>
              <Link to="/clubs/demo-alabama-bass-chapter-12/import">
                <Button size="sm" variant="outline" className="border-trophy-gold/20 text-trophy-gold hover:bg-trophy-gold/10">
                  <UserCheck className="w-4 h-4 mr-1" />
                  Members
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card className="border-border/50 hover:shadow-card-hover transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Trophy className="w-4 h-4 text-trophy-gold" />
              <span className="text-sm font-medium">Tournaments</span>
            </div>
            <p className="text-2xl font-bold">{mockCareerStats.tournaments}</p>
            <p className="text-xs text-muted-foreground">This season</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card-hover transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-fishing-green" />
              <span className="text-sm font-medium">Wins</span>
            </div>
            <p className="text-2xl font-bold">{mockCareerStats.wins}</p>
            <p className="text-xs text-muted-foreground">Career total</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card-hover transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <Fish className="w-4 h-4 text-water-blue" />
              <span className="text-sm font-medium">PB</span>
            </div>
            <p className="text-2xl font-bold">{mockCareerStats.personalBest}</p>
            <p className="text-xs text-muted-foreground">lbs</p>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-card-hover transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">Top 10s</span>
            </div>
            <p className="text-2xl font-bold">{mockCareerStats.top10}</p>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <QuickActions />
      </motion.div>

      {/* Two Column Layout */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Upcoming Tournaments */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-border/50 h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  Upcoming Tournaments
                </CardTitle>
                <Link to="/tournaments">
                  <Button variant="ghost" size="sm">View All</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(isDemoMode ? enhancedMockTournaments : mockTournaments).slice(0, 3).map((tournament) => (
                <div key={tournament.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tournament.name}</p>
                    <p className="text-xs text-muted-foreground">{tournament.date} • {tournament.time}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={tournament.registered ? "bg-fishing-green/10 text-fishing-green border-fishing-green/20" : "bg-muted text-muted-foreground"}>
                        {tournament.registered ? 'Registered' : 'Open'}
                      </Badge>
                      {tournament.hasPlan && (
                        <Badge variant="secondary" className="text-xs">
                          <Target className="w-3 h-3 mr-1" />
                          Plan Ready
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{tournament.fee}</p>
                    <p className="text-xs text-muted-foreground">{tournament.club.split(' – ')[0]}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Right Column - Club Overview or Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
        >
          {isPresident ? (
            // Club Overview for President
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-trophy-gold" />
                  Club Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-trophy-gold">47</p>
                    <p className="text-xs text-muted-foreground">Active Members</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-fishing-green">12</p>
                    <p className="text-xs text-muted-foreground">Tournaments</p>
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h4 className="font-medium text-sm mb-2">Recent Activity</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <UserCheck className="w-3 h-3 text-fishing-green" />
                      <span className="text-muted-foreground">3 new member registrations</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-3 h-3 text-primary" />
                      <span className="text-muted-foreground">Tournament results pending</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Trophy className="w-3 h-3 text-trophy-gold" />
                      <span className="text-muted-foreground">AOY standings updated</span>
                    </div>
                  </div>
                </div>

                <Link to="/clubs/demo-alabama-bass-chapter-12/manage">
                  <Button className="w-full bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20 hover:bg-trophy-gold/20">
                    <Settings className="w-4 h-4 mr-2" />
                    Club Management Dashboard
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            // Activity Feed for Regular Members
            <Card className="border-border/50 h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-primary" />
                  Club Activity
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {enhancedClubFeed.slice(0, 3).map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                    <UniversalAvatar
                      name={activity.angler}
                      photoUrl={activity.photo}
                      size="row"
                      showMicroCopy={false}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.angler}</p>
                      <p className="text-xs text-muted-foreground">{activity.placement} • {activity.weight}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{activity.caption}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="text-xs">
                        <Trophy className="w-3 h-3 mr-1" />
                        +{activity.clubPoints}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{activity.timeAgo}</p>
                    </div>
                  </div>
                ))}
                
                <Link to="/clubs">
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>

      {/* Boat & Gear Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-border/50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Anchor className="w-5 h-5 text-water-blue" />
                Boat & Gear
              </CardTitle>
              <Link to="/gear">
                <Button variant="ghost" size="sm">Manage</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Anchor className="w-4 h-4 text-water-blue" />
                  <span className="font-medium text-sm">Primary Boat</span>
                </div>
                <p className="text-sm">2023 Bass Tracker Pro</p>
                <p className="text-xs text-muted-foreground">Mercury 115hp</p>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Fish className="w-4 h-4 text-fishing-green" />
                  <span className="font-medium text-sm">Go-To Setup</span>
                </div>
                <p className="text-sm">Medium Heavy Rod</p>
                <p className="text-xs text-muted-foreground">Spinnerbait & Crankbait</p>
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="font-medium text-sm">Home Waters</span>
                </div>
                <p className="text-sm">Lake Guntersville</p>
                <p className="text-xs text-muted-foreground">Alabama</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-dashed border-border/50">
          <CardContent className="p-4 text-center">
            <CardDescription className="mb-2">
              New to TrophyCast or need a refresher?
            </CardDescription>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowOnboarding(true)}
            >
              Take the Tour
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}