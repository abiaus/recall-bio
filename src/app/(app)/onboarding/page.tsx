"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { createClient as createServerClient } from "@/lib/supabase/server";

export default function OnboardingPage() {
  const [lifeStage, setLifeStage] = useState<string>("");
  const [timezone, setTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/auth/login");
      return;
    }

    const { error } = await supabase
      .schema("recallbio")
      .from("profiles")
      .upsert({
        id: user.id,
        display_name: user.user_metadata?.display_name || "",
        life_stage: lifeStage,
        timezone,
      })
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      setLoading(false);
    } else {
      router.push("/app/today");
      router.refresh();
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        Bienvenido a Recall
      </h1>
      <p className="text-[#5A4A3A]">
        Cuéntanos un poco sobre ti para personalizar tu experiencia.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="lifeStage"
            className="block text-sm font-medium text-[#2B241B] mb-2"
          >
            Etapa de vida
          </label>
          <select
            id="lifeStage"
            value={lifeStage}
            onChange={(e) => setLifeStage(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          >
            <option value="">Selecciona una opción</option>
            <option value="teen">Adolescente</option>
            <option value="young_adult">Adulto joven</option>
            <option value="adult">Adulto</option>
            <option value="midlife">Mediana edad</option>
            <option value="senior">Adulto mayor</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="timezone"
            className="block text-sm font-medium text-[#2B241B] mb-2"
          >
            Zona horaria
          </label>
          <input
            id="timezone"
            type="text"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            required
            className="w-full px-4 py-2 rounded-lg border border-[#D4C5B0] bg-white text-[#2B241B] focus:outline-none focus:ring-2 focus:ring-[#8B7355] focus:border-transparent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#8B7355] text-white font-medium hover:bg-[#7A6345] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Guardando..." : "Continuar"}
        </button>
      </form>
    </div>
  );
}
