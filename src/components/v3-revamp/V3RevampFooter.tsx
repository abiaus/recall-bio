"use client";

import Link from "next/link";
import { Mic, Heart, ShieldCheck } from "lucide-react";

export function V3RevampFooter() {
  return (
    <footer className="bg-transparent text-[#FDF8F3] pt-16 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#E07A5F] text-white flex items-center justify-center shadow-lg">
                <Mic className="w-5 h-5" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Recall<span className="text-[#E07A5F]">.bio</span>
              </span>
            </Link>

            <p className="font-serif text-lg text-amber-200/90 italic">
              "Tu vida, tu voz, tu legado."
            </p>

            <p className="font-sans text-sm text-amber-100/70 max-w-sm leading-relaxed">
              Bóveda digital de legado sonoro para preservar historias humanas a través de la voz, reflexiones diarias y custodia para herederos.
            </p>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="font-serif font-semibold text-base text-amber-200">
              Navegación
            </h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
              <li>
                <a href="#experiencia" className="hover:text-white transition-colors">
                  Experiencia Sonora
                </a>
              </li>
              <li>
                <a href="#matriz" className="hover:text-white transition-colors">
                  Matriz de Memorias
                </a>
              </li>
              <li>
                <a href="#laboratorio" className="hover:text-white transition-colors">
                  Laboratorio de Voz
                </a>
              </li>
              <li>
                <a href="#herederos" className="hover:text-white transition-colors">
                  Terminal de Herederos
                </a>
              </li>
              <li>
                <a href="#membresia" className="hover:text-white transition-colors">
                  Membresía & Planes
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="font-serif font-semibold text-base text-amber-200">
              Privacidad & Seguridad
            </h4>
            <ul className="space-y-2 text-sm text-amber-100/70">
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
                <span className="text-xs text-amber-100/50 block mt-2">
                  Encriptación Supabase RLS • Servidores Seguros • Cumplimiento GDPR
                </span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-amber-100/50 gap-4">
          <p>© {new Date().getFullYear()} Recall.bio. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5 text-amber-100/60">
            <span>Hecho con</span>
            <Heart className="w-3.5 h-3.5 text-[#E07A5F] fill-current" />
            <span>para preservar memorias familiares</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
