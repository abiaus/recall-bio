"use client";

import { motion } from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { AnimatedNavLink } from "./AnimatedNavLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { containerVariants, itemVariants } from "./animations";

interface NavItem {
  href: string;
  label: string;
}

interface AppHeaderProps {
  navItems: NavItem[];
}

export function AppHeader({ navItems }: AppHeaderProps) {
  return (
    <motion.header
      className="flex flex-col items-center gap-6 mb-8 md:flex-row md:items-center md:justify-between md:gap-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex justify-center md:justify-start">
        <AnimatedLogo />
      </motion.div>

      <motion.nav
        className="flex items-center gap-4 md:gap-8 flex-wrap justify-center"
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
        
        <motion.div variants={itemVariants}>
          <LanguageSwitcher />
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
