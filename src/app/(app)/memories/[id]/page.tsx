import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MemoryDetail } from "@/components/memories/MemoryDetail";

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    notFound();
  }

  const { data: memory } = await supabase
    .schema("recallbio")
    .from("memories")
    .select(
      "id, title, content_text, mood, prompt_date, created_at, questions!inner(text)"
    )
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!memory) {
    notFound();
  }

  return <MemoryDetail memory={memory} />;
}
