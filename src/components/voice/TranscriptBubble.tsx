import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";

interface TranscriptBubbleProps {
  transcript: string;
  isVisible: boolean;
}

export const TranscriptBubble: React.FC<TranscriptBubbleProps> = ({ 
  transcript, 
  isVisible 
}) => {
  return (
    <AnimatePresence>
      {isVisible && transcript && (
        <motion.div
          className="absolute -top-20 left-1/2 transform -translate-x-1/2 z-10"
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative bg-background border border-border rounded-lg shadow-lg p-3 max-w-[200px]">
            {/* Speech bubble arrow */}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-background border-r border-b border-border rotate-45" />
            
            <p className="text-xs font-medium mb-1">{transcript}</p>
            <Badge variant="secondary" className="text-[10px] px-1 py-0">
              (demo)
            </Badge>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};