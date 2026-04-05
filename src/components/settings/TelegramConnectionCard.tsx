"use client";

import { useEffect, useState } from "react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Loader2, Send, ExternalLink, Unplug, Pause, Play } from "lucide-react";
import { useTranslations } from "next-intl";
import { 
  getTelegramConnectionStatus, 
  generateTelegramLinkToken, 
  unlinkTelegram, 
  toggleTelegramPause,
  type TelegramConnectionStatus 
} from "@/server/actions/telegram";

export function TelegramConnectionCard() {
  const [status, setStatus] = useState<TelegramConnectionStatus>({ linked: false });
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [deepLink, setDeepLink] = useState<string | null>(null);

  // In real implementation we could poll the status if they opened the link, 
  // but for MVP we will just fetch on mount.
  useEffect(() => {
    async function loadStatus() {
      const current = await getTelegramConnectionStatus();
      setStatus(current);
      setIsLoading(false);
    }
    loadStatus();
  }, []);

  const handleGenerateLink = async () => {
    setIsGenerating(true);
    const { success, deepLink, error } = await generateTelegramLinkToken();
    if (success && deepLink) {
      setDeepLink(deepLink);
    } else {
      console.error(error);
      alert("No se pudo generar el enlace: " + error);
    }
    setIsGenerating(false);
  };

  const handleUnlink = async () => {
    if (!confirm("¿Estás seguro de que deseas desconectar Telegram? Tus recuerdos guardados no se borrarán, pero el bot dejará de funcionar.")) return;
    
    setIsActionLoading(true);
    const { success } = await unlinkTelegram();
    if (success) {
      setStatus({ linked: false });
    }
    setIsActionLoading(false);
  };

  const handleTogglePause = async () => {
    const willPause = status.status !== "paused";
    setIsActionLoading(true);
    const { success } = await toggleTelegramPause(willPause);
    if (success) {
      setStatus(prev => ({ ...prev, status: willPause ? "paused" : "active" }));
    }
    setIsActionLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-6 border border-[var(--bg-warm)] rounded-2xl bg-white/70">
        <Loader2 className="w-5 h-5 animate-spin text-[var(--primary-terracotta)]" />
      </div>
    );
  }

  const isPaused = status.status === "paused";

  return (
    <div className="space-y-4 p-5 rounded-2xl bg-white/70 border border-[var(--bg-warm)] mt-4">
      <div className="flex items-center gap-3">
        <div className="bg-[#2AABEE]/10 p-2 rounded-xl">
          <Send className="w-5 h-5 text-[#2AABEE]" />
        </div>
        <div>
          <h3 className="font-semibold text-base text-[var(--text-primary)]">Telegram Bot</h3>
          <p className="text-sm text-[var(--text-secondary)]">Captura memorias mediante mensajes de voz y texto diarios.</p>
        </div>
      </div>

      {!status.linked ? (
        <div className="space-y-4 pt-2">
          {!deepLink ? (
            <GlowButton
              onClick={handleGenerateLink}
              disabled={isGenerating}
              className="w-full sm:w-auto text-sm"
              variant="secondary"
            >
              {isGenerating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Vincular cuenta de Telegram
            </GlowButton>
          ) : (
            <div className="p-4 bg-[var(--bg-warm)] rounded-xl border border-[var(--primary-terracotta)]/20 space-y-3">
              <p className="text-sm text-[var(--text-primary)] font-medium">1. Abre el enlace en tu dispositivo con Telegram</p>
              
              <a href={deepLink} target="_blank" rel="noopener noreferrer" className="block">
                <GlowButton variant="ghost" className="w-full bg-white text-sm">
                  <div className="flex items-center justify-center">
                    Abrir Telegram <ExternalLink className="ml-2 w-4 h-4" />
                  </div>
                </GlowButton>
              </a>
              <p className="text-xs text-[var(--text-muted)] mt-2">
                2. Pulsa en &quot;Start&quot; o &quot;Iniciar&quot; dentro del bot y luego recarga esta página.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 pt-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-3 bg-white border border-[var(--bg-warm)] rounded-xl shadow-sm">
            <div>
              <p className="text-sm font-medium">Estado: <span className={isPaused ? "text-amber-500" : "text-green-600"}>{isPaused ? "Pausado" : "Activo"}</span></p>
              {status.username && <p className="text-xs text-[var(--text-muted)] mt-1">Conectado como @{status.username}</p>}
            </div>
            
            <div className="flex flex-wrap gap-2">
              <GlowButton 
                variant="ghost" 
                onClick={handleTogglePause} 
                disabled={isActionLoading}
                className="text-xs px-3 py-2 border-transparent hover:border-transparent"
              >
                {isPaused ? <><Play className="w-4 h-4 mr-1"/> Reanudar</> : <><Pause className="w-4 h-4 mr-1"/> Pausar</>}
              </GlowButton>
              <GlowButton 
                variant="ghost" 
                onClick={handleUnlink}
                disabled={isActionLoading}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 text-xs px-3 py-2 border-transparent hover:border-transparent"
              >
                <Unplug className="w-4 h-4 mr-1"/> Desvincular
              </GlowButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
