"use client";

import Link from "next/link";
import { Mic, Heart, ShieldCheck, Globe } from "lucide-react";

export function V3Footer() {
  return (
    <footer className="bg-[#3D3229] text-[#FDF8F3] pt-16 pb-12 border-t border-[#3D3229]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#9E5D46] text-white flex items-center justify-center">
                <Mic className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Recall<span className="text-[#9E5D46]">.bio</span>
              </span>
            </Link>

            <p className="font-serif text-lg text-amber-100/90 italic">
              "Tu vida, tu voz, tu legado."
            </p>

            <p className="font-sans text-sm text-white/70 max-w-sm leading-relaxed">
              Plataforma de legado digital para preservar historias humanas a través de la voz, reflexiones diarias y custodia segura para herederos.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-semibold text-base text-amber-100">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <a href="#tapiz" className="hover:text-white transition-colors">
                  El Tapiz de Voces
                </a>
              </li>
              <li>
                <a href="#estudio" className="hover:text-white transition-colors">
                  Estudio de Grabación
                </a>
              </li>
              <li>
                <a href="#boveda" className="hover:text-white transition-colors">
                  Cápsula de Herederos
                </a>
              </li>
              <li>
                <a href="#precios" className="hover:text-white transition-colors">
                  Planes & Precios
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Security */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-semibold text-base text-amber-100">
              Privacidad & Seguridad
            </h4>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/es/privacy" className="hover:text-white transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/es/terms" className="hover:text-white transition-colors">
                  Términos del Servicio
                </Link>
              </li>
              <li>
                <span className="text-xs text-white/50 block mt-2">
                  Encriptación Supabase RLS • Servidores Seguros • Cumplimiento GDPR
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-white/50 gap-4">
          <p>© {new Date().getFullYear()} Recall.bio. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5 text-white/60">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-[#D4A5A5] fill-current" />
            <span>para preservar memorias familiares</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
