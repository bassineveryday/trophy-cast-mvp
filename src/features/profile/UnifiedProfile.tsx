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
  Lock
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
      {/* Header with back button */}
      <div className="bg-gradient-hero text-white px-4 py-4">
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
            {isOwnProfile ? 'My Profile' : 'Angler Profile'}
          </h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  {isOwnProfile ? (
                    <AvatarUpload
                      currentAvatarUrl={profileData.avatar_url || profileData.avatar}
                      userName={profileData.name}
                      onUpload={handleAvatarUpload}
                    />
                  ) : (
                    <Avatar className="w-20 h-20 border-2 border-primary/20">
                      <AvatarImage src={profileData.avatar} alt={`Avatar — ${profileData.name}`} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                        {getInitials(profileData.name)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">{profileData.name}</h1>
                  
                  {/* Location & Club Info */}
                  <div className="space-y-2 mb-4">
                    {(profileData.homeClub || profileData.club_data?.name || profileData.club) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Building className="w-4 h-4" />
                        <span className="text-sm">
                          {profileData.homeClub || profileData.club_data?.name || profileData.club}
                        </span>
                      </div>
                    )}
                    
                    {((profileData.location) || (profileData.city || profileData.home_state)) && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Home className="w-4 h-4" />
                        <span className="text-sm">
                          {profileData.location || [profileData.city, profileData.home_state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Achievement Plaques - Compact Design */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 mb-4">
                    <div className="bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 border border-yellow-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-yellow-500/20 transition-all duration-300 backdrop-blur-sm">
                      <div className="text-lg font-bold text-yellow-600 mb-0.5">🥇</div>
                      <div className="text-base font-semibold text-yellow-700">
                        {profileData.stats?.wins || profileData.tournaments_won || 0}
                      </div>
                      <div className="text-[10px] text-yellow-600/80 font-medium leading-tight">Tournament Wins</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-emerald-400/20 to-emerald-600/30 border border-emerald-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 backdrop-blur-sm">
                      <div className="text-lg font-bold text-emerald-600 mb-0.5">⭐</div>
                      <div className="text-base font-semibold text-emerald-700">
                        {profileData.stats?.top10 || profileData.top_10_finishes || 0}
                      </div>
                      <div className="text-[10px] text-emerald-600/80 font-medium leading-tight">Top 10 Finishes</div>
                    </div>
                    
                    <div className="bg-gradient-to-br from-amber-400/20 to-amber-600/30 border border-amber-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-amber-500/20 transition-all duration-300 backdrop-blur-sm">
                      <div className="text-lg font-bold text-amber-600 mb-0.5">🏆</div>
                      <div className="text-base font-semibold text-amber-700">
                        {profileData.stats?.aoyTitles || profileData.aoy_titles || 0}
                      </div>
                      <div className="text-[10px] text-amber-600/80 font-medium leading-tight">AOY Titles</div>
                    </div>
                   
                    <div className="bg-gradient-to-br from-blue-400/20 to-blue-600/30 border border-blue-500/30 rounded-lg p-2 text-center cursor-pointer hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 backdrop-blur-sm">
                      <div className="text-lg font-bold text-blue-600 mb-0.5">🎣</div>
                      <div className="text-base font-semibold text-blue-700">
                        {profileData.stats?.pbWeight || profileData.biggest_catch_weight || '--'}
                      </div>
                      <div className="text-[10px] text-blue-600/80 font-medium leading-tight">Big Bass (PB)</div>
                    </div>
                  </div>
                   
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    {isOwnProfile ? (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEditProfile(true)}
                          className="flex items-center gap-2"
                        >
                          <Edit3 className="w-3 h-3" />
                          Edit Profile
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEditTechniques(true)}
                          className="flex items-center gap-2"
                        >
                          <Target className="w-3 h-3" />
                          Edit Techniques
                        </Button>
                      </>
                    ) : (
                      <>
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
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Profile Tabs */}
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
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="badges" className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Badges
            </TabsTrigger>
            <TabsTrigger value="messages" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Messages
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Career Statistics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                  Career Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <p className="text-2xl font-bold text-trophy-gold">
                      {profileData.tournaments_fished || profileData.stats?.tournamentsFished || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">Tournaments</p>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <p className="text-2xl font-bold text-fishing-green">
                      {profileData.aoy_titles || profileData.stats?.aoyTitles || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">AOY Titles</p>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <p className="text-2xl font-bold text-water-blue">
                      {profileData.biggest_catch_weight ? `${profileData.biggest_catch_weight} lbs` : 
                       profileData.stats?.pbWeight ? `${profileData.stats.pbWeight}` : '--'}
                    </p>
                    <p className="text-xs text-muted-foreground">Biggest Catch</p>
                  </div>
                  <div className="text-center p-3 bg-accent rounded-lg">
                    <div className="flex flex-col items-center">
                      <MapPin className="w-6 h-6 text-primary mb-1" />
                      <p className="text-xs text-muted-foreground text-center">
                        {profileData.favorite_water || profileData.favoriteWater || 'Not set'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Signature Techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Target className="w-5 h-5 mr-2 text-primary" />
                    Signature Techniques & Strengths
                  </div>
                  {isOwnProfile && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowEditTechniques(true)}
                      className="flex items-center gap-2"
                    >
                      <Edit3 className="w-3 h-3" />
                      Edit
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {(profileData.signature_techniques && profileData.signature_techniques.length > 0) || 
                 (profileData.signatureTechniques && profileData.signatureTechniques.length > 0) ? (
                  <div className="space-y-3">
                    {(profileData.signature_techniques || profileData.signatureTechniques || []).map((technique: string, index: number) => (
                      <div key={technique} className="flex items-center gap-3 p-4 bg-accent rounded-lg hover:bg-accent/80 transition-colors">
                        <Badge variant="secondary" className="text-sm font-bold min-w-[2rem] h-8 flex items-center justify-center">
                          #{index + 1}
                        </Badge>
                        <TechniqueIcon technique={technique} className="w-5 h-5 text-primary" />
                        <span className="font-medium flex-1">{technique}</span>
                        {index === 0 && (
                          <Badge className="bg-primary/10 text-primary text-xs">
                            Primary Strength
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm font-medium">No signature techniques set</p>
                    <p className="text-xs mb-4">Show other anglers what techniques you excel at</p>
                    {isOwnProfile && (
                      <Button
                        onClick={() => setShowEditTechniques(true)}
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Target className="w-4 h-4 mr-2" />
                        Add Your Techniques
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions for own profile */}
            {isOwnProfile && (
              <div className="grid grid-cols-2 gap-4">
                <Link to="/hybrid">
                  <Button variant="outline" className="w-full h-12">
                    <Users className="w-4 h-4 mr-2" />
                    Club Activity
                  </Button>
                </Link>
                <Link to="/gear">
                  <Button variant="outline" className="w-full h-12">
                    <Anchor className="w-4 h-4 mr-2" />
                    My Gear
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>

          <TabsContent value="badges" className="mt-6">
            {/* Badges content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                  Earned Badges ({earnedBadges.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {earnedBadges.map((badge) => {
                    const IconComponent = badge.icon;
                    return (
                      <div key={badge.id} className="bg-card rounded-lg p-4 border shadow-sm">
                        <div className="flex flex-col items-center text-center space-y-2">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.color}`}>
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className="font-bold text-sm">{badge.name}</h3>
                            <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
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
                    <div className="grid grid-cols-2 gap-4">
                      {lockedBadges.map((badge) => {
                        const IconComponent = badge.icon;
                        return (
                          <div key={badge.id} className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted">
                            <div className="flex flex-col items-center text-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center relative">
                                <IconComponent className="w-6 h-6 text-muted-foreground" />
                                <Lock className="w-3 h-3 absolute -top-1 -right-1 text-muted-foreground" />
                              </div>
                              <div>
                                <h3 className="font-bold text-sm text-muted-foreground">{badge.name}</h3>
                                <p className="text-xs text-muted-foreground mt-1">{badge.description}</p>
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
      </div>

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