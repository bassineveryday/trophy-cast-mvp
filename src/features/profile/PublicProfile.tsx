import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Trophy, 
  Fish, 
  Target,
  Award,
  Calendar,
  ArrowLeft,
  MessageSquare,
  Activity,
  Share
} from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import ProfileMessages from "./ProfileMessages";
import ProfileActivity from "./ProfileActivity";

const PublicProfile = () => {
  const { anglerId } = useParams<{ anglerId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const activeTab = searchParams.get('tab') || 'overview';

  // Generate initials from name - consistent with UniversalAvatar
  const getInitials = (fullName: string) => {
    const words = fullName.trim().split(/\s+/);
    if (words.length >= 2) {
      return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  // Empty state for demo cleanup
  const angler = null;

  // Redirect fix: only redirect for truly invalid IDs
  useEffect(() => {
    console.log('PublicProfile Debug:', { anglerId, angler: !!angler });
    
    // Only redirect if we have an anglerId that definitely doesn't exist in our data
    if (anglerId && !angler && !['jake-patterson', 'maria-santos', 'tommy-lee', 'mike-johnson', 'chris-wilson', 'sarah-johnson', 'mike-rodriguez'].includes(anglerId)) {
      console.log('Redirecting invalid anglerId:', anglerId);
      navigate("/profile", { replace: true });
    }
  }, [anglerId, angler, navigate]);

  // Optional: show a tiny placeholder while params resolve
  if (!anglerId) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-sm text-muted-foreground">
        Loading profile…
      </div>
    );
  }

  // Show empty state for public profiles
  if (!angler) {
    return (
      <div className="min-h-screen bg-background">
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
            <h1 className="text-xl font-bold">Angler Profile</h1>
          </div>
        </div>
        
        <div className="px-4 py-8">
          <Card className="border-2 border-dashed border-muted-foreground/20">
            <CardContent className="p-8 text-center">
              <Avatar className="w-16 h-16 mx-auto mb-4 bg-muted">
                <AvatarFallback className="text-muted-foreground">?</AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-medium mb-2">Profile not found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                This angler profile is not available or does not exist.
              </p>
              <Button onClick={() => navigate(-1)}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Go Back
              </Button>
            </CardContent>
          </Card>
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
          <h1 className="text-xl font-bold">Angler Profile</h1>
        </div>
      </div>

      <div className="px-4 py-6 space-y-6">
        {/* Profile Header - Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start space-x-4">
                <Avatar className="w-20 h-20 border-2 border-primary/20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                    ?
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1">
                  <h1 className="text-2xl font-bold mb-1">Angler Profile</h1>
                  <p className="text-sm text-muted-foreground mb-3">Profile not available</p>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline"
                      onClick={() => navigate(`/messages/new?to=${anglerId}`)}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => toast({
                        title: "Share Profile",
                        description: "Profile sharing coming soon"
                      })}
                    >
                      <Share className="w-4 h-4" />
                    </Button>
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <Trophy className="w-4 h-4" />
              Overview
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
            {/* Season Snapshot */}
            <div className="space-y-4">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-primary" />
                <h3 className="text-base font-semibold">2024 Season Snapshot</h3>
              </div>
              
              {/* Empty season snapshot */}
              <Card className="border-2 border-dashed border-muted-foreground/20">
                <CardContent className="p-8 text-center">
                  <Calendar className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium mb-2">No season data yet</h3>
                  <p className="text-sm text-muted-foreground">
                    Season statistics will appear here once tournaments are completed.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Catches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Fish className="w-5 h-5 mr-2 text-primary" />
                  Recent Catches
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Fish className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium mb-2">No catches yet</h3>
                  <p className="text-sm">Recent catches will appear here.</p>
                </div>
              </CardContent>
            </Card>

            {/* Signature Techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="w-5 h-5 mr-2 text-primary" />
                  Signature Techniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Target className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium mb-2">No techniques shared</h3>
                  <p className="text-sm">Signature techniques will appear here.</p>
                </div>
              </CardContent>
            </Card>

            {/* Club Memberships */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  Club Memberships
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Award className="w-12 h-12 mx-auto mb-4 text-muted-foreground/40" />
                  <h3 className="text-lg font-medium mb-2">No club memberships</h3>
                  <p className="text-sm">Club memberships will appear here when they join clubs.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="messages" className="mt-6">
            <ProfileMessages anglerId={anglerId} />
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            <ProfileActivity angler={angler} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PublicProfile;