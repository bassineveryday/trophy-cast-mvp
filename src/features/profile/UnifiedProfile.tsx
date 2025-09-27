import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, useLocation, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Trophy, 
  Fish, 
  Target,
  Award,
  Star,
  Share,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowLeft,
  MessageSquare,
  Activity,
  Edit3,
  Building,
  Home,
  MapPin,
  Anchor,
  Users,
  Lock,
  Menu,
  X,
  Plus,
  Settings,
  Medal,
  Crown,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";
import { mockPublicProfiles } from "@/data/enhancedMockData";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useProfileData } from "@/hooks/useProfileData";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { AvatarUpload } from "@/components/AvatarUpload";
import { TechniqueIcon } from "@/components/TechniqueIcon";
import { EditSignatureTechniques } from "./EditSignatureTechniques";
import { EditProfile } from "./EditProfile";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import ProfileMessages from "./ProfileMessages";
import ProfileActivity from "./ProfileActivity";

const UnifiedProfile = () => {
  const { anglerId } = useParams<{ anglerId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isDemoMode, currentDemoUser } = useDemoMode();
  const { profile: currentUserProfile, loading, uploadAvatar, updateProfile } = useProfileData();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showEditTechniques, setShowEditTechniques] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  
  const activeTab = searchParams.get('tab') || 'overview';

  // Auto-redirect to badges tab if accessed via /badges route
  useEffect(() => {
    if (location.pathname === '/badges') {
      setSearchParams({ tab: 'badges' });
    }
  }, [location.pathname, setSearchParams]);

  // Determine if this is viewing own profile vs someone else's
  const isOwnProfile = !anglerId || (currentUserProfile && anglerId === currentUserProfile.id);
  
  // Get profile data - either current user's or public profile
  let profileData;
  let isLoading = false;

  if (isOwnProfile) {
    // Show current user's profile
    profileData = currentUserProfile;
    isLoading = loading;
  } else {
    // Show public profile from mock data
    profileData = anglerId ? mockPublicProfiles[anglerId as keyof typeof mockPublicProfiles] : null;
    if (anglerId && !profileData && !['jake-patterson', 'maria-santos', 'tommy-lee', 'mike-johnson', 'chris-wilson', 'sarah-johnson', 'mike-rodriguez'].includes(anglerId)) {
      // Invalid angler ID, redirect to own profile
      useEffect(() => {
        navigate("/profile", { replace: true });
      }, [navigate]);
      return null;
    }
  }

  // Generate initials from name
  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Handle following state for public profiles
  useEffect(() => {
    if (!isOwnProfile && anglerId && profileData) {
      const followedAnglers = JSON.parse(sessionStorage.getItem('followedAnglers') || '[]');
      setIsFollowing(followedAnglers.includes(anglerId));
    }
  }, [anglerId, profileData, isOwnProfile]);

  const handleFollowToggle = () => {
    if (isOwnProfile || !anglerId || !profileData) return;
    
    const followedAnglers = JSON.parse(sessionStorage.getItem('followedAnglers') || '[]');
    
    if (isFollowing) {
      const updated = followedAnglers.filter((id: string) => id !== anglerId);
      sessionStorage.setItem('followedAnglers', JSON.stringify(updated));
      setIsFollowing(false);
      toast({
        title: `Unfollowed ${profileData.name}`,
        description: "You will no longer see updates from this angler"
      });
    } else {
      const updated = [...followedAnglers, anglerId];
      sessionStorage.setItem('followedAnglers', JSON.stringify(updated));
      setIsFollowing(true);
      toast({
        title: `You're now following ${profileData.name}`,
        description: "You'll see their latest catches and tournament results"
      });
    }
  };

  const handleShare = () => {
    toast({
      title: "Demo only",
      description: "Profile sharing coming soon"
    });
  };

  const handleAvatarUpload = async (file: File) => {
    if (!isOwnProfile) return;
    return await uploadAvatar(file);
  };

  const handleTechniquesUpdate = (newTechniques: string[]) => {
    // The profile hook will automatically refresh after the update
  };

  // Badge data - consolidated here
  const earnedBadges = [
    {
      id: 'first-keeper',
      name: 'First Keeper',
      icon: Anchor,
      color: 'bg-amber-600 text-white',
      description: 'Your first keeper of the tournament',
      earned: true
    },
    {
      id: 'deep-water',
      name: 'Deep Water Bite',
      icon: Fish,
      color: 'bg-water-blue text-white',
      description: 'Mastered deep water fishing',
      earned: true
    },
    {
      id: 'pattern-change',
      name: 'Pattern Change',
      icon: TrendingUp,
      color: 'bg-fishing-green text-white',
      description: 'Adapted tactics to changing conditions',
      earned: true
    },
    {
      id: 'big-bass',
      name: 'Big Bass – Tournament Leader',
      icon: Trophy,
      color: 'bg-trophy-gold text-white',
      description: 'Caught the biggest bass of the tournament',
      earned: true
    }
  ];

  const lockedBadges = [
    {
      id: 'limit-out',
      name: 'Limit Out',
      icon: Award,
      description: 'Catch a full 5-fish limit',
      earned: false
    },
    {
      id: 'double-digit',
      name: 'Double Digit Day',
      icon: Target,
      description: 'Catch 10+ bass in one tournament',
      earned: false
    }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-2">Profile not found</h2>
          <p className="text-muted-foreground">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header with Action Menu */}
      <div className="bg-gradient-hero text-white px-4 py-4 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold">
              {isOwnProfile ? 'My Profile' : profileData.name}
            </h1>
          </div>
          
          {/* Floating Action Menu */}
          {isOwnProfile && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowActionMenu(!showActionMenu)}
                className="text-white hover:bg-white/20"
              >
                {showActionMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              
              {showActionMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-48 bg-card border rounded-lg shadow-lg z-50"
                >
                  <div className="p-2 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowEditProfile(true);
                        setShowActionMenu(false);
                      }}
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setShowEditTechniques(true);
                        setShowActionMenu(false);
                      }}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Edit Techniques
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/gear');
                        setShowActionMenu(false);
                      }}
                    >
                      <Anchor className="w-4 h-4 mr-2" />
                      Manage Gear
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        navigate('/settings');
                        setShowActionMenu(false);
                      }}
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header - Mobile First */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          {/* Large Profile Photo */}
          <div className="flex justify-center mb-4">
            {isOwnProfile ? (
              <div className="w-24 h-24">
                <AvatarUpload
                  currentAvatarUrl={profileData.avatar_url || profileData.avatar}
                  userName={profileData.name}
                  onUpload={handleAvatarUpload}
                />
              </div>
            ) : (
              <Avatar className="w-24 h-24 border-4 border-primary/20 shadow-lg">
                <AvatarImage src={profileData.avatar} alt={`Avatar — ${profileData.name}`} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
                  {getInitials(profileData.name)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          
          {/* Name and Basic Info */}
          <h1 className="text-2xl font-bold mb-2">{profileData.name}</h1>
          
          {/* Club and Location */}
          <div className="space-y-1 mb-4 text-sm text-muted-foreground">
            {(profileData.homeClub || profileData.club_data?.name || profileData.club) && (
              <div className="flex items-center justify-center gap-2">
                <Building className="w-4 h-4" />
                <span>{profileData.homeClub || profileData.club_data?.name || profileData.club}</span>
              </div>
            )}
            
            {((profileData.location) || (profileData.city || profileData.home_state)) && (
              <div className="flex items-center justify-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>
                  {profileData.location || [profileData.city, profileData.home_state].filter(Boolean).join(', ')}
                </span>
              </div>
            )}
            
            <div className="text-xs opacity-75 mt-2">
              Member since 2022 • Tournament Angler
            </div>
          </div>

          {/* Public Profile Action Buttons */}
          {!isOwnProfile && (
            <div className="flex justify-center space-x-3 mb-6">
              <Button 
                onClick={handleFollowToggle}
                className={isFollowing 
                  ? "bg-muted text-muted-foreground hover:bg-muted/80" 
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
                }
              >
                {isFollowing ? 'Following' : 'Follow'}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={() => navigate(`/messages/new?to=${anglerId}`)}
                aria-label={`Message ${profileData.name}`}
              >
                <MessageSquare className="w-4 h-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={handleShare}
              >
                <Share className="w-4 h-4" />
              </Button>
            </div>
          )}
        </motion.div>

        {/* Mobile Stats Grid - 2x3 Layout */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-lg">Career Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {/* Tournament Wins */}
                <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 border border-yellow-500/30 rounded-lg p-4 text-center">
                  <Trophy className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-yellow-700">
                    {profileData.stats?.wins || profileData.tournaments_won || 0}
                  </div>
                  <div className="text-xs text-yellow-600/80 font-medium">Tournament Wins</div>
                </div>
                
                {/* AOY Titles */}
                <div className="bg-gradient-to-br from-purple-400/20 to-purple-600/30 border border-purple-500/30 rounded-lg p-4 text-center">
                  <Crown className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-700">
                    {profileData.stats?.aoyTitles || profileData.aoy_titles || 0}
                  </div>
                  <div className="text-xs text-purple-600/80 font-medium">AOY Titles</div>
                </div>
                
                {/* Biggest Catch */}
                <div className="bg-gradient-to-br from-blue-400/20 to-blue-600/30 border border-blue-500/30 rounded-lg p-4 text-center">
                  <Fish className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-xl font-bold text-blue-700">
                    {profileData.stats?.pbWeight || profileData.biggest_catch_weight || '--'}
                    {(profileData.stats?.pbWeight || profileData.biggest_catch_weight) && <span className="text-sm"> lbs</span>}
                  </div>
                  <div className="text-xs text-blue-600/80 font-medium">Biggest Catch</div>
                </div>
                
                {/* Top 10 Finishes */}
                <div className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/30 border border-emerald-500/30 rounded-lg p-4 text-center">
                  <Medal className="w-6 h-6 text-emerald-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-emerald-700">
                    {profileData.stats?.top10 || profileData.top_10_finishes || 0}
                  </div>
                  <div className="text-xs text-emerald-600/80 font-medium">Top 10 Finishes</div>
                </div>
                
                {/* Top 20 Finishes */}
                <div className="bg-gradient-to-br from-orange-400/20 to-orange-600/30 border border-orange-500/30 rounded-lg p-4 text-center">
                  <Star className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-700">
                    {profileData.stats?.top20 || profileData.top_20_finishes || 0}
                  </div>
                  <div className="text-xs text-orange-600/80 font-medium">Top 20 Finishes</div>
                </div>
                
                {/* 1st Place Finishes */}
                <div className="bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-500/30 rounded-lg p-4 text-center">
                  <Zap className="w-6 h-6 text-amber-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-amber-700">
                    {profileData.stats?.firstPlace || 0}
                  </div>
                  <div className="text-xs text-amber-600/80 font-medium">1st Place</div>
                </div>
              </div>
              
              {/* View All Stats Link */}
              <div className="text-center mt-4">
                <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                  View All Career Stats →
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Signature Techniques Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Signature Techniques
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {(profileData.signature_techniques && profileData.signature_techniques.length > 0) || 
               (profileData.signatureTechniques && profileData.signatureTechniques.length > 0) ? (
                <div className="space-y-2">
                  {(profileData.signature_techniques || profileData.signatureTechniques || []).slice(0, 3).map((technique: string, index: number) => (
                    <div key={technique} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                      <Badge variant="secondary" className="text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center p-0">
                        {index + 1}
                      </Badge>
                      <TechniqueIcon technique={technique} className="w-4 h-4 text-primary" />
                      <span className="font-medium text-sm flex-1">{technique}</span>
                      {index === 0 && (
                        <Badge className="bg-primary/10 text-primary text-xs">
                          Primary
                        </Badge>
                      )}
                    </div>
                  ))}
                  
                  {/* Show more techniques indicator */}
                  {(profileData.signature_techniques || profileData.signatureTechniques || []).length > 3 && (
                    <div className="text-center pt-2">
                      <Button variant="ghost" size="sm" className="text-muted-foreground">
                        +{(profileData.signature_techniques || profileData.signatureTechniques || []).length - 3} more techniques
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No techniques set</p>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditTechniques(true)}
                      className="mt-2"
                    >
                      Add Techniques
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Links for Own Profile */}
        {isOwnProfile && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-2 gap-3">
              <Link to="/hybrid">
                <Button variant="outline" className="w-full h-12 flex flex-col gap-1">
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Club Activity</span>
                </Button>
              </Link>
              <Link to="/gear">
                <Button variant="outline" className="w-full h-12 flex flex-col gap-1">
                  <Anchor className="w-5 h-5" />
                  <span className="text-xs">My Gear</span>
                </Button>
              </Link>
            </div>
          </motion.div>
        )}

        {/* Mobile-Optimized Tabs */}
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => {
            const newSearchParams = new URLSearchParams(searchParams);
            if (value === 'overview') {
              newSearchParams.delete('tab');
            } else {
              newSearchParams.set('tab', value);
            }
            setSearchParams(newSearchParams);
          }}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-4 h-12">
            <TabsTrigger value="overview" className="flex flex-col gap-1 text-xs">
              <Trophy className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex flex-col gap-1 text-xs">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex flex-col gap-1 text-xs">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex flex-col gap-1 text-xs">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 mt-6">
            {/* Recent Activity Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                    <Trophy className="w-5 h-5 text-trophy-gold" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">2nd Place - Lake Guntersville</p>
                      <p className="text-xs text-muted-foreground">3 days ago • 15.4 lbs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                    <Fish className="w-5 h-5 text-water-blue" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Caught 6.2 lb Bass</p>
                      <p className="text-xs text-muted-foreground">1 week ago • Wheeler Lake</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-lg">
                    <Calendar className="w-5 h-5 text-fishing-green" />
                    <div className="flex-1">
                      <p className="text-sm font-medium">Registered for Tournament</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago • Smith Lake Classic</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            {/* Mobile-Optimized Badges */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                  Earned Badges ({earnedBadges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {earnedBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={badge.id} className="bg-card rounded-lg p-3 border shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${badge.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="font-bold text-xs">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1 leading-tight">{badge.description}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Card className="border-dashed">
                  <CardHeader>
                    <CardTitle className="flex items-center text-sm">
                      <Lock className="w-4 h-4 mr-2 text-muted-foreground" />
                      Locked Badges
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      {lockedBadges.map((badge) => {
                        const IconComponent = badge.icon;
                        return (
                          <div key={badge.id} className="bg-muted/30 rounded-lg p-3 border-2 border-dashed border-muted">
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center relative">
                                <IconComponent className="w-5 h-5 text-muted-foreground" />
                                <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-bold text-xs text-muted-foreground">{badge.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1 leading-tight">{badge.description}</p>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ProfileMessages anglerId={isOwnProfile ? undefined : anglerId} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ProfileActivity angler={profileData} />
          </TabsContent>
        </Tabs>

        {/* Bottom Spacing */}
        <div className="h-20"></div>
      </div>

      {/* Action Menu Backdrop */}
      {showActionMenu && (
        <div 
          className="fixed inset-0 bg-black/20 z-40"
          onClick={() => setShowActionMenu(false)}
        />
      )}

      {/* Edit Modals */}
      {isOwnProfile && (
        <>
          <EditSignatureTechniques
            open={showEditTechniques}
            onOpenChange={setShowEditTechniques}
            currentTechniques={profileData.signature_techniques || []}
            onUpdate={handleTechniquesUpdate}
          />
          
          <EditProfile
            open={showEditProfile}
            onOpenChange={setShowEditProfile}
            currentProfile={profileData}
            onUpdate={updateProfile}
          />
        </>
      )}
    </div>
  );
};

export default UnifiedProfile;