import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Clock, Thermometer, Wind, Fish, Target, Camera, Trophy, Waves, TrendingUp, Anchor } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const CatchDetail = () => {
  const { tournamentId, catchId } = useParams();
  const { toast } = useToast();
  
  // Mock catch data - in real app this would come from API
  const catchData = {
    pin1: {
      weight: '5.7 lbs',
      lure: 'White/Chartreuse Spinnerbait',
      depth: '8–10 ft',
      weather: 'Cloudy, 10 mph wind',
      time: '7:42 AM',
      notes: 'Caught on grass edge, windy side.',
      gps: { lat: '34.435', lon: '-86.310' },
      location: 'Grass Edge (North Bank)',
      color: 'trophy-gold',
      badge: {
        name: 'First Keeper',
        icon: Anchor,
        color: 'bg-amber-600 text-white', // Bronze
        description: 'Your first keeper of the tournament'
      }
    },
    pin2: {
      weight: '4.3 lbs',
      lure: '3/8 oz Football Jig, Green Pumpkin',
      depth: '12–15 ft',
      weather: 'Sunny, light chop',
      time: '10:18 AM',
      notes: 'Transition from shallow flat to deep ledge.',
      gps: { lat: '34.440', lon: '-86.315' },
      location: 'Rocky Point (West Side)',
      color: 'fishing-green',
      badge: {
        name: 'Deep Water Bite',
        icon: Waves,
        color: 'bg-water-blue text-white',
        description: 'Mastered deep water fishing'
      }
    },
    pin3: {
      weight: '3.9 lbs',
      lure: 'Texas Rig Worm, Black/Blue',
      depth: '5–7 ft',
      weather: 'Overcast, light rain',
      time: '12:05 PM',
      notes: 'Pitched into brush, slow bite.',
      gps: { lat: '34.428', lon: '-86.320' },
      location: 'Creek Mouth (South End)',
      color: 'water-blue',
      badge: {
        name: 'Pattern Change',
        icon: TrendingUp,
        color: 'bg-fishing-green text-white',
        description: 'Adapted tactics to changing conditions'
      }
    },
    pin4: {
      weight: '6.2 lbs',
      lure: 'Deep Diving Crankbait, Shad Color',
      depth: '15–18 ft',
      weather: 'Partly Cloudy, 8 mph wind',
      time: '1:27 PM',
      notes: 'Big bass on offshore structure.',
      gps: { lat: '34.438', lon: '-86.305' },
      location: 'Main Lake Ledge (East Side)',
      color: 'destructive',
      bigBass: true,
      badge: {
        name: 'Big Bass – Tournament Leader',
        icon: Trophy,
        color: 'bg-trophy-gold text-white',
        description: 'Caught the biggest bass of the tournament'
      }
    }
  };

  const catch_ = catchData[catchId as keyof typeof catchData];
  
  if (!catch_) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="text-center">
          <h1 className="text-xl font-bold mb-4">Catch Not Found</h1>
          <Link to={`/tournament/${tournamentId}`}>
            <Button>Back to Tournament</Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleSaveCatch = () => {
    toast({
      title: "Saved to My Catches",
      description: "This catch has been added to your profile.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark/80 to-fishing-green-dark/80 text-white p-4">
        <div className="flex items-center mb-2">
          <Link to={`/tournament/${tournamentId}`}>
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Tournament
            </Button>
          </Link>
        </div>
        <h1 className="text-xl font-bold flex items-center">
          <Fish className="w-5 h-5 mr-2" />
          {catch_.location}
          {'bigBass' in catch_ && catch_.bigBass && <Badge className="ml-2 bg-trophy-gold text-white">Big Bass!</Badge>}
        </h1>
        <p className="text-sm opacity-90">{catch_.time} • {catch_.weight}</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Catch Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-fishing-green" />
                Catch Details
              </div>
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${catch_.badge.color}`}>
                <catch_.badge.icon className="w-4 h-4" />
                <span className="text-sm font-bold">{catch_.badge.name}</span>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Weight</p>
                <p className="font-bold text-lg text-primary">{catch_.weight}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Time</p>
                <p className="font-medium flex items-center">
                  <Clock className="w-4 h-4 mr-1 text-muted-foreground" />
                  {catch_.time}
                </p>
              </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Lure Used</p>
              <p className="font-medium">{catch_.lure}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Depth</p>
                <p className="font-medium">{catch_.depth}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Weather</p>
                <p className="font-medium flex items-center">
                  <Wind className="w-4 h-4 mr-1 text-muted-foreground" />
                  {catch_.weather}
                </p>
              </div>
            </div>
            
            <div className="space-y-1 pt-2 border-t">
              <p className="text-sm text-muted-foreground">Notes</p>
              <p className="text-sm italic">{catch_.notes}</p>
            </div>
          </CardContent>
        </Card>

        {/* Photo Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Camera className="w-5 h-5 mr-2 text-water-blue" />
              Photos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-water-blue/10 to-fishing-green/10 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-muted">
                <div className="text-center">
                  <Fish className="w-8 h-8 mx-auto mb-1 text-water-blue" />
                  <p className="text-xs text-muted-foreground">Fish Photo</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-trophy-gold/10 to-fishing-green/10 rounded-lg h-32 flex items-center justify-center border-2 border-dashed border-muted">
                <div className="text-center">
                  <Thermometer className="w-8 h-8 mx-auto mb-1 text-trophy-gold" />
                  <p className="text-xs text-muted-foreground">Weigh-in Card</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* GPS Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-water-blue" />
              GPS Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Latitude</p>
                  <p className="font-mono text-sm">{catch_.gps.lat}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Longitude</p>
                  <p className="font-mono text-sm">{catch_.gps.lon}</p>
                </div>
              </div>
              
              {/* Mini Map */}
              <div className="bg-gradient-to-br from-water-blue/10 to-fishing-green/10 rounded-lg h-24 flex items-center justify-center border border-muted relative">
                <div className="absolute inset-0 bg-gradient-to-br from-water-blue/20 to-fishing-green/20 rounded-lg" />
                <div className={`bg-${catch_.color} text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg relative z-10`}>
                  📍
                </div>
              </div>
              <p className="text-xs text-muted-foreground text-center">Catch location on lake map</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={handleSaveCatch}
                className="w-full"
              >
                Save to My Catches
              </Button>
              <Link to="/ai-coach">
                <Button variant="outline" className="w-full">
                  Open in AI Coach
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CatchDetail;