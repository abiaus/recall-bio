import { redirect } from "next/navigation";
import { localePath } from "@/i18n/routing";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  redirect(localePath("/app/today", locale));
}
