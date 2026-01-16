import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import { MemoryDetail } from "@/components/memories/MemoryDetail";

export default async function MemoryDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
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
