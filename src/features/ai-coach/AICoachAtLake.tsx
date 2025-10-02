import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { Lightbulb, Camera, Fish, Thermometer, Wind, Sun, Compass, RotateCcw, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useDemoMode } from "@/contexts/DemoModeContext";

interface Mission {
  id: string;
  title: string;
  progress: number;
  target: number;
}

const AICoachAtLake = () => {
  const { toast } = useToast();
  const { enabled: isDemoMode } = useDemoMode();
  const [suggestion, setSuggestion] = useState("");
  const [showSuggestion, setShowSuggestion] = useState(false);
  const [isLoadingSuggestion, setIsLoadingSuggestion] = useState(false);
  const [unwindMode, setUnwindMode] = useState(false);
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [isLoadingMission, setIsLoadingMission] = useState(true);

  // Quick log catch dialog state
  const [isLogDialogOpen, setIsLogDialogOpen] = useState(false);
  const [catchSpecies, setCatchSpecies] = useState("");
  const [catchWeight, setCatchWeight] = useState("");
  const [catchLength, setCatchLength] = useState("");
  const [isLoggingCatch, setIsLoggingCatch] = useState(false);

  const demoSuggestions = [
    "Water's warming up. Try switching to chatterbait near rocky points. Focus on 8-12 feet depth.",
    "Bass are moving shallow for spawn. Try Texas-rigged worms in 3-6 feet near weed beds.",
    "Cloudy conditions are perfect for topwater. Try poppers along shoreline early morning."
  ];

  const demoMission: Mission = {
    id: "1",
    title: "Catch 5 Bass This Month",
    progress: 3,
    target: 5
  };

  useEffect(() => {
    if (isDemoMode) {
      setActiveMission(demoMission);
      setIsLoadingMission(false);
    } else {
      fetchActiveMission();
      fetchUnwindMode();
    }
  }, [isDemoMode]);

  const fetchActiveMission = async () => {
    try {
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('status', 'active')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setActiveMission({
          id: data.id,
          title: data.title,
          progress: data.progress || 0,
          target: 100
        });
      }
    } catch (error: any) {
      console.error('Error fetching mission:', error);
    } finally {
      setIsLoadingMission(false);
    }
  };

  const fetchUnwindMode = async () => {
    try {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('unwind_mode_enabled')
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      if (data) setUnwindMode(data.unwind_mode_enabled || false);
    } catch (error: any) {
      console.error('Error fetching unwind mode:', error);
    }
  };

  const handleGetSuggestion = async () => {
    setIsLoadingSuggestion(true);
    
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomSuggestion = demoSuggestions[Math.floor(Math.random() * demoSuggestions.length)];
    setSuggestion(randomSuggestion);
    setShowSuggestion(true);
    setIsLoadingSuggestion(false);

    // Save to database if not demo
    if (!isDemoMode) {
      try {
        await supabase
          .from('ai_conversations')
          .insert({
            message: 'What should I try next?',
            response: randomSuggestion
          });
      } catch (error) {
        console.error('Error saving suggestion:', error);
      }
    }

    toast({
      title: "New suggestion ready!",
      description: "Check below for AI Coach's recommendation",
    });
  };

  const handleUnwindModeToggle = async (enabled: boolean) => {
    setUnwindMode(enabled);

    if (!isDemoMode) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('user_preferences')
          .upsert({
            user_id: user.id,
            unwind_mode_enabled: enabled,
            updated_at: new Date().toISOString()
          } as any);

        if (error) throw error;
      } catch (error: any) {
        toast({
          title: "Error updating preference",
          description: error.message,
          variant: "destructive"
        });
        setUnwindMode(!enabled); // Revert on error
        return;
      }
    }

    toast({
      title: enabled ? "Unwind Mode enabled" : "Unwind Mode disabled",
      description: enabled 
        ? "Social features hidden. Focus on fishing!" 
        : "Social features restored",
    });
  };

  const handleLogCatch = async () => {
    if (!catchSpecies) {
      toast({
        title: "Species required",
        description: "Please select a species",
        variant: "destructive"
      });
      return;
    }

    setIsLoggingCatch(true);

    try {
      if (!isDemoMode) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Not authenticated');

        const { error } = await supabase
          .from('catches')
          .insert({
            user_id: user.id,
            species: catchSpecies,
            weight: catchWeight ? parseFloat(catchWeight) : null,
            length: catchLength ? parseFloat(catchLength) : null,
            timestamp: new Date().toISOString()
          } as any);

        if (error) throw error;
      }

      toast({
        title: "Catch logged!",
        description: `${catchSpecies} recorded successfully`,
      });

      // Reset form
      setCatchSpecies("");
      setCatchWeight("");
      setCatchLength("");
      setIsLogDialogOpen(false);
    } catch (error: any) {
      toast({
        title: "Error logging catch",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoggingCatch(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <div className="bg-gradient-to-r from-fishing-green-dark to-water-blue-dark text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">At the Lake</h1>
              <p className="text-sm text-white/90">Real-time coaching & quick actions</p>
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="unwind-mode" className="text-sm text-white">Unwind Mode</Label>
              <Switch
                id="unwind-mode"
                checked={unwindMode}
                onCheckedChange={handleUnwindModeToggle}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Active Mission Banner */}
        {!isLoadingMission && activeMission && (
          <Card className="border-trophy-gold/30 bg-trophy-gold/5">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge className="bg-trophy-gold text-foreground">Active Mission</Badge>
                  <span className="font-semibold">{activeMission.title}</span>
                </div>
                <span className="text-sm font-medium">{activeMission.progress}/{activeMission.target}</span>
              </div>
              <Progress 
                value={(activeMission.progress / activeMission.target) * 100} 
                className="h-2"
              />
            </CardContent>
          </Card>
        )}

        {/* Main Action Button */}
        <Button
          onClick={handleGetSuggestion}
          disabled={isLoadingSuggestion}
          className="w-full h-16 text-lg bg-trophy-gold hover:bg-trophy-gold-dark text-foreground font-bold"
        >
          {isLoadingSuggestion ? (
            <>
              <Loader2 className="mr-2 h-6 w-6 animate-spin" />
              Thinking...
            </>
          ) : (
            <>
              <Lightbulb className="mr-2 h-6 w-6" />
              What should I try next?
            </>
          )}
        </Button>

        {/* AI Suggestion Display */}
        {showSuggestion && suggestion && (
          <Card className="bg-fishing-green/5 border-fishing-green/30 animate-in fade-in slide-in-from-bottom-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-fishing-green">
                <Compass className="w-5 h-5" />
                AI Coach Suggestion
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{suggestion}</p>
              <div className="flex gap-2">
                <Button
                  onClick={handleGetSuggestion}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Try Another Suggestion
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Log Catch */}
        <Dialog open={isLogDialogOpen} onOpenChange={setIsLogDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full h-14 bg-fishing-green hover:bg-fishing-green-dark text-white">
              <Fish className="mr-2 h-5 w-5" />
              Quick Log Catch
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Catch</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="species">Species *</Label>
                <Select value={catchSpecies} onValueChange={setCatchSpecies}>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Weight (lbs)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    placeholder="5.2"
                    value={catchWeight}
                    onChange={(e) => setCatchWeight(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="length">Length (in)</Label>
                  <Input
                    id="length"
                    type="number"
                    step="0.5"
                    placeholder="18"
                    value={catchLength}
                    onChange={(e) => setCatchLength(e.target.value)}
                  />
                </div>
              </div>

              <Button
                onClick={handleLogCatch}
                disabled={isLoggingCatch || !catchSpecies}
                className="w-full bg-fishing-green hover:bg-fishing-green-dark"
              >
                {isLoggingCatch ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Logging...
                  </>
                ) : (
                  <>
                    <Fish className="mr-2 h-4 w-4" />
                    Log Catch
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Current Conditions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-water-blue" />
              Current Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-muted rounded-lg">
                <Thermometer className="w-6 h-6 mx-auto mb-2 text-water-blue" />
                <p className="text-xs text-muted-foreground mb-1">Water Temp</p>
                <p className="font-semibold">Check at lake</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Wind className="w-6 h-6 mx-auto mb-2 text-water-blue" />
                <p className="text-xs text-muted-foreground mb-1">Wind</p>
                <p className="font-semibold">Check app</p>
              </div>
              <div className="text-center p-3 bg-muted rounded-lg">
                <Sun className="w-6 h-6 mx-auto mb-2 text-trophy-gold" />
                <p className="text-xs text-muted-foreground mb-1">Time</p>
                <p className="font-semibold">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Link to="/ai-coach/pre-trip">
            <Button variant="outline" className="w-full h-full">
              <div className="text-center">
                <Compass className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">View Trip Plan</p>
              </div>
            </Button>
          </Link>
          <Link to="/ai-coach">
            <Button variant="outline" className="w-full h-full">
              <div className="text-center">
                <Lightbulb className="w-6 h-6 mx-auto mb-1" />
                <p className="text-sm">AI Coach Chat</p>
              </div>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AICoachAtLake;
