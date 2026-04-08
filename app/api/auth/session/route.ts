import { NextResponse } from 'next/server';
import { getUser } from '@/lib/db';

export async function GET() {
  try {
    const user = await getUser();
    return NextResponse.json({ user });
  } catch (err) {
    console.error('Session error:', err);
    return NextResponse.json({ user: null });
  }
}
