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
// Mock empty sponsor deals for demo cleanup
const mockSponsorDeals: any[] = [];
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
        {/* Empty state for sponsor deals */}
        <div className="text-center p-8 text-muted-foreground">
          <div className="bg-muted/50 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <Gift className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="font-semibold mb-2">No sponsor deals yet</h3>
          <p className="text-sm text-muted-foreground">
            Check back soon for exclusive tournament discounts.
          </p>
        </div>
      </div>
    </div>
  );
};

export default SponsorDeals;