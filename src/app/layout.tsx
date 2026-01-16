import type { ReactNode } from "react";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Root layout - just pass through children
  // The [locale] layout will handle html/body tags
  return children;
}
