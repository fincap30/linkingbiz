import { NextResponse } from 'next/server';

// No longer needed with SQLite - redirect to login
export async function GET(request: Request) {
  const { origin } = new URL(request.url);
  return NextResponse.redirect(`${origin}/auth/login`);
}
