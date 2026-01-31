import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { createClient } from '@supabase/supabase-js';

// Create a server-side client with service role 
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!, 
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function POST(request: NextRequest) {
  try {
    // Get client IP
    const clientIp = getClientIp(request);

    // Check rate limit: 5 submissions per hour per IP
    const rateLimitResult = checkRateLimit(clientIp, {
      limit: 5,
      windowMs: 60 * 60 * 1000, // 1 hour
    });

    if (!rateLimitResult.success) {
      const resetDate = new Date(rateLimitResult.resetTime);
      return NextResponse.json(
        {
          error: 'Too many requests. Please try again later.',
          resetTime: resetDate.toISOString(),
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
          }
        }
      );
    }

    // Parse request body
    const body = await request.json();
    const { user_id, name, email, phone, message, product_id } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize inputs 
    const sanitizedData = {
      user_id: user_id || null,
      name: name.trim().substring(0, 100),
      email: email.trim().toLowerCase().substring(0, 100),
      phone: phone ? phone.trim().substring(0, 20) : null,
      message: message.trim().substring(0, 2000),
      product_id: product_id || null,
      status: 'new',
    };

    // Insert into database using admin client 
    const { data, error } = await supabaseAdmin
      .from('inquiries')
      .insert(sanitizedData)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { error: 'Failed to submit inquiry' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data,
        remaining: rateLimitResult.remaining,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}