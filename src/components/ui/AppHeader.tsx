"use client";

import { motion } from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { AnimatedNavLink } from "./AnimatedNavLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "./MobileNav";
import { containerVariants, itemVariants } from "./animations";
import { StreakInfo } from "@/lib/streak";
import { StreakDisplay } from "./StreakDisplay";

interface NavItem {
  href: string;
  label: string;
}

interface AppHeaderProps {
  navItems: NavItem[];
  streak?: StreakInfo;
}

export function AppHeader({ navItems, streak }: AppHeaderProps) {
  return (
    <motion.header
      className="flex flex-col items-center gap-6 mb-8 md:flex-row md:items-center md:justify-between md:gap-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between w-full md:w-auto md:justify-start">
        <AnimatedLogo />
        <div className="flex items-center gap-3 md:hidden">
          {streak && (
            <StreakDisplay count={streak.count} isActiveToday={streak.isActiveToday} />
          )}
          <MobileNav navItems={navItems} streak={streak} />
        </div>
      </motion.div>

      {/* Navegación desktop - solo visible en md y superior */}
      <motion.nav
        className="hidden md:flex items-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {navItems.map((item) => (
          <motion.div key={item.href} variants={itemVariants}>
            <AnimatedNavLink href={item.href}>
              {item.label}
            </AnimatedNavLink>
          </motion.div>
        ))}

        <motion.div variants={itemVariants} className="flex items-center justify-center gap-6">
          {streak && (
            <StreakDisplay count={streak.count} isActiveToday={streak.isActiveToday} />
          )}
          <LanguageSwitcher />
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
