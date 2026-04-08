import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { getDb } from './database';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
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
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: SESSION_EXPIRY }
  );
}

// Verify JWT token
export function verifyToken(token: string): { id: string; email: string; role: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string; email: string; role: string };
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
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return { user: null, error: 'Email already registered' };
  }

  const id = crypto.randomUUID();
  const passwordHash = await hashPassword(password);

  try {
    db.prepare(`
      INSERT INTO users (id, email, password_hash, role, full_name)
      VALUES (?, ?, ?, ?, ?)
    `).run(id, email, passwordHash, role, fullName);

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
    return { user: null, error: 'Failed to create user' };
  }
}

// Login user
export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User | null; token: string | null; error: string | null }> {
  const db = getDb();

  const row = db.prepare(`
    SELECT id, email, password_hash, role, full_name, phone, avatar_url
    FROM users WHERE email = ?
  `).get(email) as any;

  if (!row) {
    return { user: null, token: null, error: 'Invalid email or password' };
  }

  const valid = await verifyPassword(password, row.password_hash);
  if (!valid) {
    return { user: null, token: null, error: 'Invalid email or password' };
  }

  const user: User = {
    id: row.id,
    email: row.email,
    role: row.role,
    full_name: row.full_name,
    phone: row.phone,
    avatar_url: row.avatar_url,
  };

  const token = createToken(user);

  // Store session in database
  const sessionId = crypto.randomUUID();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  db.prepare(`
    INSERT INTO sessions (id, user_id, token, expires_at)
    VALUES (?, ?, ?, ?)
  `).run(sessionId, user.id, token, expiresAt.toISOString());

  return { user, token, error: null };
}

// Get current user from token
export async function getCurrentUser(token: string | null): Promise<User | null> {
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const db = getDb();
  const row = db.prepare(`
    SELECT id, email, role, full_name, phone, avatar_url
    FROM users WHERE id = ?
  `).get(payload.id) as any;

  if (!row) return null;

  return {
    id: row.id,
    email: row.email,
    role: row.role,
    full_name: row.full_name,
    phone: row.phone,
    avatar_url: row.avatar_url,
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
  db.prepare('DELETE FROM sessions WHERE token = ?').run(token);
  await clearAuthCookie();
}
