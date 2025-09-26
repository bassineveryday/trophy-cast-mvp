import { RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Loading..." }: LoadingSpinnerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className="absolute top-0 left-0 right-0 z-50 flex justify-center pt-4"
    >
      <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full flex items-center space-x-2">
        <RefreshCw className="w-4 h-4 animate-spin" />
        <span className="text-sm font-medium">{message}</span>
      </div>
    </motion.div>
  );
};