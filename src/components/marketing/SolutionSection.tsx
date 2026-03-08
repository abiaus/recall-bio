"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useScrollAnimation } from "@/components/ui/useScrollAnimation";
import { HelpCircle, Mic, Users, Lock } from "lucide-react";

// Helper component to isolate state updates for the recording timer
function AnimatedTimer() {
  const [seconds, setSeconds] = useState(134); // Start at 02:14

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');

  return <span className="font-mono text-sm text-[#5A4A3A] w-12">{mins}:{secs}</span>;
}

export function SolutionSection() {
  const t = useTranslations("marketing.solution");
  const { ref, isInView } = useScrollAnimation();

  const features = [
    {
      key: "feature1",
      icon: <HelpCircle strokeWidth={1} />,
    },
    {
      key: "feature2",
      icon: <Mic strokeWidth={1} />,
    },
    {
      key: "feature3",
      icon: <Users strokeWidth={1} />,
    },
    {
      key: "feature4",
      icon: <Lock strokeWidth={1} />,
    },
  ];

  return (
    <section className="py-24 md:py-32 px-4" style={{ background: "var(--bg-warm)" }} ref={ref}>
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-24 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
        >
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-[#2B241B] mb-8 leading-[1.1] tracking-tight">
            {t("title")}
          </h2>
          <p className="text-xl md:text-2xl text-[#5A4A3A] font-serif italic leading-relaxed">
            {t("description")}
          </p>
        </motion.div>

        <div className="space-y-24 md:space-y-32">
          {features.map((feature, index) => {
            const isEven = index % 2 !== 0; // 0 is first item, odd in display
            return (
              <motion.div 
                key={feature.key} 
                className={`flex flex-col md:flex-row items-center gap-12 md:gap-20 ${isEven ? 'md:flex-row-reverse' : ''}`}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              >
                <div className="w-full md:w-1/2 relative">
                   <div className="aspect-[4/3] md:aspect-square bg-white rounded-2xl shadow-sm border border-[#D4C5B0]/30 flex items-center justify-center p-8 overflow-hidden group hover:border-[#D4C5B0]/80 hover:shadow-xl transition-all duration-700">
                      
                      {/* Interactive Micro-Interfaces instead of generic icons */}
                      {index === 0 && (
                        <div className="w-full h-full flex flex-col items-center justify-center mt-4">
                          <motion.div 
                            className="bg-[#F9F7F4] w-full max-w-sm rounded-xl p-6 border border-[#D4C5B0]/40 shadow-sm relative group-hover:-translate-y-2 transition-transform duration-700 ease-out"
                          >
                            <p className="text-[#8B7355] text-xs font-semibold tracking-widest uppercase mb-4 text-center">
                              {t("mockups.dailyQuestion.date")}
                            </p>
                            <p className="font-serif text-2xl md:text-3xl text-[#2B241B] leading-tight text-center italic mb-6">
                              {t("mockups.dailyQuestion.question")}
                            </p>
                            <div className="w-full h-10 border border-[#D4C5B0]/60 rounded-full flex items-center px-4 bg-white/50 text-[#8B7355] text-sm">
                              {t("mockups.dailyQuestion.placeholder")}
                            </div>
                            <motion.div 
                              className="absolute -bottom-4 right-6 w-12 h-12 bg-[var(--primary-terracotta)] rounded-full text-white flex items-center justify-center shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                              <Mic className="w-5 h-5" />
                            </motion.div>
                          </motion.div>
                        </div>
                      )}

                      {index === 1 && (
                        <div className="w-full h-full flex flex-col items-center justify-center relative">
                          <motion.div 
                            className="absolute inset-0 bg-gradient-to-b from-[#F6F1E7]/0 via-[#F6F1E7] to-[#F6F1E7]/0 z-10 pointer-events-none"
                            initial={{ opacity: 0.8 }}
                            whileHover={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                          />
                          <div className="w-full px-8 h-32 flex items-center justify-center gap-1.5 md:gap-2 group-hover:gap-3 transition-all duration-700 opacity-80 z-0">
                            {[40, 80, 50, 100, 70, 90, 40, 70, 30, 80, 100, 60, 40, 90, 50].map((height, i) => (
                              <motion.div 
                                key={i}
                                className="w-2 md:w-3 rounded-full bg-[var(--primary-terracotta)]"
                                initial={{ height: "4px" }}
                                animate={{ height: `${height}%` }}
                                transition={{ 
                                  duration: 1.2, 
                                  repeat: Infinity, 
                                  repeatType: "reverse", 
                                  ease: "easeInOut",
                                  delay: i * 0.08 
                                }}
                              />
                            ))}
                          </div>
                          <motion.div 
                            className="absolute bottom-12 mx-auto bg-white/90 backdrop-blur-md px-6 py-3 rounded-full border border-[#D4C5B0]/50 shadow-sm z-20 flex items-center gap-3"
                            group-hover={{ y: -10 }}
                          >
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            <AnimatedTimer />
                            <span className="text-[#8B7355] text-sm hidden md:inline ml-2">{t("mockups.audio.status")}</span>
                          </motion.div>
                        </div>
                      )}

                      {index === 2 && (
                        <div className="w-full h-full flex items-center justify-center relative">
                           <div className="absolute inset-0 border-[10px] border-[#F6F1E7] rounded-xl z-20 pointer-events-none"></div>
                           <motion.div 
                             className="w-full h-full object-cover bg-cover bg-center rounded-lg"
                             style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=2670&auto=format&fit=crop')", filter: "sepia(0.3) contrast(1.1) brightness(0.9)" }}
                             whileHover={{ scale: 1.05 }}
                             transition={{ duration: 1.5, ease: "easeOut" }}
                           />
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                           <div className="absolute bottom-6 left-6 z-20">
                             <p className="text-white/80 font-mono text-xs mb-1 uppercase tracking-widest">{t("mockups.legacy.badge")}</p>
                             <p className="font-serif text-white text-xl">{t("mockups.legacy.title")}</p>
                           </div>
                        </div>
                      )}

                      {index === 3 && (
                        <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
                           <motion.div 
                             className="w-full space-y-4 px-6 filter block"
                             initial={{ filter: "blur(8px)", opacity: 0.5 }}
                             whileHover={{ filter: "blur(0px)", opacity: 1 }}
                             transition={{ duration: 0.5 }}
                           >
                             <div className="h-4 bg-[#D4C5B0]/30 rounded w-3/4"></div>
                             <div className="h-4 bg-[#D4C5B0]/30 rounded w-full"></div>
                             <div className="h-4 bg-[#D4C5B0]/30 rounded w-5/6"></div>
                             <div className="h-4 bg-[#D4C5B0]/30 rounded w-4/5"></div>
                             <div className="h-4 bg-[#D4C5B0]/30 rounded w-full"></div>
                             <div className="h-4 bg-[#D4C5B0]/30 rounded w-2/3"></div>
                           </motion.div>
                           
                           <motion.div 
                             className="absolute inset-0 flex items-center justify-center pointer-events-none"
                             initial={{ opacity: 1, scale: 1 }}
                             whileHover={{ opacity: 0, scale: 0.9 }}
                             transition={{ duration: 0.3 }}
                           >
                              <div className="bg-[#2B241B] text-white p-6 rounded-2xl shadow-xl flex flex-col items-center gap-3">
                                 <Lock className="w-8 h-8 text-[var(--primary-terracotta)]" />
                                 <span className="font-serif text-lg">{t("mockups.privacy.badge")}</span>
                              </div>
                           </motion.div>
                        </div>
                      )}
                   </div>
                </div>
                
                <div className="w-full md:w-1/2">
                  <span className="text-[var(--primary-terracotta)] font-semibold tracking-wider uppercase text-sm mb-4 block">
                    0{index + 1}
                  </span>
                  <h3 className="font-serif text-3xl md:text-4xl font-bold text-[#2B241B] mb-6 leading-tight">
                    {t(`${feature.key}.title`)}
                  </h3>
                  <p className="text-lg text-[#5A4A3A] leading-relaxed">
                    {t(`${feature.key}.description`)}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
