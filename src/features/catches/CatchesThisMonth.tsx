import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import UniversalAvatar from "@/components/UniversalAvatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Fish, Trophy, Calendar, MapPin, Clock, Target, Ruler, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

// Data
import { monthlyMockCatches } from "@/data/enhancedMockData";

const CatchesThisMonth = () => {
  const [activeTab, setActiveTab] = useState("all");

  // Separate catches by tournament vs non-tournament
  const tournamentCatches = monthlyMockCatches.filter(catch_ => catch_.isTournament);
  const recreationalCatches = monthlyMockCatches.filter(catch_ => !catch_.isTournament);

  const getCatchesToShow = () => {
    switch (activeTab) {
      case "tournament":
        return tournamentCatches;
      case "recreational":
        return recreationalCatches;
      default:
        return monthlyMockCatches;
    }
  };

  const catches = getCatchesToShow();
  const totalWeight = catches.reduce((sum, catch_) => sum + catch_.weight, 0);
  const averageWeight = totalWeight / catches.length;
  const biggestCatch = catches.reduce((max, catch_) => catch_.weight > max.weight ? catch_ : max, catches[0]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-hero text-white px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-white hover:bg-white/20">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center">
            <Fish className="w-8 h-8 mr-3" />
            September 2024 Catches
          </h1>
          <p className="text-lg opacity-90">
            {monthlyMockCatches.length} fish caught • {totalWeight.toFixed(1)} lbs total
          </p>
        </motion.div>
      </div>

      {/* Summary Stats */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">{catches.length}</div>
              <div className="text-sm text-muted-foreground">Total Fish</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-fishing-green">{averageWeight.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Weight</div>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-trophy-gold">{biggestCatch?.weight || 0}</div>
              <div className="text-sm text-muted-foreground">Biggest</div>
            </CardContent>
          </Card>
        </div>

        {/* Catch Filters */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all" className="flex items-center space-x-2">
              <Fish className="w-4 h-4" />
              <span>All ({monthlyMockCatches.length})</span>
            </TabsTrigger>
            <TabsTrigger value="tournament" className="flex items-center space-x-2">
              <Trophy className="w-4 h-4" />
              <span>Tournament ({tournamentCatches.length})</span>
            </TabsTrigger>
            <TabsTrigger value="recreational" className="flex items-center space-x-2">
              <Target className="w-4 h-4" />
              <span>Fun Fishing ({recreationalCatches.length})</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <CatchList catches={monthlyMockCatches} />
          </TabsContent>
          
          <TabsContent value="tournament" className="mt-4">
            <CatchList catches={tournamentCatches} />
          </TabsContent>
          
          <TabsContent value="recreational" className="mt-4">
            <CatchList catches={recreationalCatches} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Catch List Component
interface CatchListProps {
  catches: typeof monthlyMockCatches;
}

const CatchList = ({ catches }: CatchListProps) => {
  return (
    <div className="space-y-4">
      {catches.map((catch_, index) => (
        <motion.div
          key={catch_.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className={`hover:shadow-md transition-shadow ${catch_.isTournament ? 'border-trophy-gold/30 bg-trophy-gold/5' : 'border-fishing-green/30 bg-fishing-green/5'}`}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="text-2xl font-bold text-primary">{catch_.weight} lbs</div>
                    <Badge className={`${catch_.badge.color} text-white`}>
                      {catch_.badge.name}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-2">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      {catch_.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {catch_.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {catch_.lake}
                    </div>
                    <div className="flex items-center">
                      <Ruler className="w-4 h-4 mr-1" />
                      {catch_.length}"
                    </div>
                  </div>

                  {catch_.tournament && (
                    <Badge variant="outline" className="text-trophy-gold border-trophy-gold/30 mb-2">
                      <Trophy className="w-3 h-3 mr-1" />
                      {catch_.tournament}
                    </Badge>
                  )}
                  
                  <div className="text-sm">
                    <div className="font-medium text-foreground mb-1">{catch_.lure}</div>
                    <div className="text-muted-foreground">{catch_.technique}</div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <img 
                    src={catch_.photo} 
                    alt="Catch photo" 
                    className="w-16 h-16 rounded-lg object-cover bg-muted"
                  />
                  
                  {/* Message button for angler */}
                  {catch_.anglerId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="w-8 h-8 text-muted-foreground hover:text-primary"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/messages/new?to=${catch_.anglerId}&lake=${encodeURIComponent(catch_.lake)}`;
                      }}
                      aria-label={`Message angler about ${catch_.lake} catch`}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
              
              {catch_.notes && (
                <div className="mt-3 p-3 bg-muted rounded-md">
                  <p className="text-sm text-muted-foreground italic">"{catch_.notes}"</p>
                </div>
              )}
              
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span>{catch_.structure} • {catch_.depth}</span>
                  {/* Angler info for catches */}
                  {catch_.anglerId && (
                    <>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <UniversalAvatar
                          size="row"
                          name={catch_.anglerName || 'Angler'}
                          anglerId={catch_.anglerId}
                          role="Angler"
                          club={{
                            id: "unknown",
                            abbreviation: "UNK"
                          }}
                          clickable={true}
                        />
                      </div>
                    </>
                  )}
                </div>
                <span>Water: {catch_.waterTemp}°F</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
      
      {catches.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <Fish className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No catches in this category yet.</p>
        </div>
      )}
    </div>
  );
};

export default CatchesThisMonth;