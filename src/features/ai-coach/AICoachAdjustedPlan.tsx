import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronLeft, Brain, MessageCircle, Home } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useVoice } from "@/contexts/VoiceContext";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";

const AICoachAdjustedPlan = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { registerCommands } = useVoice();
  
  const temp = searchParams.get('temp') || '62–65°F';
  const level = searchParams.get('level') || 'Low';

  const handleSavePlan = () => {
    // Plan auto-saved silently - no toast needed
    // AI handles saving in the background
  };

  useEffect(() => {
    const commands = [
      {
        phrase: "Save to my plan",
        action: handleSavePlan
      },
      {
        phrase: "save plan",
        action: handleSavePlan
      },
      {
        phrase: "Back to coach home",
        action: () => navigate('/ai-coach')
      },
      {
        phrase: "back to coach",
        action: () => navigate('/ai-coach')
      },
      {
        phrase: "Show summary",
        action: () => {
          toast({
            title: "Summary view",
            description: "Plan summary displayed",
          });
        }
      }
    ];
    
    registerCommands(commands);
  }, [navigate, registerCommands, toast]);

  const getPlanContent = () => {
    let mainPlan = "";
    
    if (temp === '<62°F') {
      mainPlan = "Colder than expected → slide deeper (12–15 ft) and slow down. Start with football jig or TX-rig on rock points. Spinnerbait only if wind stacks bait.";
    } else if (temp === '>65°F') {
      mainPlan = "Warmer than expected → slide shallower early, then mid-depth (8–12 ft) as sun rises. Mix chatterbait/spinnerbait with a finesse jig on shade lines.";
    } else {
      mainPlan = "On target → start on wind-blown grass edges with spinnerbait (window 7–10am). After the flurry, shift to jig on rocky transitions (10–14 ft).";
    }

    let levelNote = "";
    if (level === 'Low') {
      levelNote = "With low water, prioritize main-lake points; some bank grass is out of play.";
    } else if (level === 'High') {
      levelNote = "High water — push shallow to flooded cover in protected pockets.";
    } else {
      levelNote = "Normal pool — secondary points still viable.";
    }

    return { mainPlan, levelNote };
  };

  const { mainPlan, levelNote } = getPlanContent();

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="text-center">
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Demo only—no live AI
        </Badge>
      </div>

      {/* Coach Response Bubble */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">AI Coach</p>
              <p className="text-sm mb-3">{mainPlan}</p>
              <div className="bg-background p-3 rounded-lg">
                <p className="text-xs text-muted-foreground font-medium mb-1">Level adjustment:</p>
                <p className="text-xs">{levelNote}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Summary */}
      <Card className="border-fishing-green/20">
        <CardHeader>
        <CardTitle className="flex items-center text-fishing-green text-lg">
          <Brain className="w-5 h-5 mr-2" />
          Adjusted Plan
        </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-muted p-2 rounded">
              <p className="font-medium">Temp Reading</p>
              <p>{temp}</p>
            </div>
            <div className="bg-muted p-2 rounded">
              <p className="font-medium">Water Level</p>
              <p>{level}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Manual save button removed - AI handles saving automatically */}
        <Button 
          className="w-full justify-between"
          variant="outline"
          onClick={() => navigate('/ai-coach')}
        >
          <span>Back to Coach Home</span>
          <Home className="w-4 h-4" />
        </Button>
      </div>

      {/* Floating Mic Button */}
      <FloatingMicButton />
    </div>
  );
};

export default AICoachAdjustedPlan;