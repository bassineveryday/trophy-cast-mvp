import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Heart, MessageCircle, Share, ArrowLeft, Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { enhancedClubFeed } from "@/data/enhancedMockData";
import { DemoFeatureBanner } from "@/components/demo/DemoFeatureBanner";

const ClubFeed = () => {

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-water-blue-dark/80 to-fishing-green-dark/80 text-white p-4">
        <div className="flex items-center mb-2">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 mr-2">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        <h1 className="text-xl font-bold">Club Feed</h1>
        <p className="text-sm opacity-90">Latest highlights from your clubs</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Demo Voice Logging Banner */}
        <DemoFeatureBanner variant="voice-logging" />

        {/* Enhanced Club Feed */}
        {enhancedClubFeed.map((post) => (
          <Card key={post.id} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3 mb-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={post.photo} />
                  <AvatarFallback className="bg-primary text-primary-foreground font-bold text-sm">
                    {post.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold text-sm">{post.angler}</h3>
                    <Badge className="bg-trophy-gold/10 text-trophy-gold text-xs">
                      +{post.clubPoints} pts
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{post.timeAgo}</p>
                </div>
              </div>

              {/* Tournament Result */}
              <div className="bg-gradient-to-r from-trophy-gold/5 to-fishing-green/5 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      🏆 {post.placement} - {post.tournament}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Total: {post.weight}</span>
                      <span>Big Bass: {post.bigBass}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-trophy-gold">{post.weight}</div>
                  </div>
                </div>

                {/* Photo placeholder */}
                <div className="bg-accent rounded p-3 mb-2 flex items-center justify-center text-muted-foreground">
                  <Camera className="w-6 h-6 mr-2" />
                  <span className="text-sm">Tournament Photo</span>
                </div>

                {/* Caption */}
                <p className="text-sm text-muted-foreground">{post.caption}</p>
              </div>

              {/* Post Actions */}
              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-red-500">
                    <Heart className="w-4 h-4 mr-1" />
                    <span className="text-xs">{post.likes}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-blue-500">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    <span className="text-xs">{post.comments}</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-fishing-green">
                    <Share className="w-4 h-4 mr-1" />
                    <span className="text-xs">{post.shares}</span>
                  </Button>
                </div>
                <Badge variant="outline" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  View Spot
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Load More */}
        <div className="text-center pt-4">
          <Button variant="outline" className="w-full">
            Load More Posts
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ClubFeed;