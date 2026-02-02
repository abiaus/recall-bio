"use client";

import { motion } from "framer-motion";
import { Smile, Heart, Brain, Sunset, Sparkles, Zap, Frown, AlertCircle, AlertTriangle, Flame, UserX, Moon } from "lucide-react";

interface MoodOption {
  value: string;
  label: string;
  icon: React.ReactNode;
  color: string;
}

interface MoodSelectorProps {
  value: string;
  onChange: (value: string) => void;
  t: {
    mood: string;
    moodPlaceholder: string;
    moodHappy: string;
    moodGrateful: string;
    moodContemplative: string;
    moodNostalgic: string;
    moodPeaceful: string;
    moodExcited: string;
    moodSad: string;
    moodAnxious: string;
    moodStressed: string;
    moodAngry: string;
    moodLonely: string;
    moodTired: string;
  };
}

const moodOptions: MoodOption[] = [
  { value: "happy", label: "Happy", icon: <Smile className="w-5 h-5" />, color: "from-yellow-400 to-orange-400" },
  { value: "grateful", label: "Grateful", icon: <Heart className="w-5 h-5" />, color: "from-pink-400 to-rose-400" },
  { value: "contemplative", label: "Contemplative", icon: <Brain className="w-5 h-5" />, color: "from-blue-400 to-indigo-400" },
  { value: "nostalgic", label: "Nostalgic", icon: <Sunset className="w-5 h-5" />, color: "from-purple-400 to-pink-400" },
  { value: "peaceful", label: "Peaceful", icon: <Sparkles className="w-5 h-5" />, color: "from-green-400 to-emerald-400" },
  { value: "excited", label: "Excited", icon: <Zap className="w-5 h-5" />, color: "from-orange-400 to-red-400" },
  { value: "sad", label: "Sad", icon: <Frown className="w-5 h-5" />, color: "from-blue-500 to-indigo-600" },
  { value: "anxious", label: "Anxious", icon: <AlertCircle className="w-5 h-5" />, color: "from-yellow-500 to-orange-500" },
  { value: "stressed", label: "Stressed", icon: <AlertTriangle className="w-5 h-5" />, color: "from-red-500 to-orange-600" },
  { value: "angry", label: "Angry", icon: <Flame className="w-5 h-5" />, color: "from-red-600 to-red-800" },
  { value: "lonely", label: "Lonely", icon: <UserX className="w-5 h-5" />, color: "from-gray-500 to-gray-700" },
  { value: "tired", label: "Tired", icon: <Moon className="w-5 h-5" />, color: "from-slate-500 to-slate-700" },
];

export function MoodSelector({ value, onChange, t }: MoodSelectorProps) {
  const getLabel = (val: string) => {
    const map: Record<string, string> = {
      happy: t.moodHappy,
      grateful: t.moodGrateful,
      contemplative: t.moodContemplative,
      nostalgic: t.moodNostalgic,
      peaceful: t.moodPeaceful,
      excited: t.moodExcited,
      sad: t.moodSad,
      anxious: t.moodAnxious,
      stressed: t.moodStressed,
      angry: t.moodAngry,
      lonely: t.moodLonely,
      tired: t.moodTired,
    };
    return map[val] || val;
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-[var(--text-primary)]">
        {t.mood}
      </label>
      <div className="flex flex-wrap gap-3">
        {moodOptions.map((mood) => {
          const isSelected = value === mood.value;
          return (
            <motion.button
              key={mood.value}
              type="button"
              onClick={() => onChange(isSelected ? "" : mood.value)}
              className={`relative px-4 py-3 rounded-2xl border-2 transition-all flex items-center gap-2 ${isSelected
                  ? "border-[var(--primary-terracotta)] bg-[var(--primary-terracotta)]/10"
                  : "border-[#D4C5B0] bg-white/80 hover:border-[var(--primary-terracotta)]/50"
                }`}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className={`text-white rounded-full p-1.5 bg-gradient-to-br ${mood.color}`}
                animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
                transition={{ duration: 0.3 }}
              >
                {mood.icon}
              </motion.div>
              <span className={`text-sm font-medium ${isSelected ? "text-[var(--primary-terracotta)]" : "text-[var(--text-secondary)]"}`}>
                {getLabel(mood.value)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
