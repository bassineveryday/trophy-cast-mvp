import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Mic, Trophy, Camera, MessageCircle, Share2 } from "lucide-react";

interface VoiceCheatSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const commandGroups = [
  {
    title: "Log Catch",
    icon: Trophy,
    color: "text-fishing-green",
    commands: [
      "Log catch five point two pounds on spinnerbait",
      "Caught a four pounder on chatterbait, private",
      "Log catch three pounds on crankbait, post to club"
    ]
  },
  {
    title: "Leaderboard",
    icon: Trophy,
    color: "text-trophy-gold",
    commands: [
      "Show leaderboard",
      "Show big bass standings",
      "Who's leading AOY?",
      "Show tournament results"
    ]
  },
  {
    title: "Photos & Sharing",
    icon: Camera,
    color: "text-water-blue",
    commands: [
      "Create share card",
      "Post to Close Friends",
      "Add photo to catch",
      "Share tournament results"
    ]
  },
  {
    title: "Messages",
    icon: MessageCircle,
    color: "text-primary",
    commands: [
      "Send message to Jake",
      "Check club inbox",
      "Reply to last message"
    ]
  }
];

export const VoiceCheatSheet: React.FC<VoiceCheatSheetProps> = ({ 
  isOpen, 
  onClose 
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          
          {/* Sheet */}
          <motion.div
            className="fixed inset-x-4 top-20 bottom-20 bg-background border rounded-xl shadow-xl z-50 overflow-hidden"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-primary/5 to-trophy-gold/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Mic className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Voice Commands</h2>
                  <p className="text-sm text-muted-foreground">What can I say?</p>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Content */}
            <div className="p-4 space-y-6 overflow-y-auto max-h-[calc(100%-80px)]">
              {/* Demo tip */}
              <div className="bg-trophy-gold/10 border border-trophy-gold/20 rounded-lg p-3">
                <p className="text-sm text-trophy-gold font-medium mb-1">Demo Mode</p>
                <p className="text-xs text-muted-foreground">
                  Voice commands are simulated for this demo. Try saying any of the phrases below!
                </p>
              </div>
              
              {/* Command groups */}
              {commandGroups.map((group, groupIndex) => {
                const Icon = group.icon;
                
                return (
                  <div key={groupIndex} className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full bg-background border-2 flex items-center justify-center ${group.color}`}>
                        <Icon className="w-3 h-3" />
                      </div>
                      <h3 className="font-medium text-sm">{group.title}</h3>
                    </div>
                    
                    <div className="grid gap-2 ml-8">
                      {group.commands.map((command, commandIndex) => (
                        <Badge
                          key={commandIndex}
                          variant="outline"
                          className="text-xs px-3 py-1.5 h-auto justify-start bg-muted/20 hover:bg-muted/30 transition-colors cursor-default"
                        >
                          "{command}"
                        </Badge>
                      ))}
                    </div>
                  </div>
                );
              })}
              
              {/* Footer tip */}
              <div className="bg-muted/20 border rounded-lg p-3 mt-6">
                <p className="text-xs text-muted-foreground text-center">
                  Press and hold the mic button to see context tips, or tap once to start listening.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};