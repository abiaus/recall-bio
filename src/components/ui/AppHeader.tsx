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
      className="flex items-center justify-between mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <AnimatedLogo />
      </motion.div>

      <motion.nav
        className="flex items-center gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {navItems.map((item, index) => (
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
