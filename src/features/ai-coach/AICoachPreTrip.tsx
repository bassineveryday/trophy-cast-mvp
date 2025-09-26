import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronLeft, Brain, MessageCircle, Mic, Save, Fish, RotateCcw, Clock, Wind, CheckSquare, Target, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { BestWindowSlider } from "@/components/BestWindowSlider";
import { DialInChecks } from "@/components/DialInChecks";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIShimmerToast } from "@/components/AIShimmerToast";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";

const AICoachPreTripContent = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);

  // State for AI shimmer toast
  const [showAIToast, setShowAIToast] = useState(false);
  const [lakeName] = useState("Lake Pueblo");
  
  // Pattern selection state
  const [selectedPrimaryPattern, setSelectedPrimaryPattern] = useState(0);
  const [selectedBackupPattern, setSelectedBackupPattern] = useState(0);
  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);

  // Pattern options
  const primaryPatterns = [
    {
      name: "Spinnerbait on Grass Edges",
      lure: "Slow-rolled spinnerbait, double willow (3/8–1/2 oz)",
      colors: "Natural shad (clear) or white/chartreuse (stained)",
      why: "Pre-spawn bass stage on grass edges; wind pushes baitfish in, triggering reaction strikes.",
      gear: "Use your Grass Killer combo (Megabass Poison Adrena + Shimano Curado, 15 lb fluoro)",
      actions: ["Run 3 grass edges with spinnerbait — 10 casts each", "Focus on windy banks first"]
    },
    {
      name: "Chatterbait Over Submerged Grass",
      lure: "1/2 oz chatterbait with paddle tail trailer",
      colors: "White/chartreuse or green pumpkin",
      why: "Vibration cuts through grass while mimicking fleeing baitfish.",
      gear: "Use your Power Finesse setup (7'2\" MH rod + Tatula 150, 17 lb fluoro)",
      actions: ["Work 4-5 grass flats systematically", "Vary retrieve speed every 10 casts"]
    },
    {
      name: "Lipless Crankbait Around Flats",
      lure: "1/2 oz lipless crank, tight wobble",
      colors: "Chrome/blue or red craw",
      why: "Covers water fast, triggers reaction strikes from aggressive pre-spawn bass.",
      gear: "Use your Cranking Special (7' MH glass rod + Curado 200K, 15 lb fluoro)",
      actions: ["Fan cast main lake points", "Rip through grass tops aggressively"]
    }
  ];

  const backupPatterns = [
    {
      name: "Texas-rigged Creature Bait",
      lure: "Beaver-style creature bait, Texas-rigged",
      setup: "Pegged 3/8 oz tungsten, 15–20 lb fluoro",
      why: "Picks off inactive fish holding tighter to cover.",
      gear: "Use your Flipping Stick (7'6\" H rod + Curado 150HG, 20 lb fluoro)",
      actions: ["Flip thicker grass or isolated clumps", "Work each target methodically"]
    },
    {
      name: "Football Jig",
      lure: "3/8 oz football jig with craw trailer",
      setup: "Semi-slack line, feel for bottom contact",
      why: "Mimics crawfish on rocky areas adjacent to grass.",
      gear: "Use your Jig Rod (7'3\" MH rod + Tatula 100, 17 lb fluoro)",
      actions: ["Drag along rock-to-grass transitions", "Work isolated boulders near grass"]
    },
    {
      name: "Finesse Wacky Rig",
      lure: "5\" finesse worm, wacky rigged",
      setup: "1/16 oz nail weight, 10 lb fluoro leader",
      why: "Subtle presentation for pressured or inactive fish.",
      gear: "Use your Finesse Rod (6'10\" ML spinning, 10 lb braid to fluoro)",
      actions: ["Target visible cover in clear water", "Dead stick for 10+ seconds per cast"]
    }
  ];

  const getCurrentActions = () => {
    const primary = primaryPatterns[selectedPrimaryPattern];
    const backup = backupPatterns[selectedBackupPattern];
    return [
      ...primary.actions,
      "If no bites, switch to backup plan",
      ...backup.actions.map(action => `Backup: ${action}`),
      "Mark bites/follows with GPS pins",
      "Re-check wind direction at noon"
    ];
  };

  // Environmental data (demo)
  const environmentalData = {
    moonPhase: { text: "Waning Gibbous (78%)", icon: "🌖" },
    barometricPressure: { text: "Falling (29.85 → 29.72 inHg)", icon: "⬇️" },
    weatherPattern: { text: "Warming Trend after Cold Front", icon: "☀️" },
    analysis: "Barometer falling into a warming trend. Expect shallow bite to fire during late morning window."
  };

  const handleSavePlan = () => {
    // Show AI shimmer toast for auto-save
    setShowAIToast(true);
  };

  const handleMicClick = () => {
    setIsListening(true);
    setTimeout(() => {
      setIsListening(false);
      // Simulate voice input
      handleSavePlan();
    }, 1500);
  };

  useEffect(() => {
    // Auto-save simulation
    const timeout = setTimeout(() => {
      handleSavePlan();
    }, 2000);
    
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="space-y-3">
      {/* Practice Reminder */}
      <div className="text-center">
        <p className="text-sm italic text-muted-foreground">
          Last time at Pueblo (October practice), you caught fish on spinnerbait along west banks. This plan builds on that history.
        </p>
      </div>

      {/* Coach Analysis Bubble */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">AI Coach</p>
              <p className="text-sm mb-3">
                Looking at your October history in Colorado and current forecasts at Pueblo:
              </p>
              <div className="bg-background p-3 rounded-lg text-xs space-y-1">
                <p>• Predicted water temp: 62–65°F</p>
                <p>• Wind: W 8–12 mph</p>
                <p>• Lake level: ~3 ft below full pool</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Structured Tournament Plan */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-fishing-green flex items-center">
          <Save className="w-5 h-5 mr-2" />
          Tournament Plan
        </h2>

        {/* Primary Pattern */}
        <Collapsible open={isPrimaryOpen} onOpenChange={setIsPrimaryOpen}>
          <Card className="border-fishing-green/20">
            <CollapsibleTrigger asChild>
              <CardContent className="p-3 cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🎯</span>
                    <h3 className="font-medium text-fishing-green">Primary Pattern</h3>
                  </div>
                  {isPrimaryOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{primaryPatterns[selectedPrimaryPattern].name}</p>
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 px-3 pb-3">
                {/* Pattern Selection */}
                <div className="flex gap-1 mb-3 overflow-x-auto">
                  {primaryPatterns.map((pattern, index) => (
                    <Button
                      key={index}
                      variant={selectedPrimaryPattern === index ? "default" : "outline"}
                      size="sm"
                      className="text-xs whitespace-nowrap"
                      onClick={() => setSelectedPrimaryPattern(index)}
                    >
                      {pattern.name.split(' ')[0]}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="bg-fishing-green/10 p-2 rounded-lg">
                    <p className="text-xs font-medium text-fishing-green mb-1">Lure/Presentation</p>
                    <p className="text-xs">{primaryPatterns[selectedPrimaryPattern].lure}</p>
                  </div>
                  
                  <div className="bg-background p-2 rounded-lg border">
                    <p className="text-xs font-medium mb-1">Colors</p>
                    <p className="text-xs text-muted-foreground">{primaryPatterns[selectedPrimaryPattern].colors}</p>
                  </div>
                  
                  <div className="bg-fishing-green/5 p-2 rounded-lg border-l-2 border-fishing-green">
                    <p className="text-xs font-medium mb-1">Why it Works</p>
                    <p className="text-xs text-muted-foreground">{primaryPatterns[selectedPrimaryPattern].why}</p>
                  </div>

                  <div className="bg-muted/50 p-2 rounded-lg">
                    <p className="text-xs font-medium mb-1">Recommended Gear</p>
                    <p className="text-xs italic text-muted-foreground">{primaryPatterns[selectedPrimaryPattern].gear}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Backup Plan */}
        <Collapsible open={isBackupOpen} onOpenChange={setIsBackupOpen}>
          <Card className="border-amber-500/20">
            <CollapsibleTrigger asChild>
              <CardContent className="p-3 cursor-pointer hover:bg-muted/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xl">🟡</span>
                    <h3 className="font-medium text-amber-600">Backup Plan</h3>
                  </div>
                  {isBackupOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{backupPatterns[selectedBackupPattern].name}</p>
              </CardContent>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <CardContent className="pt-0 px-3 pb-3">
                {/* Pattern Selection */}
                <div className="flex gap-1 mb-3 overflow-x-auto">
                  {backupPatterns.map((pattern, index) => (
                    <Button
                      key={index}
                      variant={selectedBackupPattern === index ? "default" : "outline"}
                      size="sm"
                      className="text-xs whitespace-nowrap"
                      onClick={() => setSelectedBackupPattern(index)}
                    >
                      {pattern.name.split(' ')[0]}
                    </Button>
                  ))}
                </div>
                
                <div className="space-y-2">
                  <div className="bg-amber-50 p-2 rounded-lg">
                    <p className="text-xs font-medium text-amber-700 mb-1">Lure/Presentation</p>
                    <p className="text-xs">{backupPatterns[selectedBackupPattern].lure}</p>
                  </div>
                  
                  <div className="bg-background p-2 rounded-lg border">
                    <p className="text-xs font-medium mb-1">Setup</p>
                    <p className="text-xs text-muted-foreground">{backupPatterns[selectedBackupPattern].setup}</p>
                  </div>
                  
                  <div className="bg-amber-50/50 p-2 rounded-lg border-l-2 border-amber-500">
                    <p className="text-xs font-medium mb-1">Why it Works</p>
                    <p className="text-xs text-muted-foreground">{backupPatterns[selectedBackupPattern].why}</p>
                  </div>

                  <div className="bg-muted/50 p-2 rounded-lg">
                    <p className="text-xs font-medium mb-1">Recommended Gear</p>
                    <p className="text-xs italic text-muted-foreground">{backupPatterns[selectedBackupPattern].gear}</p>
                  </div>
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Environmental Factors */}
        <Card className="border-emerald-500/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">🌍</span>
              <h3 className="font-medium text-emerald-600">Environmental Factors</h3>
            </div>
            
            <div className="space-y-2">
              <div className="bg-emerald-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-emerald-700 mb-1">Moon Phase</p>
                <p className="text-xs flex items-center gap-2">
                  {environmentalData.moonPhase.text}
                  <span className="text-base">{environmentalData.moonPhase.icon}</span>
                </p>
              </div>
              
              <div className="bg-emerald-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-emerald-700 mb-1">Barometric Pressure</p>
                <p className="text-xs flex items-center gap-2">
                  {environmentalData.barometricPressure.text}
                  <span className="text-base">{environmentalData.barometricPressure.icon}</span>
                </p>
              </div>
              
              <div className="bg-emerald-50 p-2 rounded-lg">
                <p className="text-xs font-medium text-emerald-700 mb-1">Weather Pattern</p>
                <p className="text-xs flex items-center gap-2">
                  {environmentalData.weatherPattern.text}
                  <span className="text-base">{environmentalData.weatherPattern.icon}</span>
                </p>
              </div>
              
              <div className="bg-emerald-100 p-2 rounded-lg border-l-2 border-emerald-500">
                <p className="text-xs font-medium text-emerald-800 mb-1">Analysis</p>
                <p className="text-xs italic text-emerald-700">{environmentalData.analysis}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Best Window */}
        <Card className="border-amber-500/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">⏰</span>
              <h3 className="font-medium text-amber-600">Best Window</h3>
            </div>
            
            <div className="space-y-3">
              <BestWindowSlider />
              
              <div className="space-y-1 text-xs">
                <div className="bg-amber-50 p-2 rounded-lg">
                  <p><strong>Morning (6–9 AM):</strong> Spinnerbait bite peaks with low light + wind</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg">
                  <p><strong>Midday (10–1 PM):</strong> Bass slide tighter into grass → flip creature bait</p>
                </div>
                <div className="bg-amber-50 p-2 rounded-lg">
                  <p><strong>Afternoon (1–3 PM):</strong> Slow jig or chatterbait around edges + points</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dial-In Checks */}
        <Card className="border-blue-500/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">🔧</span>
              <h3 className="font-medium text-blue-600">Dial-In Checks</h3>
            </div>
            
            <DialInChecks />
          </CardContent>
        </Card>

        {/* Action Steps */}
        <Card className="border-fishing-green/20">
          <CardContent className="p-3">
            <div className="flex items-center space-x-2 mb-3">
              <span className="text-xl">📋</span>
              <h3 className="font-medium text-fishing-green">Action Steps</h3>
            </div>
            
            <div className="space-y-2">
              {getCurrentActions().map((action, index) => (
                <div key={index} className="flex items-start space-x-2 text-xs">
                  <CheckSquare className="w-3 h-3 mt-0.5 text-fishing-green flex-shrink-0" />
                  <span>{action}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation Buttons */}
        <div className="flex gap-2 pt-4">
          <Link to="/ai-coach" className="flex-1">
            <Button variant="outline" className="w-full">
              <RotateCcw className="w-4 h-4 mr-2" />
              Adjust Plan
            </Button>
          </Link>
          <Link to="/ai-coach/at-lake" className="flex-1">
            <Button className="w-full bg-fishing-green hover:bg-fishing-green/90">
              <Fish className="w-4 h-4 mr-2" />
              I'm at the Lake
            </Button>
          </Link>
        </div>

        <div className="text-center pt-2">
          <Link to="/ai-coach/tournament-plan" className="text-xs text-muted-foreground hover:text-primary">
            View Full Tournament Plan Report →
          </Link>
        </div>
      </div>

      {/* Listening Overlay */}
      {isListening && (
        <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
          <Card>
            <CardContent className="p-6 text-center">
              <Mic className="w-8 h-8 mx-auto mb-2 text-primary animate-pulse" />
              <p className="text-sm">Listening...</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* AI Shimmer Toast */}
      <AIShimmerToast
        message="Plan auto-saved by AI"
        lakeName={lakeName}
        show={showAIToast}
        onHide={() => setShowAIToast(false)}
      />

      {/* Floating Mic Button */}
      <FloatingMicButton />
    </div>
  );
};

const AICoachPreTrip = () => {
  return <AICoachPreTripContent />;
};

export default AICoachPreTrip;