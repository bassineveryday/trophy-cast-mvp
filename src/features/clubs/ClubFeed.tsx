import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Trophy, Medal, Heart, MessageCircle, Share, ArrowLeft, Camera, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
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
        {/* Empty Club Feed */}
        <Card className="border-2 border-dashed border-muted-foreground/20">
          <CardContent className="p-8 text-center">
            <Trophy className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30" />
            <h3 className="text-lg font-medium mb-2">Club feed is empty</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Tournament results and club highlights will appear here once members start sharing their catches and achievements.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/tournaments">
                <Button variant="outline" className="w-full">
                  <Trophy className="w-4 h-4 mr-2" />
                  View Tournaments
                </Button>
              </Link>
              <Link to="/club-dashboard">
                <Button variant="outline" className="w-full">
                  <Badge className="w-4 h-4 mr-2" />
                  Club Dashboard
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClubFeed;