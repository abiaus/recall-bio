import { createClient } from "@/lib/supabase/server";
import { getOrAssignDailyPrompt } from "@/server/actions/dailyPrompt";
import { MemoryComposer } from "@/components/memories/MemoryComposer";

export default async function TodayPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>No autenticado</div>;
  }

  const prompt = await getOrAssignDailyPrompt(user.id);

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold text-[#2B241B]">
        Tu Prompt del Día
      </h1>

      {prompt ? (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[#F6F1E7] border border-[#D4C5B0]">
            <p className="font-serif text-xl text-[#2B241B] leading-relaxed">
              {prompt.text}
            </p>
          </div>

          <MemoryComposer questionId={prompt.question_id} />
        </div>
      ) : (
        <p className="text-[#5A4A3A]">
          No hay preguntas disponibles en este momento.
        </p>
      )}
    </div>
  );
}
