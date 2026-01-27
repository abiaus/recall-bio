"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { AnimatedNavLink } from "./AnimatedNavLink";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { itemVariants } from "./animations";

interface NavItem {
  href: string;
  label: string;
}

interface MobileNavProps {
  navItems: NavItem[];
}

export function MobileNav({ navItems }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Prevenir scroll del body cuando el drawer está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Cerrar drawer cuando se hace click en un link
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Botón hamburguesa - solo visible en móvil */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/50 transition-colors"
        aria-label="Abrir menú de navegación"
      >
        <Menu className="w-6 h-6" />
      </button>

      {/* Overlay y Drawer */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay oscuro */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer desde la derecha */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 md:hidden overflow-y-auto"
            >
              <div className="flex flex-col h-full">
                {/* Header del drawer */}
                <div className="flex items-center justify-between p-6 border-b border-[#D4C5B0]/30">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-lg text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-warm)] transition-colors"
                    aria-label="Cerrar menú"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                {/* Contenido del drawer */}
                <nav className="flex-1 px-6 py-8 space-y-6">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      onClick={handleLinkClick}
                    >
                      <AnimatedNavLink
                        href={item.href}
                        className="block py-3 text-base font-medium"
                      >
                        {item.label}
                      </AnimatedNavLink>
                    </motion.div>
                  ))}

                  {/* Separador */}
                  <div className="pt-4 border-t border-[#D4C5B0]/30">
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: navItems.length * 0.1 }}
                      className="space-y-3"
                    >

                      <LanguageSwitcher />
                    </motion.div>
                  </div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
