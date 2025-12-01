import { kv } from "@vercel/kv";

export async function rateLimit(ip: string, limit = 10, window = 60) {
  const key = `ratelimit_${ip}`;
  const current = await kv.incr(key); // increments count

  if (current === 1) {
    await kv.expire(key, window); // expire after window seconds
  }

  return current > limit; // returns true if rate limit exceeded
}
