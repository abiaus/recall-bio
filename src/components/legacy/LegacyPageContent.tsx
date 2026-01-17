"use client";

import { motion } from "framer-motion";
import { LegacyManager } from "./LegacyManager";
import { containerVariants, itemVariants } from "@/components/ui/animations";

interface LegacyAccess {
  id: string;
  owner_user_id: string;
  heir_email: string;
  heir_user_id: string | null;
  relationship: string | null;
  status: string;
  release_mode: string;
  effective_at: string | null;
  created_at: string;
}

interface LegacyPageContentProps {
  title: string;
  subtitle: string;
  ownedLegacy: LegacyAccess[];
  heirLegacy: LegacyAccess[];
}

export function LegacyPageContent({
  title,
  subtitle,
  ownedLegacy,
  heirLegacy,
}: LegacyPageContentProps) {
  return (
    <motion.div
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-4xl font-bold text-[var(--text-primary)]">
          {title}
        </h1>
        <p className="text-[var(--text-secondary)] text-lg mt-2">{subtitle}</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <LegacyManager ownedLegacy={ownedLegacy} heirLegacy={heirLegacy} />
      </motion.div>
    </motion.div>
  );
}
