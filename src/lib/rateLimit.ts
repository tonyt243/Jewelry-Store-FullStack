type RateLimitEntry = {
  count: number;
  resetTime: number;
};

const rateLimitMap = new Map<string, RateLimitEntry>();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}, 10 * 60 * 1000);

export interface RateLimitConfig {
  limit: number;      // Number of requests allowed
  windowMs: number;   // Time window in milliseconds
}

export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = { limit: 5, windowMs: 60000 } // Default: 5 requests per minute
): { success: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const entry = rateLimitMap.get(identifier);

  //DEBUG
  console.log(`\n🔒 [Rate Limit Check]`);
  console.log(`   Identifier: ${identifier}`);
  console.log(`   Limit: ${config.limit} requests per ${config.windowMs / 1000}s`);
  console.log(`   Current count: ${entry?.count || 0}/${config.limit}`);

  // No entry or window expired - create new
  if (!entry || now > entry.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitMap.set(identifier, { count: 1, resetTime });
    const resetDate = new Date(resetTime).toLocaleTimeString();
    console.log(`   ✅ Status: ALLOWED (new window)`);
    console.log(`   Remaining: ${config.limit - 1}/${config.limit}`);
    console.log(`   Resets at: ${resetDate}\n`);
    return { success: true, remaining: config.limit - 1, resetTime };
  }

  // Rate limit exceeded
  if (entry.count >= config.limit) {
    const minutesLeft = Math.ceil((entry.resetTime - now) / 60000);
    const resetDate = new Date(entry.resetTime).toLocaleTimeString();
    console.log(`   ❌ Status: BLOCKED`);
    console.log(`   Reason: Rate limit exceeded`);
    console.log(`   Try again in: ${minutesLeft} minute(s)`);
    console.log(`   Resets at: ${resetDate}\n`);
    return { 
      success: false, 
      remaining: 0, 
      resetTime: entry.resetTime 
    };
  }

  // Increment count
  entry.count++;
  const resetDate = new Date(entry.resetTime).toLocaleTimeString();
  console.log(`   ✅ Status: ALLOWED`);
  console.log(`   Remaining: ${config.limit - entry.count}/${config.limit}`);
  console.log(`   Resets at: ${resetDate}\n`);
  return { 
    success: true, 
    remaining: config.limit - entry.count, 
    resetTime: entry.resetTime 
  };
}

// Get client IP address from request headers
export function getClientIp(request: Request): string {
  // Check various headers for IP (proxies, load balancers)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIp) {
    return realIp;
  }
  if (cfConnectingIp) {
    return cfConnectingIp;
  }
  
  return 'localhost';
}
