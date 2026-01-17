import type { ReactNode } from "react";
import { Playfair_Display, Outfit } from "next/font/google";
import "./globals.css";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

const playfair = Playfair_Display({
  variable: "--font-serif",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  // Root layout - must have html/body tags
  // The lang attribute will be set by the [locale] layout via suppressHydrationWarning
  return (
    <html suppressHydrationWarning>
      <body className={`${playfair.variable} ${outfit.variable} antialiased`}>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
