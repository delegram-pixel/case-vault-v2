/**
 * Minimal in-memory sliding-window rate limiter. Sufficient for a single
 * instance / demo. For multi-instance production, back this with Redis
 * (e.g. @upstash/ratelimit) — same call signature.
 */
const hits = new Map<string, number[]>();

export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 10_000
): { ok: boolean; remaining: number } {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs);

  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, remaining: 0 };
  }

  recent.push(now);
  hits.set(key, recent);
  return { ok: true, remaining: limit - recent.length };
}
