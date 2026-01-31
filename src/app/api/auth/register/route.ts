import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';

export async function POST(request: NextRequest) {
  try {
    const clientIp = getClientIp(request);

    // Check rate limit: 3 registrations per hour per IP
    const rateLimitResult = checkRateLimit(`register:${clientIp}`, {
      limit: 3,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.success) {
      const minutes = Math.ceil((rateLimitResult.resetTime - Date.now()) / 60000);
      
      return NextResponse.json(
        {
          error: `Too many registration attempts. Please try again in ${minutes} minute(s).`,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      remaining: rateLimitResult.remaining,
    });

  } catch (error) {
    console.error('Register rate limit error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}