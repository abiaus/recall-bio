import { createClient } from "@/lib/supabase/server";
import { LegacyManager } from "@/components/legacy/LegacyManager";

export default async function LegacyPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  // Get legacy access records where user is owner
  const { data: ownedLegacy } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .select("*")
    .eq("owner_user_id", user.id)
    .order("created_at", { ascending: false });

  // Get legacy access records where user is heir
  const { data: heirLegacy } = await supabase
    .schema("recallbio")
    .from("legacy_access")
    .select("*")
    .eq("heir_user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        Legado Digital
      </h1>
      <p className="text-[#5A4A3A]">
        Gestiona quién tendrá acceso a tus recuerdos en el futuro.
      </p>

      <LegacyManager
        ownedLegacy={ownedLegacy || []}
        heirLegacy={heirLegacy || []}
      />
    </div>
  );
}
