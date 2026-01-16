import { createClient } from "@/lib/supabase/server";
import { MemoryList } from "@/components/memories/MemoryList";

export default async function MemoriesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const { data: memories } = await supabase
    .schema("recallbio")
    .from("memories")
    .select(
      "id, title, content_text, mood, prompt_date, created_at, questions!inner(text)"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        Mis Recuerdos
      </h1>
      <MemoryList memories={memories || []} />
    </div>
  );
}
