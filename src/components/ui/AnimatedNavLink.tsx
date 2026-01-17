"use client";

import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import { usePathname } from "@/i18n/routing";

interface AnimatedNavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export function AnimatedNavLink({ href, children, className = "" }: AnimatedNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link href={href} className={`relative ${className}`}>
      <motion.span
        className={`text-sm font-medium transition-colors ${
          isActive
            ? "text-[var(--primary-terracotta)]"
            : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
        }`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {children}
      </motion.span>
      
      {isActive && (
        <motion.div
          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[var(--primary-terracotta)] rounded-full"
          layoutId="activeNav"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </Link>
  );
}
