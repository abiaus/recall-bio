"use client";

import { motion } from "framer-motion";
import { AnimatedLogo } from "./AnimatedLogo";
import { AnimatedNavLink } from "./AnimatedNavLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { MobileNav } from "./MobileNav";
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
      <motion.div variants={itemVariants} className="flex items-center justify-between w-full md:w-auto md:justify-start">
        <AnimatedLogo />
        {/* Menú hamburguesa - solo visible en móvil */}
        <MobileNav navItems={navItems} />
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

        <motion.div variants={itemVariants}>
          <LanguageSwitcher />
        </motion.div>
      </motion.nav>
    </motion.header>
  );
}
