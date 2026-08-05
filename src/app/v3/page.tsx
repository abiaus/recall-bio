import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

export default function V3DirectPage() {
  redirect(`/${routing.defaultLocale}/v3`);
}
