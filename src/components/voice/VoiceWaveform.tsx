import { motion } from "framer-motion";

interface VoiceWaveformProps {
  isListening: boolean;
}

export const VoiceWaveform: React.FC<VoiceWaveformProps> = ({ isListening }) => {
  if (!isListening) return null;

  const bars = [1, 2, 3, 4, 5];

  return (
    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 flex items-end gap-1">
      {bars.map((bar) => (
        <motion.div
          key={bar}
          className="w-1 bg-trophy-gold rounded-full"
          animate={{
            height: isListening ? [4, 16, 8, 20, 6] : [4],
            opacity: isListening ? [0.5, 1, 0.7, 1, 0.6] : [0],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: bar * 0.1,
            ease: "easeInOut",
          }}
          style={{ minHeight: "4px" }}
        />
      ))}
    </div>
  );
};