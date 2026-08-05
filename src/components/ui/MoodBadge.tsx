"use client";

import { motion } from "framer-motion";
import { Smile, Heart, Brain, Sunset, Sparkles, Zap, Frown, AlertCircle, AlertTriangle, Flame, UserX, Moon } from "lucide-react";

interface MoodBadgeProps {
  mood: string;
  size?: "sm" | "md" | "lg";
}

const moodConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  happy: { icon: <Smile className="w-4 h-4" />, color: "from-amber-500 to-amber-600", label: "Happy" },
  grateful: { icon: <Heart className="w-4 h-4" />, color: "from-[#9CAF88] to-[#6B8E60]", label: "Grateful" },
  contemplative: { icon: <Brain className="w-4 h-4" />, color: "from-[#B8A9C9] to-[#8B6F4E]", label: "Contemplative" },
  nostalgic: { icon: <Sunset className="w-4 h-4" />, color: "from-[#D4A5A5] to-[#C4907C]", label: "Nostalgic" },
  peaceful: { icon: <Sparkles className="w-4 h-4" />, color: "from-[#9CAF88] to-[#80996D]", label: "Peaceful" },
  excited: { icon: <Zap className="w-4 h-4" />, color: "from-[#C4907C] to-[#A67B5B]", label: "Excited" },
  sad: { icon: <Frown className="w-4 h-4" />, color: "from-[#6B5D4D] to-[#3D3229]", label: "Sad" },
  anxious: { icon: <AlertCircle className="w-4 h-4" />, color: "from-[#A67B5B] to-[#6B5D4D]", label: "Anxious" },
  stressed: { icon: <AlertTriangle className="w-4 h-4" />, color: "from-[#C4907C] to-[#8B6F4E]", label: "Stressed" },
  angry: { icon: <Flame className="w-4 h-4" />, color: "from-[#8B6F4E] to-[#3D3229]", label: "Angry" },
  lonely: { icon: <UserX className="w-4 h-4" />, color: "from-[#7C6C5B] to-[#524538]", label: "Lonely" },
  tired: { icon: <Moon className="w-4 h-4" />, color: "from-[#7C6C5B] to-[#3D3229]", label: "Tired" },
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
