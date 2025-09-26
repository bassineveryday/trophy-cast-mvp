import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Mic } from "lucide-react";
import { useVoice } from "@/contexts/VoiceContext";

export const VoiceToggle = () => {
  const { isVoiceModeEnabled, toggleVoiceMode } = useVoice();

  return (
    <div className="flex items-center justify-center gap-3 mb-4">
      <Badge 
        variant="outline" 
        className={`flex items-center gap-2 px-3 py-1 cursor-pointer transition-colors ${
          isVoiceModeEnabled 
            ? 'bg-trophy-gold/10 border-trophy-gold/30 text-trophy-gold' 
            : 'bg-muted border-muted-foreground/20 text-muted-foreground'
        }`}
        onClick={toggleVoiceMode}
      >
        <Mic className="w-3 h-3" />
        <span className="text-xs font-medium">Voice Mode (mock)</span>
        <Switch 
          checked={isVoiceModeEnabled} 
          onCheckedChange={toggleVoiceMode}
          className="ml-1 scale-75"
        />
      </Badge>
    </div>
  );
};