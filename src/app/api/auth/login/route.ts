import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Check rate limit: 10 login attempts per 15 minutes
    const rateLimitResult = checkRateLimit(`login:${clientIp}`, {
      limit: 10,
      windowMs: 15 * 60 * 1000, // 15 minutes
    });

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.resetTime);
      const minutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000);
      
      return NextResponse.json(
        {
          error: `Too many login attempts. Please try again in ${minutes} minute(s).`,
          resetTime: resetDate.toISOString(),
        },
        { status: 429 }
      );
    }

    // Return success
    return NextResponse.json({
      success: true,
      remaining: rateLimitResult.remaining,
    });

  } catch (error) {
    console.error('Login rate limit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}