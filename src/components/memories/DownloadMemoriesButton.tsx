"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { exportMemoriesToZip } from "@/server/actions/exportMemories";
import { GlowButton } from "@/components/ui/GlowButton";

export function DownloadMemoriesButton() {
  const t = useTranslations("memories");
  const locale = useLocale();
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDownload = async () => {
    setIsDownloading(true);
    setError(null);

    try {
      const result = await exportMemoriesToZip(locale);

      if (!result.success || !result.zipBuffer) {
        setError(result.error || t("downloadError"));
        setIsDownloading(false);
        return;
      }

      // Convertir Buffer a Blob para descargar
      const blob = new Blob([result.zipBuffer], { type: "application/zip" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;

      // Nombre del archivo con fecha actual
      const today = new Date();
      const dateStr = today.toISOString().split("T")[0];
      link.download = `memorias-${dateStr}.zip`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setIsDownloading(false);
    } catch (err) {
      console.error("Error downloading memories:", err);
      setError(t("downloadError"));
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <GlowButton
        type="button"
        variant="primary"
        onClick={handleDownload}
        disabled={isDownloading}
        className="flex items-center gap-2"
      >
        {isDownloading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>{t("downloading")}</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>{t("downloadMemories")}</span>
          </>
        )}
      </GlowButton>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
