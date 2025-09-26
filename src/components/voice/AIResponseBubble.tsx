import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Sparkles } from "lucide-react";

interface AIResponseBubbleProps {
  response: {
    message: string;
    actions: Array<{ label: string; action: () => void }>;
  } | null;
  isVisible: boolean;
  onDismiss: () => void;
}

export const AIResponseBubble: React.FC<AIResponseBubbleProps> = ({ 
  response, 
  isVisible,
  onDismiss
}) => {
  return (
    <AnimatePresence>
      {isVisible && response && (
        <motion.div
          className="absolute -top-32 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="relative bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-xl p-4 max-w-[280px] min-w-[240px]">
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background/95 border-r border-b border-border rotate-45" />
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onDismiss}
              className="absolute -top-1 -right-1 h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
            >
              <X className="w-3 h-3" />
            </Button>
            
            {/* AI Badge */}
            <div className="flex items-center mb-2">
              <Badge variant="secondary" className="text-[10px] px-2 py-0.5 bg-trophy-gold/10 text-trophy-gold border-trophy-gold/20">
                <Sparkles className="w-2.5 h-2.5 mr-1" />
                AI Coach
              </Badge>
            </div>
            
            {/* Response message */}
            <p className="text-sm font-medium mb-3 leading-relaxed">
              {response.message}
            </p>
            
            {/* Action buttons */}
            {response.actions.length > 0 && (
              <div className="flex flex-col gap-2">
                {response.actions.map((action, index) => (
                  <Button
                    key={index}
                    variant={index === 0 ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      action.action();
                      onDismiss();
                    }}
                    className="w-full text-xs h-8"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};