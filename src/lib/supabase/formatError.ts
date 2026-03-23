/** PostgREST errors often log as `{}` in the console; extract fields explicitly. */
export function formatSupabaseError(err: unknown): Record<string, unknown> {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    return {
      message: e.message,
      code: e.code,
      details: e.details,
      hint: e.hint,
    };
  }
  return { message: String(err) };
}
