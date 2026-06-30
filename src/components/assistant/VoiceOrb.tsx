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
          scale: [1, 1.12, 1],
          boxShadow: [
            "0 0 0px rgba(59,130,246,0.4)",
            "0 0 28px rgba(59,130,246,0.7)",
            "0 0 0px rgba(59,130,246,0.4)",
          ],
        }
      : {}
  }
  transition={{
    duration: 1.5,
    repeat: listening ? Infinity : 0,
  }}
  onClick={onClick}
  className="
    flex
    h-16
    w-16
    items-center
    justify-center
    rounded-full
    bg-gradient-to-br
    from-blue-600
    via-indigo-600
    to-purple-600
    text-white
    shadow-2xl
    hover:shadow-blue-500/40
  "
>
  <Sparkles size={28} />
</motion.button>
  );
}