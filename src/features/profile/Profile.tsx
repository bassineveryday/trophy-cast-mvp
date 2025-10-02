import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Fish, Target, Award, MapPin, MessageSquare, Edit3, Building, Calendar, Home, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import { useAuth } from "@/contexts/AuthContext";
import { useSignatureTechniques } from "@/hooks/useSignatureTechniques";
import { useProfileData } from "@/hooks/useProfileData";
import { EditSignatureTechniques } from "./EditSignatureTechniques";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { AvatarUpload } from "@/components/AvatarUpload";
import { TechniqueIcon } from "@/components/TechniqueIcon";
import { ProfileMicroCopy } from "@/components/ProfileMicroCopy";
import { PageHeader } from "@/components/PageHeader";
import { useDemoMode } from "@/contexts/DemoModeContext";
import { MEMBER_PROFILES } from "@/data/memberProfiles";
import { BottomNavigation } from "@/components/BottomNavigation";

const Profile = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { role } = useDemoMode();
  const { profile, loading, uploadAvatar, updateProfile } = useProfileData();
  const { getSignatureTechniques } = useSignatureTechniques();
  
  // Check if showing demo profile
  const isDemo = role === "jake" || role === "president";
  const demoUsername = role === "jake" ? "jake-wilson" : role === "president" ? "mike-johnson" : null;
  const demoProfile = demoUsername ? MEMBER_PROFILES[demoUsername] : null;
  const [showEditTechniques, setShowEditTechniques] = useState(false);

  const handleTechniquesUpdate = (newTechniques: string[]) => {
    // The profile hook will automatically refresh after the update
  };

  const handleAvatarUpload = async (file: File) => {
    return await uploadAvatar(file);
  };

  // Show demo profile if in demo mode
  if (isDemo && demoProfile) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title={`${demoProfile.name}'s Profile`} />
        
        <div className="p-4">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-2xl mb-4">
                  {demoProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h2 className="text-2xl font-bold mb-2">{demoProfile.name}</h2>
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Home className="w-4 h-4" />
                  <span className="text-sm">{demoProfile.hometown}</span>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{demoProfile.bio}</p>
                
                {demoProfile.clubs.map((club, idx) => (
                  <Badge key={idx} variant="outline" className="mb-2">
                    <Building className="w-3 h-3 mr-1" />
                    {club.name} • {club.role}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
                Career Statistics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-trophy-gold">{demoProfile.stats.tournaments}</p>
                  <p className="text-xs text-muted-foreground">Tournaments</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-trophy-gold">{demoProfile.stats.winRate}%</p>
                  <p className="text-xs text-muted-foreground">Win Rate</p>
                </div>
                <div className="text-center p-3 bg-accent rounded-lg">
                  <p className="text-2xl font-bold text-fishing-green">{demoProfile.stats.catches}</p>
                  <p className="text-xs text-muted-foreground">Catches</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Button variant="outline" className="w-full" onClick={() => navigate("/profile/trophy-room")}>
              <Trophy className="w-4 h-4 mr-2" />
              Trophy Room ({demoProfile.trophies.length})
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate(`/profile/${demoUsername}`)}>
              <Users className="w-4 h-4 mr-2" />
              Full Profile
            </Button>
          </div>
        </div>
        
        <BottomNavigation />
      </div>
    );
  }

  // Loading state for real user
  if (loading && !isDemo) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center pb-20">
        <LoadingSpinner message="Loading profile..." />
      </div>
    );
  }

  // Real user profile - show Supabase data only
  if (!profile || !user) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <PageHeader title="Your Profile" />
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-xl font-bold mb-2">Profile not found</h2>
            <p className="text-muted-foreground mb-4">Please try refreshing the page or creating your profile.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }
  // Real user profile with actual Supabase data
  return (
    <div className="min-h-screen bg-background pb-20">
      <PageHeader title="Your Profile" />
      
      <div className="p-4">

      {/* Enhanced User Profile Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Avatar with upload capability */}
            <ProfileMicroCopy 
              profile={profile} 
              isOwner={true}
              onEditTechniques={() => setShowEditTechniques(true)}
            >
              <AvatarUpload
                currentAvatarUrl={profile.avatar_url}
                userName={profile.name}
                onUpload={handleAvatarUpload}
              />
            </ProfileMicroCopy>
            
            {/* Profile Information */}
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h2>
              
              {/* Location & Club Info */}
              <div className="space-y-2 mb-4">
                {profile.club_data && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Building className="w-4 h-4" />
                    <span className="text-sm">{profile.club_data.name}</span>
                    {profile.club_data.location && (
                      <span className="text-xs">• {profile.club_data.location}</span>
                    )}
                  </div>
                )}
                
                {(profile.city || profile.home_state) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Home className="w-4 h-4" />
                    <span className="text-sm">
                      {[profile.city, profile.home_state].filter(Boolean).join(', ')}
                    </span>
                  </div>
                )}
              </div>

              {/* Signature Techniques Preview */}
              {profile.signature_techniques && profile.signature_techniques.length > 0 && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Signature Techniques
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.signature_techniques.slice(0, 3).map((technique, index) => (
                      <Badge key={technique} variant="secondary" className="flex items-center gap-1">
                        <span className="text-xs font-bold">#{index + 1}</span>
                        <TechniqueIcon technique={technique} className="w-3 h-3" />
                        <span className="text-xs">{technique}</span>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Edit Button */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEditTechniques(true)}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-3 h-3" />
                Edit Techniques
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Career Statistics */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
            Career Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-trophy-gold">{profile.tournaments_fished}</p>
              <p className="text-xs text-muted-foreground">Tournaments</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-fishing-green">{profile.aoy_titles}</p>
              <p className="text-xs text-muted-foreground">AOY Titles</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-water-blue">
                {profile.biggest_catch_weight ? `${profile.biggest_catch_weight} lbs` : '--'}
              </p>
              <p className="text-xs text-muted-foreground">Biggest Catch</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <div className="flex flex-col items-center">
                <MapPin className="w-6 h-6 text-primary mb-1" />
                <p className="text-xs text-muted-foreground text-center">
                  {profile.favorite_water || 'Not set'}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Biggest Catch Details */}
      {profile.biggest_catch_weight && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Fish className="w-5 h-5 mr-2 text-water-blue" />
              Biggest Catch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-r from-trophy-gold/5 to-fishing-green/5 p-4 rounded-lg border border-trophy-gold/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-trophy-gold">
                  {profile.biggest_catch_weight} lbs
                </span>
                <Badge variant="secondary" className="bg-trophy-gold/10 text-trophy-gold">
                  <Award className="w-3 h-3 mr-1" />
                  Record
                </Badge>
              </div>
              {profile.biggest_catch_species && (
                <p className="text-sm font-medium">{profile.biggest_catch_species}</p>
              )}
              {profile.biggest_catch_location && (
                <p className="text-xs text-muted-foreground">{profile.biggest_catch_location}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Signature Techniques */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Signature Techniques & Strengths
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditTechniques(true)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-3 h-3" />
              Edit Techniques
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {profile.signature_techniques && profile.signature_techniques.length > 0 ? (
            <div className="space-y-3">
              {profile.signature_techniques.map((technique, index) => (
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
              <p className="text-xs text-muted-foreground mt-3">
                Techniques listed by preference. #1 is your strongest technique.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-sm font-medium">No signature techniques set</p>
              <p className="text-xs mb-4">Show other anglers what techniques you excel at</p>
              <Button
                onClick={() => setShowEditTechniques(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Target className="w-4 h-4 mr-2" />
                Add Your Techniques
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Club Newsletter */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-primary" />
              Club Newsletter
            </div>
            <Link to="/messages?tab=club">
              <Button variant="outline" size="sm">View All Club Messages</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="cursor-pointer hover:bg-accent/50 p-4 rounded-lg border transition-colors"
            onClick={() => window.location.href = '/messages/club/club-1'}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Alabama Bass Nation – Chapter 12 Newsletter</h3>
              <Badge className="bg-water-blue/10 text-water-blue text-xs">Sept 2025</Badge>
            </div>
            
            <div className="space-y-2 text-sm">
              <p>🎣 <strong>Tournament Recap</strong> – Wheeler Lake (Sept 14): Jake Patterson wins (17.8 lbs), Maria Santos 2nd (16.3 lbs)</p>
              <p>🏆 <strong>AOY Standings Top 3:</strong> Maria Santos (1,723 pts), Jake Patterson (1,685 pts), Chris Wilson (1,612 pts)</p>
              <p>📝 <strong>Last Meeting:</strong> dues collected $1,450; approved fall schedule; Strike King sponsor renewal</p>
              <p>📋 <strong>Next Meeting (Oct 8):</strong> review Wheeler results, plan Guntersville Open (Oct 20)</p>
            </div>
            
            <Button variant="outline" size="sm" className="mt-3">
              Read Full Newsletter
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Link to="/my-catches">
          <Button variant="outline" className="w-full h-12">
            <Fish className="w-4 h-4 mr-2" />
            My Catches
          </Button>
        </Link>
        <Link to="/badges">
          <Button variant="outline" className="w-full h-12">
            <Award className="w-4 h-4 mr-2" />
            Badge Collection
          </Button>
        </Link>
      </div>

      {/* Context-Aware AI Button */}
      <ContextAwareFloatingButton />

      {/* Edit Signature Techniques Modal */}
      <EditSignatureTechniques
        open={showEditTechniques}
        onOpenChange={setShowEditTechniques}
        currentTechniques={profile.signature_techniques || []}
        onUpdate={handleTechniquesUpdate}
      />
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default Profile;