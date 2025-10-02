import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Fish, Target, MapPin, Clock, Save, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/contexts/DemoModeContext";

interface TripPlan {
  lures: Array<{ name: string; description: string }>;
  techniques: Array<{ name: string; description: string }>;
  locations: Array<{ name: string; description: string }>;
  timeStrategy: Array<{ time: string; description: string }>;
}

const AICoachPreTrip = () => {
  const { toast } = useToast();
  const { enabled: isDemoMode } = useDemoMode();
  const [waterBody, setWaterBody] = useState("");
  const [targetSpecies, setTargetSpecies] = useState("");
  const [tripDate, setTripDate] = useState<Date>();
  const [tripGoal, setTripGoal] = useState("");
  const [weatherConditions, setWeatherConditions] = useState("");
  const [showPlan, setShowPlan] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [tripPlan, setTripPlan] = useState<TripPlan | null>(null);

  // Demo data
  useState(() => {
    if (isDemoMode) {
      setWaterBody("Lake Mead");
      setTargetSpecies("Largemouth Bass");
      setTripDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
      setTripGoal("Tournament");
      setWeatherConditions("Sunny, light wind");
    }
  });

  const generateTripPlan = async () => {
    setIsGenerating(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 1500));

    const plan: TripPlan = {
      lures: [
        {
          name: "Chatterbait (1/2 oz, white/chartreuse)",
          description: "Great for murky water and aggressive strikes"
        },
        {
          name: "Texas-rigged Worm (watermelon red)",
          description: "Perfect for working through vegetation"
        },
        {
          name: "Spinnerbait (double willow, shad pattern)",
          description: "Excellent for covering water quickly"
        },
        {
          name: "Crankbait (medium diving, natural shad)",
          description: "Triggers reaction bites from active fish"
        },
        {
          name: "Topwater Popper (bone or white)",
          description: "Early morning surface action"
        }
      ],
      techniques: [
        {
          name: "Slow Rolling",
          description: "Keep spinnerbait just above grass tops, steady retrieve"
        },
        {
          name: "Texas Rig Pitching",
          description: "Flip into heavy cover, let sink, subtle hops"
        },
        {
          name: "Steady Retrieve",
          description: "For crankbaits along structure and drop-offs"
        }
      ],
      locations: [
        {
          name: "Rocky Points (8-15 feet depth)",
          description: "Focus on transition areas where rock meets vegetation"
        },
        {
          name: "Grass Beds (3-8 feet depth)",
          description: "Target edges and pockets within the grass"
        },
        {
          name: "Docks and Overhangs",
          description: "Shade areas during bright conditions"
        }
      ],
      timeStrategy: [
        {
          time: "Dawn (5-7am)",
          description: "Prime time for topwater and aggressive shallow presentations. Fish are actively feeding."
        },
        {
          time: "Mid-Morning (7-10am)",
          description: "Transition to chatterbait and spinnerbait as sun rises. Work grass edges."
        },
        {
          time: "Midday (10am-2pm)",
          description: "Fish deeper structure with Texas rigs and crankbaits. Target shaded areas."
        },
        {
          time: "Evening (6-8pm)",
          description: "Return to shallow water topwater and reaction baits. Second feeding window."
        }
      ]
    };

    setTripPlan(plan);
    setShowPlan(true);
    setIsGenerating(false);

    toast({
      title: "Trip plan generated!",
      description: "Your personalized fishing plan is ready",
    });
  };

  const saveTripPlan = async () => {
    if (!tripPlan) return;

    setIsSaving(true);

    const planData = {
      waterBody,
      targetSpecies,
      tripDate: tripDate?.toISOString(),
      tripGoal,
      weatherConditions,
      plan: tripPlan
    };

    try {
      if (isDemoMode) {
        // Demo mode: just show success
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Save to Supabase
        const { error } = await supabase
          .from('ai_conversations')
          .insert({
            message: JSON.stringify(planData),
            response: JSON.stringify(tripPlan)
          });

        if (error) throw error;
      }

      toast({
        title: "Trip plan saved!",
        description: "View anytime in AI Coach",
      });
    } catch (error: any) {
      toast({
        title: "Error saving plan",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-water-blue-dark to-fishing-green-dark text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Pre-Trip Planning</h1>
          <p>Get AI-powered fishing plans tailored to your trip</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Trip Planning Form */}
        <Card>
          <CardHeader>
            <CardTitle>Trip Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="waterBody">Water Body</Label>
              <Input
                id="waterBody"
                placeholder="Lake Mead, Colorado River, etc."
                value={waterBody}
                onChange={(e) => setWaterBody(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Target Species</Label>
              <Select value={targetSpecies} onValueChange={setTargetSpecies}>
                <SelectTrigger id="species">
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Largemouth Bass">Largemouth Bass</SelectItem>
                  <SelectItem value="Smallmouth Bass">Smallmouth Bass</SelectItem>
                  <SelectItem value="Trout">Trout</SelectItem>
                  <SelectItem value="Catfish">Catfish</SelectItem>
                  <SelectItem value="Crappie">Crappie</SelectItem>
                  <SelectItem value="Walleye">Walleye</SelectItem>
                  <SelectItem value="Striped Bass">Striped Bass</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Trip Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !tripDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {tripDate ? format(tripDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={tripDate}
                    onSelect={setTripDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weather">Weather Conditions (optional)</Label>
              <Input
                id="weather"
                placeholder="Sunny, cloudy, windy, etc."
                value={weatherConditions}
                onChange={(e) => setWeatherConditions(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Trip Goal</Label>
              <Select value={tripGoal} onValueChange={setTripGoal}>
                <SelectTrigger id="goal">
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Tournament">Tournament</SelectItem>
                  <SelectItem value="Practice">Practice</SelectItem>
                  <SelectItem value="Fun Fishing">Fun Fishing</SelectItem>
                  <SelectItem value="Learning New Techniques">Learning New Techniques</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generateTripPlan}
              className="w-full bg-trophy-gold hover:bg-trophy-gold-dark text-foreground"
              disabled={!waterBody || !targetSpecies || !tripDate || !tripGoal || isGenerating}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Plan...
                </>
              ) : (
                <>
                  <Target className="mr-2 h-4 w-4" />
                  Generate Trip Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Trip Plan Display */}
        {showPlan && tripPlan && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
            {/* Recommended Lures */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Fish className="w-5 h-5 text-fishing-green" />
                  Recommended Lures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripPlan.lures.map((lure, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-fishing-green/5 rounded-lg border border-fishing-green/20">
                      <Badge variant="outline" className="mt-1">{index + 1}</Badge>
                      <div>
                        <p className="font-medium">{lure.name}</p>
                        <p className="text-sm text-muted-foreground">{lure.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Techniques */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-water-blue" />
                  Techniques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripPlan.techniques.map((technique, index) => (
                    <div key={index} className="p-3 bg-water-blue/5 rounded-lg border border-water-blue/20">
                      <p className="font-medium mb-1">{technique.name}</p>
                      <p className="text-sm text-muted-foreground">{technique.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Location/Depth */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-trophy-gold" />
                  Location & Depth Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripPlan.locations.map((location, index) => (
                    <div key={index} className="p-3 bg-trophy-gold/5 rounded-lg border border-trophy-gold/20">
                      <p className="font-medium mb-1">{location.name}</p>
                      <p className="text-sm text-muted-foreground">{location.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Time Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-fishing-green" />
                  Time Strategy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {tripPlan.timeStrategy.map((strategy, index) => (
                    <div key={index} className="p-3 bg-muted rounded-lg">
                      <p className="font-medium mb-1">{strategy.time}</p>
                      <p className="text-sm text-muted-foreground">{strategy.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                onClick={saveTripPlan}
                disabled={isSaving}
                className="flex-1 bg-fishing-green hover:bg-fishing-green-dark"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Trip Plan
                  </>
                )}
              </Button>
              <Link to="/ai-coach/at-lake" className="flex-1">
                <Button className="w-full" variant="outline">
                  Go to At Lake →
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICoachPreTrip;
