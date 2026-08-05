"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, ShieldCheck, Heart, Sparkles, Menu, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface V3NavbarProps {
  locale?: string;
}

export function V3Navbar({ locale = "es" }: V3NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState(locale);

  const isEs = currentLang === "es";

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#FDF8F3]/85 border-b border-[#F7EDE4] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href={`/${currentLang}`} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-[#9E5D46] text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-300">
            <Mic className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold text-[#3D3229] tracking-tight group-hover:text-[#9E5D46] transition-colors">
              Recall<span className="text-[#9E5D46]">.bio</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#9B8B7A] font-medium font-sans">
              {isEs ? "Santuario de Legado" : "Legacy Sanctuary"}
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          <a
            href="#tapiz"
            className="text-sm font-medium text-[#6B5D4D] hover:text-[#9E5D46] transition-colors"
          >
            {isEs ? "El Tapiz de Voces" : "Memory Quilt"}
          </a>
          <a
            href="#estudio"
            className="text-sm font-medium text-[#6B5D4D] hover:text-[#9E5D46] transition-colors"
          >
            {isEs ? "Estudio de Grabación" : "Voice Studio"}
          </a>
          <a
            href="#boveda"
            className="text-sm font-medium text-[#6B5D4D] hover:text-[#9E5D46] transition-colors"
          >
            {isEs ? "Cápsula de Herederos" : "Heir Vault"}
          </a>
          <a
            href="#precios"
            className="text-sm font-medium text-[#6B5D4D] hover:text-[#9E5D46] transition-colors"
          >
            {isEs ? "Planes" : "Pricing"}
          </a>
        </nav>

        {/* Right CTA Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={`/${currentLang === "es" ? "en" : "es"}/v3`}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#6B5D4D] bg-[#F7EDE4] px-3 py-2 rounded-xl hover:bg-[#E8EDE5] transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{currentLang === "es" ? "EN" : "ES"}</span>
          </Link>

          <Link
            href={`/${currentLang}/auth/login`}
            className="text-sm font-medium text-[#3D3229] hover:text-[#9E5D46] px-4 py-2 transition-colors"
          >
            {isEs ? "Iniciar sesión" : "Log in"}
          </Link>

          <Link
            href={`/${currentLang}/auth/signup`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#9E5D46] hover:bg-[#854B36] text-white font-medium text-sm transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{isEs ? "Crear mi archivo" : "Start your vault"}</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#3D3229] hover:bg-[#F7EDE4] transition-colors"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-[#F7EDE4] bg-[#FDF8F3] px-4 py-6 space-y-4 shadow-xl"
          >
            <a
              href="#tapiz"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#3D3229] hover:text-[#9E5D46]"
            >
              {isEs ? "El Tapiz de Voces" : "Memory Quilt"}
            </a>
            <a
              href="#estudio"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#3D3229] hover:text-[#9E5D46]"
            >
              {isEs ? "Estudio de Grabación" : "Voice Studio"}
            </a>
            <a
              href="#boveda"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#3D3229] hover:text-[#9E5D46]"
            >
              {isEs ? "Cápsula de Herederos" : "Heir Vault"}
            </a>
            <a
              href="#precios"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-base font-medium text-[#3D3229] hover:text-[#9E5D46]"
            >
              {isEs ? "Planes" : "Pricing"}
            </a>
            <div className="pt-4 border-t border-[#F7EDE4] flex flex-col gap-3">
              <Link
                href={`/${currentLang}/auth/signup`}
                className="w-full text-center px-5 py-3 rounded-2xl bg-[#9E5D46] text-white font-medium text-base shadow-sm"
              >
                {isEs ? "Crear mi archivo gratis" : "Start your free vault"}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
