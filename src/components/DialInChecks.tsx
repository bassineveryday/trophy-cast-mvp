import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, Thermometer, Waves } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DialInChecks = () => {
  const [tempConfirmed, setTempConfirmed] = useState<string | null>(null);
  const [levelConfirmed, setLevelConfirmed] = useState<string | null>(null);
  const { toast } = useToast();

  const handleTempCheck = () => {
    const temps = ["60°F", "62°F", "65°F", "68°F"];
    const randomTemp = temps[Math.floor(Math.random() * temps.length)];
    setTempConfirmed(randomTemp);
    toast({
      title: "Surface temp confirmed",
      description: `Temperature reading: ${randomTemp}`,
    });
  };

  const handleLevelCheck = () => {
    const levels = ["Normal", "Down 2ft", "Up 1ft"];
    const randomLevel = levels[Math.floor(Math.random() * levels.length)];
    setLevelConfirmed(randomLevel);
    toast({
      title: "Lake level confirmed",
      description: `Water level: ${randomLevel}`,
    });
  };


  return (
    <Card className="bg-muted/30 border-dashed border-muted-foreground/30">
      <CardContent className="p-3">
        <div className="flex items-center space-x-2 mb-3">
          <Mic className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">Dial-In Confirmation</span>
          <span className="text-xs text-muted-foreground">(demo)</span>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs">"What's the surface temperature?"</span>
            </div>
            <div className="flex items-center space-x-2">
              {tempConfirmed ? (
                <span className="text-xs text-fishing-green font-medium">{tempConfirmed}</span>
              ) : (
                <Button
                  variant="ghost" 
                  size="sm"
                  onClick={handleTempCheck}
                  className="text-xs h-6 px-2"
                >
                  Check
                </Button>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Waves className="w-3 h-3 text-muted-foreground" />
              <span className="text-xs">"Is lake level up, down, or normal?"</span>
            </div>
            <div className="flex items-center space-x-2">
              {levelConfirmed ? (
                <span className="text-xs text-fishing-green font-medium">{levelConfirmed}</span>
              ) : (
                <Button
                  variant="ghost"
                  size="sm" 
                  onClick={handleLevelCheck}
                  className="text-xs h-6 px-2"
                >
                  Check
                </Button>
              )}
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
};