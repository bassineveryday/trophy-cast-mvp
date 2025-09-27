import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom";
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
  ArrowLeft,
  MessageSquare,
  Edit3,
  Building,
  MapPin,
  Anchor,
  Menu,
  X,
  Settings,
  Medal,
  Crown,
  Zap,
  Ship,
  Clock,
  ChevronRight,
  Lock
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    const words = fullName?.trim().split(/\s+/) || [];
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName?.substring(0, 2).toUpperCase() || "AA";
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

  // Badge data - consolidated here
  const earnedBadges = [
    {
      id: 'first-keeper',
      name: 'First Keeper',
      icon: Anchor,
      color: 'bg-gradient-to-br from-trophy-gold to-trophy-gold-light text-white',
      description: 'Your first keeper of the tournament',
      earned: true
    },
    {
      id: 'deep-water',
      name: 'Deep Water Bite',
      icon: Fish,
      color: 'bg-gradient-to-br from-water-blue to-water-blue-light text-white',
      description: 'Mastered deep water fishing',
      earned: true
    },
    {
      id: 'pattern-change',
      name: 'Pattern Change',
      icon: TrendingUp,
      color: 'bg-gradient-to-br from-fishing-green to-fishing-green-light text-white',
      description: 'Adapted tactics to changing conditions',
      earned: true
    },
    {
      id: 'big-bass',
      name: 'Big Bass – Tournament Leader',
      icon: Trophy,
      color: 'bg-gradient-trophy text-white',
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

  // Signature techniques data with defensive fallbacks
  const signatureTechniques = profileData?.signature_techniques || profileData?.signatureTechniques || [];
  
  // Mock boat data with defensive fallback
  const boatData = {
    nickname: profileData?.boatNickname || "Bass Hunter",
    brand: profileData?.boatBrand || "Ranger Z520L",
    year: profileData?.boatYear || "2023",
    image: profileData?.boatImage || "/placeholder.svg"
  };

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
      {/* Mobile Header with Club Color Accent */}
      <div className="bg-gradient-hero text-white relative border-b-4 border-primary/30">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost" 
              size="icon"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            {/* Floating Action Menu - Hidden by Default */}
            {isOwnProfile && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowActionMenu(!showActionMenu)}
                  className="text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
                >
                  {showActionMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </Button>
                
                <AnimatePresence>
                  {showActionMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      className="absolute right-0 top-full mt-2 w-56 bg-card border rounded-lg shadow-lg z-50"
                    >
                      <div className="p-2 space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start min-h-[44px]"
                          onClick={() => {
                            setShowEditProfile(true);
                            setShowActionMenu(false);
                          }}
                        >
                          <Edit3 className="w-4 h-4 mr-3" />
                          Edit Profile
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start min-h-[44px]"
                          onClick={() => {
                            setShowEditTechniques(true);
                            setShowActionMenu(false);
                          }}
                        >
                          <Target className="w-4 h-4 mr-3" />
                          Edit Techniques
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start min-h-[44px]"
                          onClick={() => {
                            navigate('/gear');
                            setShowActionMenu(false);
                          }}
                        >
                          <Anchor className="w-4 h-4 mr-3" />
                          Manage Gear
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start min-h-[44px]"
                          onClick={() => {
                            setShowActionMenu(false);
                          }}
                        >
                          <Settings className="w-4 h-4 mr-3" />
                          Settings
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Large Profile Photo - Mobile First */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4">
              {isOwnProfile ? (
                <div className="w-32 h-32">
                  <AvatarUpload
                    currentAvatarUrl={profileData.avatar_url || profileData.avatar}
                    userName={profileData.name || "Angler"}
                    onUpload={handleAvatarUpload}
                  />
                </div>
              ) : (
                <Avatar className="w-32 h-32 border-4 border-white/20 shadow-xl">
                  <AvatarImage src={profileData.avatar} alt={`Avatar — ${profileData.name}`} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-3xl font-bold">
                    {getInitials(profileData.name || "")}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
            
            {/* Name and Basic Info */}
            <h1 className="text-3xl font-bold mb-2">{profileData.name || "Unknown Angler"}</h1>
            
            {/* Club and Role Badge */}
            <div className="flex items-center justify-center gap-2 mb-2">
              {(profileData.homeClub || profileData.club_data?.name || profileData.club) && (
                <>
                  <Building className="w-4 h-4" />
                  <span className="font-medium">{profileData.homeClub || profileData.club_data?.name || profileData.club}</span>
                  {profileData.role && (
                    <Badge variant="secondary" className="ml-2 bg-primary/20 text-white border-white/20">
                      {profileData.role}
                    </Badge>
                  )}
                </>
              )}
            </div>
            
            {/* Location and Member Since */}
            <div className="space-y-1 text-sm text-white/80">
              {((profileData.location) || (profileData.city || profileData.home_state)) && (
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {profileData.location || [profileData.city, profileData.home_state].filter(Boolean).join(', ') || "Unknown Location"}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-center gap-2 text-xs opacity-90">
                <Clock className="w-3 h-3" />
                <span>Member since {profileData.memberSince || "2022"} • Tournament Angler</span>
              </div>
            </div>

            {/* Public Profile Action Buttons */}
            {!isOwnProfile && (
              <div className="flex justify-center space-x-3 mt-6">
                <Button 
                  onClick={handleFollowToggle}
                  className={isFollowing 
                    ? "bg-white/20 text-white hover:bg-white/30 min-h-[44px]" 
                    : "bg-white text-primary hover:bg-white/90 min-h-[44px]"
                  }
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => navigate(`/messages/new?to=${anglerId}`)}
                  aria-label={`Message ${profileData.name}`}
                  className="border-white/30 text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
                >
                  <MessageSquare className="w-5 h-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={handleShare}
                  className="border-white/30 text-white hover:bg-white/20 min-h-[44px] min-w-[44px]"
                >
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Content - Single Column, max width for larger screens */}
      <div className="px-4 py-6 space-y-6 max-w-md mx-auto min-[320px]:px-3">
        {/* Mobile Stats Grid - 2x3 Layout - Scrollable */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-primary" />
              Career Stats
            </h2>
            
            <div className="grid grid-cols-2 gap-3">
              {/* Tournament Wins */}
              <div className="bg-gradient-to-br from-trophy-gold/10 to-trophy-gold/20 border border-trophy-gold/30 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                <Trophy className="w-8 h-8 text-trophy-gold mx-auto mb-2" />
                <div className="text-2xl font-bold text-trophy-gold">
                  {profileData.stats?.wins || profileData.tournaments_won || 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Tournament Wins</div>
              </div>
              
              {/* AOY Titles */}
              <div className="bg-gradient-to-br from-primary/10 to-primary/20 border border-primary/30 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">
                  {profileData.stats?.aoyTitles || profileData.aoy_titles || 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">AOY Titles</div>
              </div>
              
              {/* Biggest Catch */}
              <div className="bg-gradient-to-br from-water-blue/10 to-water-blue/20 border border-water-blue/30 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                <Fish className="w-8 h-8 text-water-blue mx-auto mb-2" />
                <div className="text-xl font-bold text-water-blue">
                  {profileData.stats?.pbWeight || profileData.biggest_catch_weight || '--'}
                  {(profileData.stats?.pbWeight || profileData.biggest_catch_weight) && <span className="text-sm"> lbs</span>}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Biggest Catch</div>
              </div>
              
              {/* Top 10 Finishes */}
              <div className="bg-gradient-to-br from-fishing-green/10 to-fishing-green/20 border border-fishing-green/30 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                <Medal className="w-8 h-8 text-fishing-green mx-auto mb-2" />
                <div className="text-2xl font-bold text-fishing-green">
                  {profileData.stats?.top10 || profileData.top_10_finishes || 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Top 10 Finishes</div>
              </div>
              
              {/* First Place Finishes */}
              <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 border border-yellow-500/30 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-yellow-700">
                  {profileData.stats?.firstPlace || 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">1st Place</div>
              </div>
              
              {/* Top 20 Finishes */}
              <div className="bg-gradient-to-br from-orange-400/20 to-orange-600/30 border border-orange-500/30 rounded-lg p-4 text-center min-h-[100px] flex flex-col justify-center">
                <Star className="w-8 h-8 text-orange-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-orange-700">
                  {profileData.stats?.top20 || profileData.top_20_finishes || 0}
                </div>
                <div className="text-xs text-muted-foreground font-medium">Top 20 Finishes</div>
              </div>
            </div>
            
            {/* View All Stats Link */}
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-sm text-primary hover:bg-primary/10 min-h-[44px]"
              onClick={() => setSearchParams({ tab: 'badges' })}
            >
              View All Career Stats
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Signature Techniques - Icons/Chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Signature Techniques
            </h3>
            
            {signatureTechniques.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {signatureTechniques.map((technique, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-3 py-2 min-h-[44px]"
                  >
                    <TechniqueIcon technique={technique} />
                    <span className="text-sm font-medium">{technique}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm mb-3">No signature techniques added yet</p>
                {isOwnProfile && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="min-h-[44px]"
                    onClick={() => setShowEditTechniques(true)}
                  >
                    Add Techniques
                  </Button>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Compact Boat Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Ship className="w-5 h-5 mr-2 text-primary" />
              My Boat
            </h3>
            
            <Card className="border-primary/20 hover:border-primary/40 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Ship className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold truncate">{boatData.nickname}</h4>
                    <p className="text-sm text-muted-foreground truncate">
                      {boatData.year} {boatData.brand}
                    </p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Mobile-Optimized Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs value={activeTab} onValueChange={(value) => setSearchParams({ tab: value })}>
            <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
              <TabsTrigger value="overview" className="text-xs font-medium">Overview</TabsTrigger>
              <TabsTrigger value="badges" className="text-xs font-medium">Badges</TabsTrigger>
              <TabsTrigger value="activity" className="text-xs font-medium">Activity</TabsTrigger>
              <TabsTrigger value="messages" className="text-xs font-medium">Messages</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg min-h-[60px]">
                    <Trophy className="w-6 h-6 text-trophy-gold flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Won Tournament at Lake Martin</p>
                      <p className="text-xs text-muted-foreground">2 days ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg min-h-[60px]">
                    <Fish className="w-6 h-6 text-water-blue flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Caught 6.2 lb bass</p>
                      <p className="text-xs text-muted-foreground">1 week ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg min-h-[60px]">
                    <Calendar className="w-6 h-6 text-fishing-green flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">Registered for Spring Classic</p>
                      <p className="text-xs text-muted-foreground">2 weeks ago</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="badges" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  Earned Badges
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {earnedBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={badge.id} className={`${badge.color} rounded-lg p-4 text-center min-h-[120px] flex flex-col justify-center`}>
                        <IconComponent className="w-8 h-8 mx-auto mb-2" />
                        <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                        <p className="text-xs opacity-90 leading-tight">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Lock className="w-5 h-5 mr-2 text-muted-foreground" />
                  Locked Badges
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {lockedBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={badge.id} className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted text-center min-h-[120px] flex flex-col justify-center">
                        <div className="relative inline-block mb-2">
                          <IconComponent className="w-8 h-8 text-muted-foreground" />
                          <Lock className="w-4 h-4 absolute -top-1 -right-1 text-muted-foreground bg-background rounded-full p-0.5" />
                        </div>
                        <h4 className="font-semibold text-sm mb-1 text-muted-foreground">{badge.name}</h4>
                        <p className="text-xs text-muted-foreground leading-tight">{badge.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="activity">
              <ProfileActivity angler={profileData} />
            </TabsContent>

            <TabsContent value="messages">
              <ProfileMessages />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      {/* Edit Modals */}
      {showEditProfile && isOwnProfile && (
        <EditProfile 
          open={showEditProfile}
          onOpenChange={setShowEditProfile}
          currentProfile={profileData}
          onUpdate={updateProfile}
        />
      )}

      {showEditTechniques && isOwnProfile && (
        <EditSignatureTechniques
          open={showEditTechniques}
          onOpenChange={setShowEditTechniques}
          currentTechniques={signatureTechniques}
          onUpdate={(techniques) => {
            updateProfile({ signature_techniques: techniques });
          }}
        />
      )}
    </div>
  );
};

export default UnifiedProfile;