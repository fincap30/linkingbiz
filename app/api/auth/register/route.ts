import { NextResponse } from 'next/server';
import { registerUser, setAuthCookie, createToken } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { email, password, fullName, role } = await request.json();

    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

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
