"use client";

import { useState } from "react";
import Link from "next/link";
import { Mic, Sparkles, ShieldCheck, Globe, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function V3RevampHeader({ locale = "es" }: { locale?: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const isEs = locale === "es";

  return (
    <header className="sticky top-0 z-50 bg-[#1C1612]/90 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo */}
        <Link href={`/${locale}`} className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#E07A5F] to-[#C4907C] text-white flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
            <Mic className="w-5.5 h-5.5 stroke-[2.2]" />
          </div>
          <div className="flex flex-col">
            <span className="font-serif text-2xl font-bold text-[#FDF8F3] tracking-tight group-hover:text-[#E07A5F] transition-colors">
              Recall<span className="text-[#E07A5F]">.bio</span>
            </span>
            <span className="text-[10px] uppercase tracking-widest text-[#C4907C] font-semibold">
              {isEs ? "Bóveda de Legado Sonoro" : "Sonic Legacy Vault"}
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-amber-100/80">
          <a href="#experiencia" className="hover:text-white transition-colors">
            {isEs ? "Experiencia Sonora" : "Sonic Experience"}
          </a>
          <a href="#matriz" className="hover:text-white transition-colors">
            {isEs ? "Matriz de Memorias" : "Memory Matrix"}
          </a>
          <a href="#laboratorio" className="hover:text-white transition-colors">
            {isEs ? "Laboratorio de Voz" : "Voice Lab"}
          </a>
          <a href="#herederos" className="hover:text-white transition-colors">
            {isEs ? "Terminal de Herederos" : "Heir Terminal"}
          </a>
          <a href="#membresia" className="hover:text-white transition-colors">
            {isEs ? "Membresía" : "Membership"}
          </a>
        </nav>

        {/* Right CTA */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href={`/${isEs ? "en" : "es"}/v3`}
            className="flex items-center gap-1.5 text-xs font-semibold text-amber-100/90 bg-white/10 px-3 py-2 rounded-xl hover:bg-white/20 transition-colors border border-white/10"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isEs ? "EN" : "ES"}</span>
          </Link>

          <Link
            href={`/${locale}/auth/signup`}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#E07A5F] to-[#A67B5B] hover:opacity-90 text-white font-semibold text-sm transition-all shadow-lg active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-amber-200" />
            <span>{isEs ? "Crear mi archivo" : "Start your vault"}</span>
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-xl text-amber-100 hover:bg-white/10 transition-colors"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#1C1612] px-6 py-6 border-b border-white/10 space-y-4"
          >
            <a href="#experiencia" onClick={() => setMenuOpen(false)} className="block text-base text-amber-100">
              {isEs ? "Experiencia Sonora" : "Sonic Experience"}
            </a>
            <a href="#matriz" onClick={() => setMenuOpen(false)} className="block text-base text-amber-100">
              {isEs ? "Matriz de Memorias" : "Memory Matrix"}
            </a>
            <a href="#laboratorio" onClick={() => setMenuOpen(false)} className="block text-base text-amber-100">
              {isEs ? "Laboratorio de Voz" : "Voice Lab"}
            </a>
            <a href="#herederos" onClick={() => setMenuOpen(false)} className="block text-base text-amber-100">
              {isEs ? "Terminal de Herederos" : "Heir Terminal"}
            </a>
            <Link
              href={`/${locale}/auth/signup`}
              className="w-full block text-center py-3 rounded-2xl bg-[#E07A5F] text-white font-semibold"
            >
              {isEs ? "Crear mi archivo gratis" : "Start free vault"}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
