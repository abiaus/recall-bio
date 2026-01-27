export type LifeStage = "teen" | "young_adult" | "adult" | "midlife" | "senior";

/** life_stage en questions puede ser string, string[] (varios) o null (genérica). */
export function questionLifeStageMatch(
  qLifeStage: string | string[] | null | undefined,
  userLifeStage: string
): "match" | "generic" | "no_match" {
  if (qLifeStage == null) return "generic";
  if (Array.isArray(qLifeStage)) {
    if (qLifeStage.length === 0) return "generic";
    return qLifeStage.includes(userLifeStage) ? "match" : "no_match";
  }
  return qLifeStage === userLifeStage ? "match" : "no_match";
}

export function stableDailySeed(userId: string, isoDate: string): number {
  // Seed determinista simple (MVP). En V1.5 se puede reemplazar por una función hash.
  let acc = 0;
  const s = `${userId}:${isoDate}`;
  for (let i = 0; i < s.length; i++) {
    acc = (acc * 31 + s.charCodeAt(i)) >>> 0;
  }
  return acc;
}

export function pickWeighted<T>(
  items: Array<{ item: T; weight: number }>,
  seed: number
): T {
  const total = items.reduce((sum, x) => sum + Math.max(0, x.weight), 0);
  const r = (seed % Math.max(1, total)) + 1;
  let cum = 0;
  for (const x of items) {
    cum += Math.max(0, x.weight);
    if (r <= cum) return x.item;
  }
  return items[items.length - 1]?.item ?? items[0]?.item;
}
