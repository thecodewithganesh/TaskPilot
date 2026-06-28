import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

interface VoiceOrbProps {
  listening: boolean;
  onClick: () => void;
}

export function VoiceOrb({
  listening,
  onClick,
}: VoiceOrbProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      animate={
        listening
          ? {
              scale: [1, 1.15, 1],
            }
          : {}
      }
      transition={{
        duration: 1.2,
        repeat: listening ? Infinity : 0,
      }}
      onClick={onClick}
      className="
      h-16
      w-16
      rounded-full
      bg-gradient-to-br
      from-blue-500
      via-indigo-500
      to-purple-600
      text-white
      shadow-2xl
      shadow-blue-500/40
      flex
      items-center
      justify-center
      "
    >
      <Sparkles size={30} />
    </motion.button>
  );
}