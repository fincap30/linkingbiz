import { NextResponse } from 'next/server';
import { logoutUser, getAuthToken } from '@/lib/db';

export async function POST() {
  try {
    const token = await getAuthToken();
    if (token) {
      await logoutUser(token);
    }
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  } catch (err) {
    console.error('Signout error:', err);
    return NextResponse.redirect(new URL('/auth/login', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
  }
}
