import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  Store, 
  Gift,
  ExternalLink,
  Star,
  MapPin,
  Calendar,
  Trophy,
  Target
} from "lucide-react";
import { Link } from "react-router-dom";
import { mockSponsorDeals } from "@/data/enhancedMockData";
import { InvestorAnalytics } from "@/components/demo/InvestorAnalytics";
import { DemoFeatureBanner } from "@/components/demo/DemoFeatureBanner";
import { useState } from "react";

const SponsorDeals = () => {
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-trophy text-trophy-gold-dark p-4">
        <div className="flex items-center mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-trophy-gold-dark hover:bg-white/10 p-2">
              <ChevronLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold ml-2 flex items-center">
            <Gift className="w-6 h-6 mr-2" />
            Sponsor Deals
          </h1>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold">Exclusive Offers</h2>
          <p className="text-sm opacity-90">Deals from our tournament partners</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Demo Feature Banner */}
        <DemoFeatureBanner variant="premium" />

        {/* Analytics Toggle */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">Active Sponsor Deals</h2>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowAnalytics(!showAnalytics)}
          >
            {showAnalytics ? "View Deals" : "View Analytics"}
          </Button>
        </div>

        {/* Show Analytics or Deals based on toggle */}
        {showAnalytics ? (
          <InvestorAnalytics />
        ) : (
          <>
            {/* Enhanced Sponsor Deals */}
            {mockSponsorDeals.map((deal) => (
              <Card key={deal.id} className="border-fishing-green/20 shadow-card-custom">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="bg-fishing-green/10 p-2 rounded-full">
                        <Store className="w-5 h-5 text-fishing-green" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{deal.sponsorName}</CardTitle>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <MapPin className="w-3 h-3 mr-1" />
                          {deal.location}
                        </div>
                      </div>
                    </div>
                    <Badge className="bg-fishing-green/10 text-fishing-green border-fishing-green/20">
                      {deal.sponsorType}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-fishing-green/5 p-4 rounded-lg border border-fishing-green/20">
                    <h3 className="font-bold text-fishing-green text-xl mb-2">{deal.deal.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {deal.deal.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-1" />
                        Valid until {deal.deal.validUntil}
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-trophy-gold fill-current" />
                        <span className="text-sm font-medium ml-1">{deal.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Engagement Metrics (Demo) */}
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-2 bg-accent rounded">
                      <div className="font-semibold">{deal.engagement.views}</div>
                      <div className="text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center p-2 bg-accent rounded">
                      <div className="font-semibold">{deal.engagement.clicks}</div>
                      <div className="text-muted-foreground">Clicks</div>
                    </div>
                    <div className="text-center p-2 bg-accent rounded">
                      <div className="font-semibold text-success">{deal.engagement.revenue}</div>
                      <div className="text-muted-foreground">Revenue</div>
                    </div>
                  </div>
                  
                  <Button className="w-full bg-fishing-green hover:bg-fishing-green-dark">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Visit Store
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Coming Soon Card */}
            <Card className="border-dashed border-2 border-muted">
              <CardContent className="p-6 text-center">
                <div className="bg-muted/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Gift className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mb-2">More Deals Coming Soon</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We're partnering with more local shops and national brands to bring you exclusive tournament discounts.
                </p>
                <Button variant="outline" className="w-full">
                  Get Notified
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default SponsorDeals;