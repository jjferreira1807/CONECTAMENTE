/**
 * Token-bucket rate limiter — in-memory.
 *
 * IMPORTANT: This is process-local. On Vercel serverless, each cold start
 * starts with a fresh bucket; on multiple replicas, buckets aren't shared.
 * It's a safety net, not a precise quota. For production-grade limiting,
 * point this at Upstash Redis (`@upstash/ratelimit`) — drop-in replacement.
 */
type Bucket = { tokens: number; updatedAt: number };

const buckets = new Map<string, Bucket>();

interface Limit {
  /** Tokens per window. */
  capacity: number;
  /** Window in milliseconds. */
  windowMs: number;
}

export function rateLimit(key: string, limit: Limit): { allowed: boolean; remaining: number; resetMs: number } {
  const now = Date.now();
  const refillRate = limit.capacity / limit.windowMs; // tokens per ms
  const b = buckets.get(key) ?? { tokens: limit.capacity, updatedAt: now };

  // Refill
  const elapsed = now - b.updatedAt;
  b.tokens = Math.min(limit.capacity, b.tokens + elapsed * refillRate);
  b.updatedAt = now;

  if (b.tokens < 1) {
    buckets.set(key, b);
    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.ceil((1 - b.tokens) / refillRate),
    };
  }

  b.tokens -= 1;
  buckets.set(key, b);
  return { allowed: true, remaining: Math.floor(b.tokens), resetMs: 0 };
}

/** Compose a rate-limit key from request signal + scope. */
export function rlKey(scope: string, ...parts: (string | undefined | null)[]) {
  return [scope, ...parts.filter(Boolean)].join(":");
}

/** Default limits per scope. Tune as needed. */
export const RATE_LIMITS = {
  authBurst:  { capacity: 5,   windowMs: 60_000 }, // 5 req/min
  write:      { capacity: 60,  windowMs: 60_000 },
  read:       { capacity: 240, windowMs: 60_000 },
  analytics:  { capacity: 600, windowMs: 60_000 },
} as const;
