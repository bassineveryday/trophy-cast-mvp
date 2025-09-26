import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface ContextTipsProps {
  isVisible: boolean;
  currentTip: string;
}

export const ContextTips: React.FC<ContextTipsProps> = ({ 
  isVisible, 
  currentTip 
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-20"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative bg-background/95 backdrop-blur-sm border border-border rounded-lg shadow-lg p-3 max-w-[280px]">
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background/95 border-r border-b border-border rotate-45" />
            
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
              </div>
              
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-foreground leading-relaxed">
                  Try: "{currentTip}"
                </p>
                <Badge variant="secondary" className="text-[10px] px-2 py-0.5 mt-1 bg-muted/50">
                  Voice tip
                </Badge>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};