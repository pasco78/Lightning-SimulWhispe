// Rate limiter utility for API requests

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

class RateLimiter {
  private limits: Map<string, RateLimitEntry>;
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 60, windowMs: number = 60000) {
    this.limits = new Map();
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  check(key: string): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const entry = this.limits.get(key);

    // Clean up old entries periodically
    this.cleanup();

    if (!entry || now > entry.resetTime) {
      // New window
      const resetTime = now + this.windowMs;
      this.limits.set(key, {
        count: 1,
        resetTime,
      });

      return {
        allowed: true,
        remaining: this.maxRequests - 1,
        resetTime,
      };
    }

    if (entry.count >= this.maxRequests) {
      // Rate limit exceeded
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;
    this.limits.set(key, entry);

    return {
      allowed: true,
      remaining: this.maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.limits.entries()) {
      if (now > entry.resetTime) {
        this.limits.delete(key);
      }
    }
  }

  reset(key: string) {
    this.limits.delete(key);
  }

  resetAll() {
    this.limits.clear();
  }
}

// Singleton instance for API rate limiting
const apiRateLimiter = new RateLimiter(
  parseInt(process.env.RATE_LIMIT_RPM || '60'),
  60000 // 1 minute window
);

export { RateLimiter, apiRateLimiter };
