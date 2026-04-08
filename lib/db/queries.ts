import { getDb } from './database';
import type { InValue } from '@libsql/client';

// Users
export async function getUserById(id: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, email, role, full_name, phone, avatar_url, created_at, updated_at
          FROM users WHERE id = ?`,
    args: [id],
  });
  return result.rows[0] || null;
}

export async function getUserByEmail(email: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, email, role, full_name, phone, avatar_url, created_at, updated_at
          FROM users WHERE email = ?`,
    args: [email],
  });
  return result.rows[0] || null;
}

export async function getAllUsers(limit: number = 100) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT id, email, role, full_name, phone, avatar_url, created_at
          FROM users ORDER BY created_at DESC LIMIT ?`,
    args: [limit],
  });
  return result.rows;
}

export async function countUsers() {
  const db = getDb();
  const result = await db.execute('SELECT COUNT(*) as count FROM users');
  return Number(result.rows[0].count);
}

// Industries
export async function getAllIndustries() {
  const db = getDb();
  const result = await db.execute('SELECT * FROM industries ORDER BY name');
  return result.rows;
}

export async function getIndustryBySlug(slug: string) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM industries WHERE slug = ?', args: [slug] });
  return result.rows[0] || null;
}

// Businesses
export interface Business {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
  website: string | null;
  email: string;
  phone: string;
  address: string | null;
  city: string;
  province: string;
  postal_code: string | null;
  country: string;
  industry: string;
  services: string[];
  commission_rate: number;
  is_verified: boolean;
  is_active: boolean;
  rating: number;
  review_count: number;
  created_at: string;
  updated_at: string;
}

function parseBusinessRow(row: Record<string, unknown>): Business {
  return {
    ...(row as unknown as Business),
    services: JSON.parse((row.services as string) || '[]'),
    is_verified: !!row.is_verified,
    is_active: !!row.is_active,
  };
}

export async function getAllBusinesses(options: {
  active?: boolean;
  verified?: boolean;
  industry?: string;
  city?: string;
  search?: string;
  limit?: number;
  offset?: number;
} = {}) {
  const db = getDb();

  let query = 'SELECT * FROM businesses WHERE 1=1';
  const params: InValue[] = [];

  if (options.active !== undefined) {
    query += ' AND is_active = ?';
    params.push(options.active ? 1 : 0);
  }

  if (options.verified !== undefined) {
    query += ' AND is_verified = ?';
    params.push(options.verified ? 1 : 0);
  }

  if (options.industry) {
    query += ' AND industry = ?';
    params.push(options.industry);
  }

  if (options.city) {
    query += ' AND city LIKE ?';
    params.push(`%${options.city}%`);
  }

  if (options.search) {
    query += ' AND (name LIKE ? OR description LIKE ? OR services LIKE ?)';
    const searchTerm = `%${options.search}%`;
    params.push(searchTerm, searchTerm, searchTerm);
  }

  query += ' ORDER BY is_verified DESC, rating DESC';

  if (options.limit) {
    query += ' LIMIT ?';
    params.push(options.limit);
  }

  if (options.offset) {
    query += ' OFFSET ?';
    params.push(options.offset);
  }

  const result = await db.execute({ sql: query, args: params });

  return result.rows.map((row) => parseBusinessRow(row as unknown as Record<string, unknown>));
}

export async function getBusinessBySlug(slug: string) {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM businesses WHERE slug = ? AND is_active = 1',
    args: [slug],
  });

  const row = result.rows[0];
  if (!row) return null;

  return parseBusinessRow(row as unknown as Record<string, unknown>);
}

export async function getBusinessById(id: string) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM businesses WHERE id = ?', args: [id] });

  const row = result.rows[0];
  if (!row) return null;

  return parseBusinessRow(row as unknown as Record<string, unknown>);
}

export async function getBusinessByUserId(userId: string) {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM businesses WHERE user_id = ?', args: [userId] });

  const row = result.rows[0];
  if (!row) return null;

  return parseBusinessRow(row as unknown as Record<string, unknown>);
}

export async function countBusinesses() {
  const db = getDb();
  const result = await db.execute('SELECT COUNT(*) as count FROM businesses');
  return Number(result.rows[0].count);
}

export async function createBusiness(data: Omit<Business, 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>) {
  const db = getDb();
  const id = crypto.randomUUID();

  await db.execute({
    sql: `INSERT INTO businesses (
            id, user_id, name, slug, description, short_description, logo_url, cover_image_url,
            website, email, phone, address, city, province, postal_code, country,
            industry, services, commission_rate, is_verified, is_active
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      id,
      data.user_id,
      data.name,
      data.slug,
      data.description,
      data.short_description,
      data.logo_url,
      data.cover_image_url,
      data.website,
      data.email,
      data.phone,
      data.address,
      data.city,
      data.province,
      data.postal_code,
      data.country || 'South Africa',
      data.industry,
      JSON.stringify(data.services || []),
      data.commission_rate || 10,
      data.is_verified ? 1 : 0,
      data.is_active ? 1 : 0,
    ],
  });

  return getBusinessById(id);
}

