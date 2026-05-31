const hits = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_HITS = 5;

export function rateLimit(key: string): boolean {
  const now = Date.now();
  const timestamps = hits.get(key)?.filter((t) => now - t < WINDOW_MS) ?? [];

  if (timestamps.length >= MAX_HITS) return false;

  timestamps.push(now);
  hits.set(key, timestamps);
  return true;
}
