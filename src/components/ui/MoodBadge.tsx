"use client";

import { motion } from "framer-motion";
import { Smile, Heart, Brain, Sunset, Sparkles, Zap } from "lucide-react";

interface MoodBadgeProps {
  mood: string;
  size?: "sm" | "md" | "lg";
}

const moodConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  happy: { icon: <Smile className="w-4 h-4" />, color: "from-yellow-400 to-orange-400", label: "Happy" },
  grateful: { icon: <Heart className="w-4 h-4" />, color: "from-pink-400 to-rose-400", label: "Grateful" },
  contemplative: { icon: <Brain className="w-4 h-4" />, color: "from-blue-400 to-indigo-400", label: "Contemplative" },
  nostalgic: { icon: <Sunset className="w-4 h-4" />, color: "from-purple-400 to-pink-400", label: "Nostalgic" },
  peaceful: { icon: <Sparkles className="w-4 h-4" />, color: "from-green-400 to-emerald-400", label: "Peaceful" },
  excited: { icon: <Zap className="w-4 h-4" />, color: "from-orange-400 to-red-400", label: "Excited" },
};

export function MoodBadge({ mood, size = "md" }: MoodBadgeProps) {
  const config = moodConfig[mood];
  if (!config) return null;

  const sizeClasses = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-12 h-12 text-base",
  };

  return (
    <motion.div
      className={`relative ${sizeClasses[size]}`}
      whileHover={{ scale: 1.1, rotate: [0, -5, 5, 0] }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={`w-full h-full rounded-full bg-gradient-to-br ${config.color} flex items-center justify-center text-white shadow-md`}
        style={{
          clipPath: "polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%)",
        }}
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        {config.icon}
      </motion.div>
    </motion.div>
  );
}
