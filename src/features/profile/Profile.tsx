import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ArrowLeft, Trophy, Fish, Target, TrendingUp, Award, MapPin, MessageSquare, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";
import { mockUser, mockCareerStats } from "@/data/mockData";
import { useAuth } from "@/contexts/AuthContext";
import { useSignatureTechniques } from "@/hooks/useSignatureTechniques";
import { EditSignatureTechniques } from "./EditSignatureTechniques";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Profile = () => {
  const { profile } = useAuth();
  const { getSignatureTechniques } = useSignatureTechniques();
  const [signatureTechniques, setSignatureTechniques] = useState<string[]>([]);
  const [showEditTechniques, setShowEditTechniques] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSignatureTechniques = async () => {
      setLoading(true);
      const { techniques } = await getSignatureTechniques();
      setSignatureTechniques(techniques);
      setLoading(false);
    };

    loadSignatureTechniques();
  }, [getSignatureTechniques]);

  const handleTechniquesUpdate = (newTechniques: string[]) => {
    setSignatureTechniques(newTechniques);
  };
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header */}
      <div className="flex items-center mb-6">
        <Link to="/">
          <Button variant="ghost" size="sm" className="mr-2">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Profile</h1>
      </div>

      {/* User Info */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className="bg-trophy-gold text-white text-lg font-bold">
                {mockUser.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{mockUser.name}</h2>
              <p className="text-sm text-muted-foreground">{mockUser.title}</p>
              <div className="flex items-center mt-1">
                <MapPin className="w-4 h-4 mr-1 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{mockUser.location}</span>
              </div>
            </div>
            <Badge variant="secondary" className="bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20">
              {mockUser.badges} Badges
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Career Stats */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-trophy-gold" />
            Career Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-trophy-gold">{mockCareerStats.tournaments}</p>
              <p className="text-xs text-muted-foreground">Tournaments</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-fishing-green">{mockCareerStats.wins}</p>
              <p className="text-xs text-muted-foreground">Wins</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-water-blue">{mockCareerStats.top10}</p>
              <p className="text-xs text-muted-foreground">Top 10s</p>
            </div>
            <div className="text-center p-3 bg-accent rounded-lg">
              <p className="text-2xl font-bold text-orange-500">{mockCareerStats.personalBest}</p>
              <p className="text-xs text-muted-foreground">Personal Best</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal Best */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Fish className="w-5 h-5 mr-2 text-water-blue" />
            Personal Best
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-to-r from-trophy-gold/5 to-fishing-green/5 p-4 rounded-lg border border-trophy-gold/20">
            <div className="flex items-center justify-between mb-2">
              <span className="text-3xl font-bold text-trophy-gold">{mockUser.personalBest.weight} lbs</span>
              <Badge variant="secondary" className="bg-trophy-gold/10 text-trophy-gold">
                <Award className="w-3 h-3 mr-1" />
                Record
              </Badge>
            </div>
            <p className="text-sm font-medium">{mockUser.personalBest.location}</p>
            <p className="text-xs text-muted-foreground">{mockUser.personalBest.date} • {mockUser.personalBest.lure}</p>
            {mockUser.personalBest.technique && (
              <p className="text-xs text-muted-foreground mt-1">Technique: {mockUser.personalBest.technique}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Signature Techniques */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Target className="w-5 h-5 mr-2 text-primary" />
              Signature Techniques
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowEditTechniques(true)}
              className="flex items-center gap-2"
            >
              <Edit3 className="w-3 h-3" />
              Edit
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-4">
              <LoadingSpinner message="Loading techniques..." />
            </div>
          ) : signatureTechniques.length > 0 ? (
            <div className="space-y-3">
              {signatureTechniques.map((technique, index) => (
                <div key={technique} className="flex items-center gap-3 p-3 bg-accent rounded-lg">
                  <Badge variant="secondary" className="text-xs font-bold">
                    #{index + 1}
                  </Badge>
                  <span className="font-medium">{technique}</span>
                  {index === 0 && (
                    <Badge className="ml-auto bg-primary/10 text-primary text-xs">
                      Primary
                    </Badge>
                  )}
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-2">
                Techniques listed by preference. #1 is your strongest technique.
              </p>
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <Target className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm font-medium">No signature techniques set</p>
              <p className="text-xs">Click "Edit" to add your signature techniques</p>
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
        currentTechniques={signatureTechniques}
        onUpdate={handleTechniquesUpdate}
      />
    </div>
  );
};

export default Profile;