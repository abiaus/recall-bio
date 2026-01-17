import type { ReactNode } from "react";

interface SettingsSectionProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function SettingsSection({
  title,
  subtitle,
  children,
}: SettingsSectionProps) {
  return (
    <div className="space-y-4 border-b border-[#D4C5B0] pb-6 last:border-b-0 last:pb-0">
      <div>
        <h2 className="font-serif text-xl font-semibold text-[#2B241B]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-sm text-[#5A4A3A]">{subtitle}</p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}
