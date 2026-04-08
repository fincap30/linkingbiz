import { NextResponse } from 'next/server';
import { loginUser, setAuthCookie } from '@/lib/db';
import { loginSchema, getFirstZodError } from '@/lib/validation';
import { rateLimit, getClientIp } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limiting: 10 login attempts per minute per IP
    const ip = getClientIp(request);
    const limiter = rateLimit(`login:${ip}`, { maxRequests: 10, windowSeconds: 60 });
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil((limiter.resetAt - Date.now()) / 1000)) } }
      );
    }

    const body = await request.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const firstError = getFirstZodError(parsed.error);
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { email, password } = parsed.data;
    const { user, token, error } = await loginUser(email, password);

    if (error || !user || !token) {
      return NextResponse.json(
        { error: error || 'Invalid credentials' },
        { status: 401 }
      );
    }

    await setAuthCookie(token);

    return NextResponse.json({ user });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
