import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, Brain, MessageCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useVoice } from "@/contexts/VoiceContext";
import { FloatingMicButton } from "@/components/voice/FloatingMicButton";

const AICoachAtLake = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tempSelection, setTempSelection] = useState<string>("");
  const [levelSelection, setLevelSelection] = useState<string>("");
  const { registerCommands } = useVoice();

  const handleGeneratePlan = () => {
    const temp = tempSelection || "62–65°F";
    const level = levelSelection || "Low";
    navigate(`/ai-coach/adjusted-plan?temp=${encodeURIComponent(temp)}&level=${encodeURIComponent(level)}`);
  };

  const handleTempSelection = (temp: string) => {
    setTempSelection(temp);
    toast({
      title: "Temperature set",
      description: `Surface temp set to ${temp}`,
    });
  };

  const handleLevelSelection = (level: string) => {
    setLevelSelection(level);
    toast({
      title: "Water level set",
      description: `Lake level set to ${level}`,
    });
  };

  useEffect(() => {
    const commands = [
      {
        phrase: "Set temp to 60",
        action: () => handleTempSelection("<62°F")
      },
      {
        phrase: "temp 60",
        action: () => handleTempSelection("<62°F")
      },
      {
        phrase: "Set temp to 65",
        action: () => handleTempSelection(">65°F")
      },
      {
        phrase: "Wind is west at twelve",
        action: () => {
          toast({
            title: "Wind conditions noted",
            description: "W 10-15 mph recorded",
          });
        }
      },
      {
        phrase: "Water looks muddy",
        action: () => {
          toast({
            title: "Water clarity noted",
            description: "Muddy conditions recorded",
          });
        }
      },
      {
        phrase: "Start on rocky points",
        action: () => {
          toast({
            title: "Starting area set",
            description: "Rocky points marked as priority",
          });
        }
      },
      {
        phrase: "Generate adjusted plan",
        action: handleGeneratePlan
      },
      {
        phrase: "generate plan",
        action: handleGeneratePlan
      }
    ];
    
    registerCommands(commands);
  }, [registerCommands, toast, tempSelection, levelSelection]);

  return (
    <div className="space-y-6">
      {/* Demo Notice */}
      <div className="text-center">
        <Badge variant="secondary" className="bg-muted text-muted-foreground">
          Demo only—no live AI
        </Badge>
      </div>

      {/* Coach Question Bubble */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="bg-primary/10 p-2 rounded-full flex-shrink-0">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium mb-2">AI Coach</p>
              <p className="text-sm">
                Let's dial it in. Can you confirm two things?
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Question A */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Surface temp looks close to 62–65°F. What are you reading?</p>
        <div className="flex flex-wrap gap-2">
          {["<62°F", "62–65°F", ">65°F"].map((temp) => (
            <Button
              key={temp}
              variant={tempSelection === temp ? "default" : "outline"}
              size="sm"
              onClick={() => handleTempSelection(temp)}
              className="text-xs"
            >
              {temp}
            </Button>
          ))}
        </div>
      </div>

      {/* Question B */}
      <div className="space-y-3">
        <p className="text-sm font-medium">Lake level at Pueblo is showing low. Is that right?</p>
        <div className="flex flex-wrap gap-2">
          {["Low", "Normal", "High"].map((level) => (
            <Button
              key={level}
              variant={levelSelection === level ? "default" : "outline"}
              size="sm"
              onClick={() => handleLevelSelection(level)}
              className="text-xs"
            >
              {level}
            </Button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <Button 
        className="w-full"
        onClick={handleGeneratePlan}
      >
        Generate Adjusted Plan
      </Button>

      {/* Floating Mic Button */}
      <FloatingMicButton />
    </div>
  );
};

export default AICoachAtLake;