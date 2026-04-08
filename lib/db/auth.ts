import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDb } from './database';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error(
      'JWT_SECRET environment variable is required. ' +
      'Generate a strong secret with: openssl rand -base64 64'
    );
  }
  return secret;
}

const SESSION_EXPIRY = '7d';

export interface User {
  id: string;
  email: string;
  role: 'business' | 'referrer' | 'admin';
  full_name: string;
  phone: string | null;
  avatar_url: string | null;
}

export interface Session {
  user: User;
  token: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

// Verify password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Create JWT token
export function createToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: SESSION_EXPIRY }
  );
}

// Verify JWT token
export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, getJwtSecret()) as { id: string; email: string; role: string };
  } catch {
    return null;
  }
}

// Register a new user
export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  role: 'business' | 'referrer'
): Promise<{ user: User | null; error: string | null }> {
  const db = getDb();

  // Check if user exists
  const existing = await db.execute({ sql: 'SELECT id FROM users WHERE email = ?', args: [email] });
  if (existing.rows.length > 0) {
    return { user: null, error: 'Email already registered' };
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  try {
    await db.execute({
      sql: `INSERT INTO users (id, email, password_hash, role, full_name)
            VALUES (?, ?, ?, ?, ?)`,
      args: [id, email, passwordHash, role, fullName],
    });

    const user: User = {
      id,
      email,
      role,
      full_name: fullName,
      phone: null,
      avatar_url: null,
    };

    return { user, error: null };
  } catch (err) {
    console.error('Failed to create user:', err);
    return { user: null, error: 'Failed to create user' };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User | null; token: string | null; error: string | null }> {
  const db = getDb();

  const result = await db.execute({
    sql: `SELECT id, email, password_hash, role, full_name, phone, avatar_url
          FROM users WHERE email = ?`,
    args: [email],
  });

  const row = result.rows[0];
  if (!row) {
    return { user: null, token: null, error: 'Invalid email or password' };
  }

  const valid = await verifyPassword(password, row.password_hash as string);
  if (!valid) {
    return { user: null, token: null, error: 'Invalid email or password' };
  }

  const user: User = {
    id: row.id as string,
    email: row.email as string,
    role: row.role as 'business' | 'referrer' | 'admin',
    full_name: row.full_name as string,
    phone: row.phone as string | null,
    avatar_url: row.avatar_url as string | null,
  };

  const token = createToken(user);

  // Store session in database
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await db.execute({
    sql: `INSERT INTO sessions (id, user_id, token, expires_at)
          VALUES (?, ?, ?, ?)`,
    args: [sessionId, user.id, token, expiresAt.toISOString()],
  });

  return { user, token, error: null };
}

// Get current user from token
export async function getCurrentUser(token: string | null): Promise<User | null> {
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, email, role, full_name, phone, avatar_url
          FROM users WHERE id = ?`,
    args: [payload.id],
  });

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id as string,
    email: row.email as string,
    role: row.role as 'business' | 'referrer' | 'admin',
    full_name: row.full_name as string,
    phone: row.phone as string | null,
    avatar_url: row.avatar_url as string | null,
  };
}

// Set auth cookie
export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('auth-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
  });
}

// Clear auth cookie
export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('auth-token');
}

// Get token from cookies
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('auth-token')?.value || null;
}

// Logout user
export async function logoutUser(token: string) {
  const db = getDb();
  await db.execute({ sql: 'DELETE FROM sessions WHERE token = ?', args: [token] });
  await clearAuthCookie();
}
