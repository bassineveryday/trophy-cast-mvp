import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AIShimmerToastProps {
  message: string;
  lakeName: string;
  show: boolean;
  onHide: () => void;
}

export const AIShimmerToast: React.FC<AIShimmerToastProps> = ({ 
  message, 
  lakeName, 
  show, 
  onHide 
}) => {
  const navigate = useNavigate();
  const [shimmerActive, setShimmerActive] = useState(false);

  useEffect(() => {
    if (show) {
      // Start shimmer animation
      setShimmerActive(true);
      
      // Auto-dismiss after 2 seconds
      const timer = setTimeout(() => {
        onHide();
      }, 2000);

      // Stop shimmer after animation completes
      const shimmerTimer = setTimeout(() => {
        setShimmerActive(false);
      }, 1000);

      return () => {
        clearTimeout(timer);
        clearTimeout(shimmerTimer);
      };
    }
  }, [show, onHide]);

  const handleClick = () => {
    navigate(`/ai-coach/tournament-plan?lake=${encodeURIComponent(lakeName)}`);
    onHide();
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
        >
          <motion.div
            onClick={handleClick}
            className="bg-background border border-border rounded-lg shadow-lg p-3 cursor-pointer hover:shadow-xl transition-all duration-300 min-w-[280px] relative overflow-hidden"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Shimmer overlay */}
            <AnimatePresence>
              {shimmerActive && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-trophy-gold/20 to-transparent"
                />
              )}
            </AnimatePresence>

            <div className="flex items-center space-x-3 relative z-10">
              {/* Pulsing AI Icon */}
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.8, 1, 0.8]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="w-8 h-8 rounded-full bg-gradient-to-r from-trophy-gold to-fishing-green flex items-center justify-center"
                >
                  <Brain className="w-4 h-4 text-white" />
                </motion.div>
                <span className="text-sm">🎣</span>
              </div>

              {/* Message */}
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-trophy-gold">
                    {message}
                  </span>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Check className="w-4 h-4 text-fishing-green" />
                  </motion.div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Tap to view updated plan
                </p>
              </div>
            </div>

            {/* Subtle border glow */}
            <div className="absolute inset-0 rounded-lg border border-trophy-gold/30 opacity-50" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};