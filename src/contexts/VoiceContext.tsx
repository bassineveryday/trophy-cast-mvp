import React, { createContext, useContext, useState, useCallback } from "react";
import { samplePhrases } from "@/utils/voiceCommands";
import { useToast } from "@/hooks/use-toast";

export type VoiceState = "idle" | "listening" | "processing" | "result";

export interface VoiceCommand {
  phrase: string;
  action: () => void;
  description?: string;
}

const contextTips = [
  "Log catch five point two pounds on spinnerbait.",
  "Show leaderboard.",
  "Who's leading AOY?", 
  "Post to Close Friends.",
  "Create share card.",
  "Show big bass standings."
];

interface VoiceContextType {
  isVoiceModeEnabled: boolean;
  voiceState: VoiceState;
  transcript: string;
  commands: VoiceCommand[];
  currentTip: string;
  showCheatSheet: boolean;
  isDemoMode: boolean;
  
  enableVoiceMode: () => void;
  disableVoiceMode: () => void;
  toggleVoiceMode: () => void;
  startListening: () => void;
  stopListening: () => void;
  processCommand: (phrase: string) => boolean;
  registerCommands: (commands: VoiceCommand[]) => void;
  clearCommands: () => void;
  setShowCheatSheet: (show: boolean) => void;
  setDemoMode: (demo: boolean) => void;
  processVoiceCommand: (command: string) => Promise<string>;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within a VoiceProvider");
  }
  return context;
};

interface VoiceProviderProps {
  children: React.ReactNode;
}

export const VoiceProvider: React.FC<VoiceProviderProps> = ({ children }) => {
  const [isVoiceModeEnabled, setIsVoiceModeEnabled] = useState(true); // Always enabled now
  const [voiceState, setVoiceState] = useState<VoiceState>("idle");
  const [transcript, setTranscript] = useState("");
  const [commands, setCommands] = useState<VoiceCommand[]>([]);
  const [currentTip, setCurrentTip] = useState(contextTips[0]);
  const [showCheatSheet, setShowCheatSheet] = useState(false);
  const [isDemoMode, setDemoMode] = useState(false);
  const { toast } = useToast();

  const enableVoiceMode = useCallback(() => {
    setIsVoiceModeEnabled(true);
    localStorage.setItem("voice-mode-enabled", "true");
  }, []);

  const disableVoiceMode = useCallback(() => {
    setIsVoiceModeEnabled(false);
    setVoiceState("idle");
    localStorage.setItem("voice-mode-enabled", "false");
  }, []);

  const toggleVoiceMode = useCallback(() => {
    if (isVoiceModeEnabled) {
      disableVoiceMode();
    } else {
      enableVoiceMode();
    }
  }, [isVoiceModeEnabled, enableVoiceMode, disableVoiceMode]);

  const startListening = useCallback(() => {
    setVoiceState("listening");
    setTranscript("");
    
    // Rotate tip when listening starts
    const currentIndex = contextTips.indexOf(currentTip);
    const nextTip = contextTips[(currentIndex + 1) % contextTips.length];
    setCurrentTip(nextTip);
    
    // Simulate listening for 2 seconds, then process
    setTimeout(() => {
      const samplePhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
      setTranscript(samplePhrase);
      setVoiceState("processing");
      
      // Process the command
      setTimeout(async () => {
        const response = await processVoiceCommand(samplePhrase);
        setVoiceState("result");
        
        // Show response toast
        toast({
          title: "Voice Command Processed",
          description: response,
        });
        
        // Clear after showing result
        setTimeout(() => {
          setVoiceState("idle");
          setTranscript("");
        }, 3000);
      }, 1000);
    }, 2000);
  }, [currentTip, toast]);

  const stopListening = useCallback(() => {
    setVoiceState("idle");
    setTranscript("");
  }, []);

  const processCommand = useCallback((phrase: string): boolean => {
    const normalizedPhrase = phrase.toLowerCase().trim();
    
    // Find matching command
    const matchingCommand = commands.find(cmd => 
      cmd.phrase.toLowerCase().includes(normalizedPhrase) || 
      normalizedPhrase.includes(cmd.phrase.toLowerCase())
    );
    
    if (matchingCommand) {
      matchingCommand.action();
      return true;
    }
    
    return false;
  }, [commands]);

  const registerCommands = useCallback((newCommands: VoiceCommand[]) => {
    setCommands(newCommands);
  }, []);

  const clearCommands = useCallback(() => {
    setCommands([]);
  }, []);

  const processVoiceCommand = useCallback(async (command: string): Promise<string> => {
    const normalizedCommand = command.toLowerCase();
    
    // Catch logging
    if (normalizedCommand.includes('log catch') || normalizedCommand.includes('caught')) {
      const weightMatch = normalizedCommand.match(/(\d+\.?\d*)\s*(?:pound|lb|pounder)/);
      const lureMatch = normalizedCommand.match(/(spinnerbait|chatterbait|jig|crankbait|worm)/);
      
      const weight = weightMatch ? weightMatch[1] : '4.2';
      const lure = lureMatch ? lureMatch[1] : 'spinnerbait';
      const visibility = normalizedCommand.includes('private') ? 'Private' : 
                        normalizedCommand.includes('club') ? 'Club' : 'Public';
      
      return `Catch logged: ${weight} lbs, ${lure}, visibility ${visibility}. Add a photo?`;
    }
    
    // Leaderboard commands
    if (normalizedCommand.includes('show leaderboard') || normalizedCommand.includes('leaderboard')) {
      return "Showing tournament leaderboard.";
    }
    
    if (normalizedCommand.includes('big bass')) {
      return "Showing Big Bass results.";
    }
    
    // AOY commands
    if (normalizedCommand.includes('leading aoy') || normalizedCommand.includes('aoy leader')) {
      return "Jake Patterson leads with 1,847 points.";
    }
    
    // Share commands
    if (normalizedCommand.includes('share card') || normalizedCommand.includes('create share')) {
      return "Share card ready.";
    }
    
    return "Did you mean log a catch or show leaderboard?";
  }, []);

  const value: VoiceContextType = {
    isVoiceModeEnabled,
    voiceState,
    transcript,
    commands,
    currentTip,
    showCheatSheet,
    isDemoMode,
    enableVoiceMode,
    disableVoiceMode,
    toggleVoiceMode,
    startListening,
    stopListening,
    processCommand,
    registerCommands,
    clearCommands,
    setShowCheatSheet,
    setDemoMode,
    processVoiceCommand,
  };

  return (
    <VoiceContext.Provider value={value}>
      {children}
    </VoiceContext.Provider>
  );
};