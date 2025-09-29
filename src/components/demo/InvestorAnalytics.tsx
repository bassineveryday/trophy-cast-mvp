// ============================================
// INVESTOR ANALYTICS DASHBOARD COMPONENT
// ============================================
// Shows sample sponsor engagement and app usage metrics for investor presentations

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Eye,
  MousePointer,
  ShoppingCart,
  Calendar,
  Trophy
} from "lucide-react";

export const InvestorAnalytics = () => {
  // Sample metrics for investor presentation
  const appMetrics = {
    monthlyActiveUsers: 2847,
    tournamentEntries: 156,
    avgSessionTime: "12.3 min",
    retentionRate: 78,
    growthRate: 32
  };

  const sponsorMetrics = {
    totalRevenue: 8940,
    dealConversions: 234,
    avgDealValue: 38.20,
    partnerCount: 12,
    engagement: {
      impressions: 45600,
      clicks: 3420,
      conversionRate: 6.8
    }
  };

  return (
    <div className="space-y-6">
      {/* App Performance Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-success" />
            App Performance (Last 30 Days)
            <Badge className="ml-2 bg-success/10 text-success border-success/20">
              +32% Growth
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Monthly Active Users</span>
                <span className="text-lg font-bold text-water-blue">
                  {appMetrics.monthlyActiveUsers.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Tournament Entries</span>
                <span className="text-lg font-bold text-fishing-green">
                  {appMetrics.tournamentEntries}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Avg Session Time</span>
                <span className="text-lg font-bold text-trophy-gold">
                  {appMetrics.avgSessionTime}
                </span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>User Retention</span>
                  <span className="font-semibold">{appMetrics.retentionRate}%</span>
                </div>
                <Progress value={appMetrics.retentionRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Growth Rate (MoM)</span>
                  <span className="font-semibold text-success">+{appMetrics.growthRate}%</span>
                </div>
                <Progress value={appMetrics.growthRate} className="h-2" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sponsor Revenue Analytics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-trophy-gold" />
            Sponsor Revenue Analytics
            <Badge className="ml-2 bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20">
              Q3 2024
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-3 bg-accent rounded-lg">
              <DollarSign className="w-6 h-6 mx-auto text-trophy-gold mb-1" />
              <div className="text-2xl font-bold text-trophy-gold">
                ${sponsorMetrics.totalRevenue.toLocaleString()}
              </div>
              <div className="text-xs text-muted-foreground">Total Revenue</div>
            </div>
            
            <div className="text-center p-3 bg-accent rounded-lg">
              <ShoppingCart className="w-6 h-6 mx-auto text-fishing-green mb-1" />
              <div className="text-2xl font-bold text-fishing-green">
                {sponsorMetrics.dealConversions}
              </div>
              <div className="text-xs text-muted-foreground">Deal Conversions</div>
            </div>
            
            <div className="text-center p-3 bg-accent rounded-lg">
              <Trophy className="w-6 h-6 mx-auto text-water-blue mb-1" />
              <div className="text-2xl font-bold text-water-blue">
                ${sponsorMetrics.avgDealValue}
              </div>
              <div className="text-xs text-muted-foreground">Avg Deal Value</div>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-sm">Engagement Funnel</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Eye className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Impressions</span>
                </div>
                <span className="font-semibold">
                  {sponsorMetrics.engagement.impressions.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <MousePointer className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Clicks</span>
                </div>
                <span className="font-semibold">
                  {sponsorMetrics.engagement.clicks.toLocaleString()}
                </span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <ShoppingCart className="w-4 h-4 mr-2 text-muted-foreground" />
                  <span>Conversions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{sponsorMetrics.dealConversions}</span>
                  <Badge variant="outline" className="text-xs">
                    {sponsorMetrics.engagement.conversionRate}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Partner Directory */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-water-blue" />
            Active Sponsor Partners
            <Badge className="ml-2" variant="outline">
              {sponsorMetrics.partnerCount} Partners
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Bass Pro Shops", tier: "National", engagement: 94 },
              { name: "Guntersville Bait & Tackle", tier: "Local", engagement: 87 },
              { name: "XYZ Lures", tier: "Regional", engagement: 91 },
              { name: "Alabama Outdoors", tier: "Regional", engagement: 83 }
            ].map((partner, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-accent rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {partner.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{partner.name}</div>
                    <div className="text-xs text-muted-foreground">{partner.tier} Partner</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-semibold text-success">{partner.engagement}%</div>
                  <div className="text-xs text-muted-foreground">Engagement</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Investment Opportunity Note */}
      <Card className="border-trophy-gold/20 bg-gradient-to-r from-trophy-gold/5 to-fishing-green/5">
        <CardContent className="p-4">
          <div className="text-center space-y-2">
            <Trophy className="w-8 h-8 mx-auto text-trophy-gold" />
            <h3 className="font-bold text-trophy-gold">Investment Opportunity</h3>
            <p className="text-sm text-muted-foreground">
              Current metrics show strong product-market fit with growing sponsor interest. 
              Ready for Series A funding to scale nationally and enhance AI capabilities.
            </p>
            <Badge className="bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20">
              Revenue Growing 32% MoM
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};