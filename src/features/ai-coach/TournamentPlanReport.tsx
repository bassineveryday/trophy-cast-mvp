import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { ChevronLeft, Brain, Target, Clock, Wind, CheckSquare, AlertTriangle, ChevronDown, ChevronRight, MapPin, Trophy, Fish, Plus, Edit3, Award } from "lucide-react";
import { BestWindowSlider } from "@/components/BestWindowSlider";
import { DialInChecks } from "@/components/DialInChecks";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { AIShimmerToast } from "@/components/AIShimmerToast";
import { ContextAwareFloatingButton } from "@/components/voice/ContextAwareFloatingButton";

const TournamentPlanReport = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const lakeName = searchParams.get('lake') || 'Pueblo';
  const [showAIToast, setShowAIToast] = useState(false);
  
  // Auto-save effect with AI shimmer toast
  useEffect(() => {
    // Simulate auto-save when component loads or updates
    const autoSaveTimer = setTimeout(() => {
      setShowAIToast(true);
    }, 2000);

    return () => clearTimeout(autoSaveTimer);
  }, [lakeName]);
  
  // Pattern selection state
  const [selectedPrimaryPattern, setSelectedPrimaryPattern] = useState(0);
  const [selectedBackupPattern, setSelectedBackupPattern] = useState(0);
  const [isPrimaryOpen, setIsPrimaryOpen] = useState(false);
  const [isBackupOpen, setIsBackupOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(0);

  // Tournament history data
  const tournamentHistory = [
    {
      date: "March 2025",
      season: "Spring Pre-Spawn 🌱",
      notes: "Shifted to Eagle Cove on west wind, landed 2 keepers on spinnerbait. Later, Willow Cut produced on north wind.",
      pins: [
        { id: 1, lat: 38.2544, lng: -104.6091, lure: "Spinnerbait", weight: "3.2 lbs", gear: "Grass Killer" },
        { id: 2, lat: 38.2567, lng: -104.6134, lure: "Chatterbait", weight: "2.8 lbs", gear: "Power Finesse" }
      ]
    },
    {
      date: "July 2024", 
      season: "Summer Ledges ☀️",
      notes: "Deep structure pattern worked. Football jigs on 15-20ft ledges in main lake.",
      pins: [
        { id: 3, lat: 38.2598, lng: -104.6156, lure: "Football Jig", weight: "4.1 lbs", gear: "Bottom Bouncer" },
        { id: 4, lat: 38.2523, lng: -104.6078, lure: "Deep Crank", weight: "3.7 lbs", gear: "Cranking Special" }
      ]
    },
    {
      date: "October 2024",
      season: "Fall Shad Migration 🍂", 
      notes: "Spinnerbait along west banks during practice. Baitfish pushed shallow by wind.",
      pins: [
        { id: 5, lat: 38.2578, lng: -104.6112, lure: "Spinnerbait", weight: "2.9 lbs", gear: "Grass Killer" }
      ]
    }
  ];

  // Seasonal context
  const getSeasonalContext = () => {
    const currentMonth = new Date().getMonth();
    if (currentMonth >= 2 && currentMonth <= 4) return "Spring Pre-Spawn 🌱 (48–58°F water temps)";
    if (currentMonth >= 5 && currentMonth <= 7) return "Summer Ledges ☀️ (70–80°F water temps)";
    if (currentMonth >= 8 && currentMonth <= 10) return "Fall Shad Migration 🍂 (60–70°F water temps)";
    return "Winter Deep Structure ❄️ (40–50°F water temps)";
  };

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

  // Environmental data with enhanced confidence tracking
  const environmentalData = {
    moonPhase: { 
      phase: "Waning Gibbous", 
      illumination: 78,
      rise: "9:45 PM",
      set: "10:15 AM",
      icon: "🌖" 
    },
    barometricPressure: { 
      current: 29.72,
      trend: "falling",
      readings: [29.85, 29.82, 29.79, 29.76, 29.72],
      timestamps: ["6 AM", "8 AM", "10 AM", "12 PM", "2 PM"]
    },
    weatherPattern: [
      { time: "6-8 AM", condition: "Overcast", temp: 52, icon: "☁️" },
      { time: "8-10 AM", condition: "Light Showers", temp: 54, icon: "🌦️" },
      { time: "10-12 PM", condition: "Partly Cloudy", temp: 58, icon: "⛅" },
      { time: "12-2 PM", condition: "Sunny", temp: 62, icon: "☀️" },
      { time: "2-4 PM", condition: "Partly Cloudy", temp: 65, icon: "⛅" },
      { time: "4-6 PM", condition: "Clear", temp: 61, icon: "🌤️" }
    ],
    confidence: 85,
    confidenceReason: "Last 3 Pueblo events: Avg. Finish Top 5",
    analysis: "Barometer falling into a warming trend. Expect shallow bite to fire during late morning window."
  };

  // Phase 1: Pre-Tournament Checklist
  const [checklist, setChecklist] = useState([
    { id: 1, item: "Rod arsenal (4-5 combos rigged)", checked: false },
    { id: 2, item: "Backup reels spooled with fresh line", checked: false },
    { id: 3, item: "Confidence baits organized in tackle box", checked: false },
    { id: 4, item: "Rain gear & extra clothes packed", checked: false },
    { id: 5, item: "GPS waypoints loaded", checked: false },
    { id: 6, item: "Boat fuel & oil checked", checked: false },
    { id: 7, item: "Tournament registration confirmed", checked: false }
  ]);

  // Phase 1: Live Notes
  const [liveNotes, setLiveNotes] = useState("");
  const [savedNotes, setSavedNotes] = useState([
    { time: "7:15 AM", note: "First keeper on spinnerbait - Eagle Cove grass edge" },
    { time: "9:30 AM", note: "Wind shifted - moving to backup plan" }
  ]);

  // Phase 1: Streaks & Achievements
  const achievements = [
    { title: "Top 10 Streak", value: "4 events", badge: "🔥", active: true },
    { title: "Big Fish Specialist", value: "3 wins", badge: "🐟", active: true },
    { title: "AOY Progress", value: "2nd place", badge: "🏆", active: false },
    { title: "Consistent Finisher", value: "8/10 events", badge: "⭐", active: true }
  ];

  const handleChecklistToggle = (id: number) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, checked: !item.checked } : item
    ));
  };

  const handleSaveNote = () => {
    if (!liveNotes.trim()) return;
    const currentTime = new Date().toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
    setSavedNotes(prev => [...prev, { time: currentTime, note: liveNotes }]);
    setLiveNotes("");
    // Note saved silently - no toast needed
  };

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
        <div className="bg-gradient-water text-white p-4">
          <div className="flex items-center mb-4">
            <Link to="/ai-coach/pre-trip">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10 p-2">
                <ChevronLeft className="w-5 h-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-bold ml-2 flex items-center">
              <Trophy className="w-6 h-6 mr-2" />
              Tournament Plan — {lakeName}
            </h1>
          </div>
          <p className="text-sm opacity-90">
            Based on your history, practice notes, and current conditions
          </p>
        </div>

        <div className="p-4 space-y-3">
          {/* Seasonal Context Banner */}
          <Card className="bg-fishing-green/10 border-fishing-green/30">
            <CardContent className="p-3">
              <div className="flex items-center justify-center">
                <Badge variant="secondary" className="bg-fishing-green/20 text-fishing-green font-medium">
                  Season Context: {getSeasonalContext()}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Practice Memory */}
          <Card className="border-primary/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="font-medium text-primary">Practice Memory</h3>
              </div>
              
              <div className="space-y-2">
                <div className="flex gap-2 mb-3 overflow-x-auto">
                  {tournamentHistory.map((tournament, index) => (
                    <Button
                      key={index}
                      variant={selectedTournament === index ? "default" : "outline"}
                      size="sm"
                      className="text-xs whitespace-nowrap"
                      onClick={() => setSelectedTournament(index)}
                    >
                      {tournament.date}
                    </Button>
                  ))}
                </div>
                
                <div className="bg-primary/5 p-3 rounded-lg border-l-2 border-primary">
                  <p className="text-xs font-medium mb-1 text-primary">{tournamentHistory[selectedTournament].season}</p>
                  <p className="text-sm italic">{tournamentHistory[selectedTournament].notes}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tournament Memory Map */}
          <Card className="border-water-blue/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-water-blue" />
                <h3 className="font-medium text-water-blue">Tournament Memory Map</h3>
              </div>
              
              {/* Fake contour map */}
              <div className="bg-water-blue/5 border border-water-blue/20 rounded-lg p-4 mb-3 relative h-48">
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 120">
                  {/* Lake outline */}
                  <path 
                    d="M20 40 Q60 20 100 30 Q140 25 160 45 Q170 60 155 80 Q130 100 90 95 Q50 90 30 70 Q15 55 20 40 Z" 
                    fill="none" 
                    stroke="hsl(var(--water-blue))" 
                    strokeWidth="1"
                  />
                  {/* Contour lines */}
                  <path 
                    d="M35 45 Q70 35 105 40 Q135 38 150 55 Q155 70 140 82 Q115 90 80 87 Q55 83 40 65 Q30 55 35 45 Z" 
                    fill="none" 
                    stroke="hsl(var(--water-blue))" 
                    strokeWidth="0.5" 
                    opacity="0.6"
                  />
                  <path 
                    d="M50 50 Q75 45 100 47 Q120 46 130 58 Q132 68 125 75 Q110 80 85 78 Q70 76 60 68 Q52 60 50 50 Z" 
                    fill="none" 
                    stroke="hsl(var(--water-blue))" 
                    strokeWidth="0.5" 
                    opacity="0.4"
                  />
                  
                  {/* GPS Pins */}
                  {tournamentHistory[selectedTournament].pins.map((pin, index) => (
                    <g key={pin.id}>
                      <circle 
                        cx={60 + index * 25} 
                        cy={55 + index * 10} 
                        r="3" 
                        fill={selectedTournament === 0 ? "#22c55e" : selectedTournament === 1 ? "#eab308" : "#ef4444"}
                      />
                      <text 
                        x={60 + index * 25} 
                        y={50 + index * 10} 
                        fontSize="8" 
                        textAnchor="middle" 
                        fill="currentColor"
                      >
                        {pin.weight}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>

              {/* Pin Details */}
              <div className="space-y-1">
                {tournamentHistory[selectedTournament].pins.map((pin) => (
                  <div key={pin.id} className="bg-background p-2 rounded border flex justify-between items-center">
                    <div>
                      <p className="text-xs font-medium">{pin.lure} - {pin.weight}</p>
                      <p className="text-xs text-muted-foreground">{pin.gear} combo</p>
                    </div>
                    <Fish className="w-4 h-4 text-fishing-green" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Primary Pattern */}
          <Collapsible open={isPrimaryOpen} onOpenChange={setIsPrimaryOpen}>
            <Card className="border-fishing-green/20">
              <CollapsibleTrigger asChild>
                <CardContent className="p-3 cursor-pointer hover:bg-muted/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Target className="w-5 h-5 text-fishing-green" />
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
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <h3 className="font-medium text-amber-600">Backup Plans</h3>
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

          {/* Best Windows */}
          <Card className="border-amber-500/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="w-5 h-5 text-amber-600" />
                <h3 className="font-medium text-amber-600">Best Windows</h3>
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

          {/* Enhanced Confidence Meter 2.0 */}
          <Card className="border-emerald-500/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">🌍</span>
                  <h3 className="font-medium text-emerald-600">Environmental Factors</h3>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium text-emerald-600">Plan Confidence</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-emerald-200 rounded-full h-2">
                      <div 
                        className="bg-emerald-600 h-2 rounded-full" 
                        style={{ width: `${environmentalData.confidence}%` }}
                      ></div>
                    </div>
                    <span className="text-xs font-bold text-emerald-600">{environmentalData.confidence}%</span>
                  </div>
                  <p className="text-xs text-emerald-600 mt-1">{environmentalData.confidenceReason}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                {/* Moon Phase */}
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-emerald-700 mb-2">Moon Phase</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{environmentalData.moonPhase.icon}</span>
                      <div>
                        <p className="text-sm font-medium text-emerald-800">{environmentalData.moonPhase.phase}</p>
                        <p className="text-xs text-emerald-600">{environmentalData.moonPhase.illumination}% illuminated</p>
                      </div>
                    </div>
                    <div className="text-right text-xs text-emerald-600">
                      <p>Rise: {environmentalData.moonPhase.rise}</p>
                      <p>Set: {environmentalData.moonPhase.set}</p>
                    </div>
                  </div>
                </div>
                
                {/* Barometric Pressure Gauge */}
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-emerald-700 mb-2">Barometric Pressure</p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-emerald-800">{environmentalData.barometricPressure.current} inHg</span>
                      <span className="text-xs text-red-600 flex items-center gap-1">
                        ⬇️ {environmentalData.barometricPressure.trend}
                      </span>
                    </div>
                    <div className="flex items-end gap-1 h-8">
                      {environmentalData.barometricPressure.readings.map((reading, index) => (
                        <div key={index} className="flex flex-col items-center flex-1">
                          <div 
                            className={`w-full rounded-sm transition-all ${
                              index === environmentalData.barometricPressure.readings.length - 1 
                                ? 'bg-red-500' 
                                : 'bg-emerald-400'
                            }`}
                            style={{ height: `${((reading - 29.70) / 0.15) * 24}px` }}
                          />
                          <span className="text-xs text-emerald-600 mt-1">
                            {environmentalData.barometricPressure.timestamps[index]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* 2-Hour Weather Pattern */}
                <div className="bg-emerald-50 p-3 rounded-lg">
                  <p className="text-xs font-medium text-emerald-700 mb-2">2-Hour Weather Pattern</p>
                  <div className="grid grid-cols-3 gap-2">
                    {environmentalData.weatherPattern.map((period, index) => (
                      <div key={index} className="text-center bg-white/50 rounded p-2">
                        <p className="text-lg mb-1">{period.icon}</p>
                        <p className="text-xs font-medium text-emerald-800">{period.time}</p>
                        <p className="text-xs text-emerald-600">{period.temp}°F</p>
                        <p className="text-xs text-emerald-600">{period.condition}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-emerald-100 p-2 rounded-lg border-l-2 border-emerald-500">
                  <p className="text-xs font-medium text-emerald-800 mb-1">Analysis</p>
                  <p className="text-xs italic text-emerald-700">{environmentalData.analysis}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Adjustment Triggers */}
          <Card className="border-water-blue/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Wind className="w-5 h-5 text-water-blue" />
                <h3 className="font-medium text-water-blue">Adjustment Triggers</h3>
              </div>
              
              <div className="space-y-1">
                <div className="bg-water-blue/10 p-2 rounded-lg">
                  <p className="text-xs"><strong>Wind dies:</strong> Switch to chatterbait or lipless crank</p>
                </div>
                <div className="bg-water-blue/10 p-2 rounded-lg">
                  <p className="text-xs"><strong>Water clears:</strong> Downsize to wacky-rig stickbait</p>
                </div>
                <div className="bg-water-blue/10 p-2 rounded-lg">
                  <p className="text-xs"><strong>Cold front:</strong> Downsize spinnerbait blades, slow retrieve</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Mindset & Time Management */}
          <Card className="border-purple-500/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-600">Mindset & Time Management</h3>
              </div>
              
              <div className="space-y-1">
                <div className="bg-purple-50 p-2 rounded-lg border-l-2 border-purple-500">
                  <p className="text-xs font-medium">&quot;Don&apos;t burn time: no more than 30 minutes on a dead stretch.&quot;</p>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <p className="text-xs">Move until you find life — keep GPS pins on every bite</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Action Checklist */}
          <Card className="border-fishing-green/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <CheckSquare className="w-5 h-5 text-fishing-green" />
                <h3 className="font-medium text-fishing-green">Action Checklist</h3>
              </div>
              <div className="space-y-1 text-xs">
                {getCurrentActions().map((action, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-3 h-3 border border-muted-foreground rounded-sm mt-0.5 flex-shrink-0"></div>
                    <span>{action}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phase 1: Pre-Tournament Checklist */}
          <Card className="border-fishing-green/20">
            <CardContent className="p-3">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-fishing-green" />
                  <h3 className="font-medium text-fishing-green">Pre-Tournament Checklist</h3>
                </div>
                <div className="text-xs text-fishing-green font-medium">
                  {checklist.filter(item => item.checked).length}/{checklist.length}
                </div>
              </div>
              <div className="space-y-2">
                {checklist.map((item) => (
                  <div key={item.id} className="flex items-center space-x-2">
                    <button
                      onClick={() => handleChecklistToggle(item.id)}
                      className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                        item.checked 
                          ? 'bg-fishing-green border-fishing-green text-white' 
                          : 'border-muted-foreground'
                      }`}
                    >
                      {item.checked && <span className="text-xs">✓</span>}
                    </button>
                    <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.item}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phase 1: Live Notes Section */}
          <Card className="border-amber-500/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Edit3 className="w-5 h-5 text-amber-600" />
                <h3 className="font-medium text-amber-600">Live Tournament Notes</h3>
              </div>
              
              <div className="space-y-3">
                {/* Note Input */}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Quick note during tournament..."
                    value={liveNotes}
                    onChange={(e) => setLiveNotes(e.target.value)}
                    className="flex-1 px-3 py-2 border border-muted rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleSaveNote()}
                  />
                  <Button
                    size="sm"
                    onClick={handleSaveNote}
                    disabled={!liveNotes.trim()}
                    className="px-3"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>

                {/* Saved Notes */}
                <div className="space-y-1 max-h-24 overflow-y-auto">
                  {savedNotes.map((note, index) => (
                    <div key={index} className="bg-amber-50 p-2 rounded-lg">
                      <div className="flex justify-between items-start">
                        <p className="text-xs text-amber-800">{note.note}</p>
                        <span className="text-xs text-amber-600 font-medium ml-2">{note.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Phase 1: Streaks & Achievements */}
          <Card className="border-purple-500/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Award className="w-5 h-5 text-purple-600" />
                <h3 className="font-medium text-purple-600">Streaks & Achievements</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-2">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-2 rounded-lg border text-center ${
                      achievement.active 
                        ? 'bg-purple-50 border-purple-200' 
                        : 'bg-muted/50 border-muted'
                    }`}
                  >
                    <div className="text-lg mb-1">{achievement.badge}</div>
                    <p className="text-xs font-medium">{achievement.title}</p>
                    <p className={`text-xs ${achievement.active ? 'text-purple-600' : 'text-muted-foreground'}`}>
                      {achievement.value}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Phase 1: Post-Tournament Reflection */}
          <Card className="border-water-blue/20">
            <CardContent className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <Brain className="w-5 h-5 text-water-blue" />
                <h3 className="font-medium text-water-blue">Post-Tournament Reflection</h3>
              </div>
              
              <div className="bg-water-blue/10 p-3 rounded-lg border-l-2 border-water-blue">
                <p className="text-xs font-medium text-water-blue mb-2">AI Coach will ask after the event:</p>
                <div className="space-y-1 text-xs text-water-blue/80">
                  <p>• What patterns worked best today?</p>
                  <p>• What would you change for next time?</p>
                  <p>• Any new spots or techniques discovered?</p>
                  <p>• How did weather affect your plan?</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dial-In Confirmation */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <span className="text-xl mr-2">✅</span>
              Dial-In Check
            </h3>
            <DialInChecks />
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Auto-save happens silently - no manual save button needed */}
          </div>
        </div>
        
        {/* AI Shimmer Toast */}
        <AIShimmerToast
          message="Plan auto-saved by AI"
          lakeName={lakeName}
          show={showAIToast}
          onHide={() => setShowAIToast(false)}
        />
        
        {/* Context-Aware AI Button */}
        <ContextAwareFloatingButton />
      </div>
  );
};

export default TournamentPlanReport;