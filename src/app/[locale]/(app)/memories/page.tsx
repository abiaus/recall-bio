import { createClient } from "@/lib/supabase/server";
import { MemoryList } from "@/components/memories/MemoryList";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function MemoriesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("memories");
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/auth/login`);
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
        {t("title")}
      </h1>
      <MemoryList memories={memories || []} />
    </div>
  );
}
