import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";

interface ViewToggleProps {
  isDetailedView: boolean;
  onToggle: (detailed: boolean) => void;
}

export const ViewToggle = ({ isDetailedView, onToggle }: ViewToggleProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="px-6 py-4 flex items-center justify-between bg-muted/20 border-b border-border/30"
    >
      <h2 className="text-lg font-bold">Dashboard View</h2>
      <div className="flex items-center space-x-3">
        <span className={`text-sm font-medium transition-colors ${!isDetailedView ? 'text-primary' : 'text-muted-foreground'}`}>
          Simple
        </span>
        <Switch
          checked={isDetailedView}
          onCheckedChange={onToggle}
          className="data-[state=checked]:bg-primary"
        />
        <span className={`text-sm font-medium transition-colors ${isDetailedView ? 'text-primary' : 'text-muted-foreground'}`}>
          Detailed
        </span>
      </div>
    </motion.div>
  );
};