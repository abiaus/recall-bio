import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const routing = defineRouting({
    locales: ["en", "es"],
    defaultLocale: "en",
    localePrefix: "as-needed",
    localeDetection: true,
});

export const { Link, redirect, usePathname, useRouter } =
    createNavigation(routing);

/** Path must start with /. Default locale has no URL prefix (e.g. en → /auth/login, es → /es/auth/login). */
export function localePath(path: string, locale: string): string {
    if (!path.startsWith("/")) {
        throw new Error("localePath: path must start with /");
    }
    return locale === routing.defaultLocale ? path : `/${locale}${path}`;
}

/** Infer locale from URL pathname (first segment if it is a configured locale). */
export function localeFromPathname(pathname: string): string {
    const first = pathname.split("/").filter(Boolean)[0];
    if (first && routing.locales.includes(first as (typeof routing.locales)[number])) {
        return first;
    }
    return routing.defaultLocale;
}