// Referrals
export interface Referral {
  id: string;
  referrer_id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  notes: string | null;
  status: 'pending' | 'contacted' | 'converted' | 'declined' | 'cancelled';
  commission_amount: number | null;
  commission_paid: boolean;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getReferralsByReferrerId(referrerId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT r.*, b.name as business_name, b.slug as business_slug
          FROM referrals r
          JOIN businesses b ON r.business_id = b.id
          WHERE r.referrer_id = ?
          ORDER BY r.created_at DESC`,
    args: [referrerId],
  });

  return result.rows.map((row) => ({
    ...row,
    commission_paid: !!row.commission_paid,
  }));
}

export async function getReferralsByBusinessId(businessId: string) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT r.*, u.full_name as referrer_name
          FROM referrals r
          JOIN users u ON r.referrer_id = u.id
          WHERE r.business_id = ?
          ORDER BY r.created_at DESC`,
    args: [businessId],
  });

  return result.rows.map((row) => ({
    ...row,
    commission_paid: !!row.commission_paid,
  }));
}

export async function countReferrals(options: { status?: string; referrerId?: string; businessId?: string } = {}) {
  const db = getDb();

  let query = 'SELECT COUNT(*) as count FROM referrals WHERE 1=1';
  const params: InValue[] = [];

  if (options.status) {
    query += ' AND status = ?';
    params.push(options.status);
  }

  if (options.referrerId) {
    query += ' AND referrer_id = ?';
    params.push(options.referrerId);
  }

  if (options.businessId) {
    query += ' AND business_id = ?';
    params.push(options.businessId);
  }

  const result = await db.execute({ sql: query, args: params });
  return Number(result.rows[0].count);
}

export async function getTotalEarnings(referrerId: string): Promise<number> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT COALESCE(SUM(commission_amount), 0) as total
          FROM referrals
          WHERE referrer_id = ? AND commission_paid = 1`,
    args: [referrerId],
  });

  return Number(result.rows[0].total);
}

export async function createReferral(data: {
  referrer_id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  notes?: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();

  await db.execute({
    sql: `INSERT INTO referrals (id, referrer_id, business_id, customer_name, customer_email, customer_phone, notes, status)
          VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    args: [
      id,
      data.referrer_id,
      data.business_id,
      data.customer_name,
      data.customer_email,
      data.customer_phone || null,
      data.notes || null,
    ],
  });

  return id;
}

// Reviews
export async function getReviewsByBusinessId(businessId: string, limit: number = 10) {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT r.*, u.full_name as user_name
          FROM reviews r
          JOIN users u ON r.user_id = u.id
          WHERE r.business_id = ?
          ORDER BY r.created_at DESC
          LIMIT ?`,
    args: [businessId, limit],
  });
  return result.rows;
}

export async function createReview(data: {
  business_id: string;
  user_id: string;
  rating: number;
  comment?: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();

  await db.execute({
    sql: `INSERT INTO reviews (id, business_id, user_id, rating, comment)
          VALUES (?, ?, ?, ?, ?)`,
    args: [id, data.business_id, data.user_id, data.rating, data.comment || null],
  });

  // Update business rating
  const ratingResult = await db.execute({
    sql: `SELECT AVG(rating) as avg_rating, COUNT(*) as count
          FROM reviews WHERE business_id = ?`,
    args: [data.business_id],
  });

  const avgRating = Number(ratingResult.rows[0].avg_rating);
  const count = Number(ratingResult.rows[0].count);

  await db.execute({
    sql: 'UPDATE businesses SET rating = ?, review_count = ? WHERE id = ?',
    args: [avgRating, count, data.business_id],
  });

  return id;
}
