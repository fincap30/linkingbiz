import { NextResponse } from 'next/server';
import { registerUser, setAuthCookie, createToken } from '@/lib/db';
import { registerSchema, getFirstZodError } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limiting: 5 registration attempts per minute per IP
    const ip = getClientIp(request);
    const limiter = rateLimit(`register:${ip}`, { maxRequests: 5, windowSeconds: 60 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many registration attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((limiter.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = getFirstZodError(parsed.error);
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password, fullName, role } = parsed.data;
    const { user, error } = await registerUser(email, password, fullName, role);

    if (error || !user) {
      return NextResponse.json(
        { error: error || 'Registration failed' },
        { status: 400 }
      );
    }

    // Create token and set cookie
    const token = createToken(user);
    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Register error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
