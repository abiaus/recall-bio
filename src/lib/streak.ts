export interface StreakInfo {
  count: number;
  isActiveToday: boolean;
}

export function calculateEffectiveStreak(
  currentStreakDb: number,
  lastActivityDateStr: string | null, // format: "YYYY-MM-DD"
  timezone: string | null
): StreakInfo {
  if (!lastActivityDateStr || currentStreakDb === 0) {
    return { count: 0, isActiveToday: false };
  }

  const tz = timezone || "UTC";

  let todayStr = "";
  try {
    // en-CA format produces YYYY-MM-DD
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: tz,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    todayStr = formatter.format(new Date());
  } catch (e) {
    // Fallback if timezone is invalid
    todayStr = new Date().toISOString().split("T")[0];
  }

  if (lastActivityDateStr === todayStr) {
    return { count: currentStreakDb, isActiveToday: true };
  }

  // Calculate yesterday's date string
  const todayDate = new Date(`${todayStr}T00:00:00Z`);
  const yesterdayDate = new Date(todayDate.getTime() - 24 * 60 * 60 * 1000);
  const yesterdayStr = yesterdayDate.toISOString().split("T")[0];

  if (lastActivityDateStr === yesterdayStr) {
    return { count: currentStreakDb, isActiveToday: false };
  }

  // If last activity is older than yesterday, the streak is broken (0)
  return { count: 0, isActiveToday: false };
}
