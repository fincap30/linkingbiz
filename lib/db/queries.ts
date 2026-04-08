import { getDb } from './database';

// Users
export function getUserById(id: string) {
  const db = getDb();
  return db.prepare(`
    SELECT id, email, role, full_name, phone, avatar_url, created_at, updated_at
    FROM users WHERE id = ?
  `).get(id);
}

export function getUserByEmail(email: string) {
  const db = getDb();
  return db.prepare(`
    SELECT id, email, role, full_name, phone, avatar_url, created_at, updated_at
    FROM users WHERE email = ?
  `).get(email);
}

export function getAllUsers(limit: number = 100) {
  const db = getDb();
  return db.prepare(`
    SELECT id, email, role, full_name, phone, avatar_url, created_at
    FROM users ORDER BY created_at DESC LIMIT ?
  `).all(limit);
}

export function countUsers() {
  const db = getDb();
  const result = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  return result.count;
}

// Industries
export function getAllIndustries() {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM industries ORDER BY name
  `).all();
}

export function getIndustryBySlug(slug: string) {
  const db = getDb();
  return db.prepare('SELECT * FROM industries WHERE slug = ?').get(slug);
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

export function getAllBusinesses(options: {
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
  const params: any[] = [];

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

  const rows = db.prepare(query).all(...params) as any[];
  
  return rows.map(row => ({
    ...row,
    services: JSON.parse(row.services || '[]'),
    is_verified: !!row.is_verified,
    is_active: !!row.is_active,
  }));
}

export function getBusinessBySlug(slug: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM businesses WHERE slug = ? AND is_active = 1').get(slug) as any;
  
  if (!row) return null;

  return {
    ...row,
    services: JSON.parse(row.services || '[]'),
    is_verified: !!row.is_verified,
    is_active: !!row.is_active,
  };
}

export function getBusinessById(id: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM businesses WHERE id = ?').get(id) as any;
  
  if (!row) return null;

  return {
    ...row,
    services: JSON.parse(row.services || '[]'),
    is_verified: !!row.is_verified,
    is_active: !!row.is_active,
  };
}

export function getBusinessByUserId(userId: string) {
  const db = getDb();
  const row = db.prepare('SELECT * FROM businesses WHERE user_id = ?').get(userId) as any;
  
  if (!row) return null;

  return {
    ...row,
    services: JSON.parse(row.services || '[]'),
    is_verified: !!row.is_verified,
    is_active: !!row.is_active,
  };
}

export function countBusinesses() {
  const db = getDb();
  const result = db.prepare('SELECT COUNT(*) as count FROM businesses').get() as { count: number };
  return result.count;
}

export function createBusiness(data: Omit<Business, 'id' | 'created_at' | 'updated_at' | 'rating' | 'review_count'>) {
  const db = getDb();
  const id = crypto.randomUUID();
  
  db.prepare(`
    INSERT INTO businesses (
      id, user_id, name, slug, description, short_description, logo_url, cover_image_url,
      website, email, phone, address, city, province, postal_code, country,
      industry, services, commission_rate, is_verified, is_active
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
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
    data.is_active ? 1 : 0
  );

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

export function getReferralsByReferrerId(referrerId: string) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT r.*, b.name as business_name, b.slug as business_slug
    FROM referrals r
    JOIN businesses b ON r.business_id = b.id
    WHERE r.referrer_id = ?
    ORDER BY r.created_at DESC
  `).all(referrerId) as any[];

  return rows.map(row => ({
    ...row,
    commission_paid: !!row.commission_paid,
  }));
}

export function getReferralsByBusinessId(businessId: string) {
  const db = getDb();
  const rows = db.prepare(`
    SELECT r.*, u.full_name as referrer_name
    FROM referrals r
    JOIN users u ON r.referrer_id = u.id
    WHERE r.business_id = ?
    ORDER BY r.created_at DESC
  `).all(businessId) as any[];

  return rows.map(row => ({
    ...row,
    commission_paid: !!row.commission_paid,
  }));
}

export function countReferrals(options: { status?: string; referrerId?: string; businessId?: string } = {}) {
  const db = getDb();
  
  let query = 'SELECT COUNT(*) as count FROM referrals WHERE 1=1';
  const params: any[] = [];

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

  const result = db.prepare(query).get(...params) as { count: number };
  return result.count;
}

export function getTotalEarnings(referrerId: string): number {
  const db = getDb();
  const result = db.prepare(`
    SELECT COALESCE(SUM(commission_amount), 0) as total
    FROM referrals
    WHERE referrer_id = ? AND commission_paid = 1
  `).get(referrerId) as { total: number };
  
  return result.total;
}

export function createReferral(data: {
  referrer_id: string;
  business_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  notes?: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  
  db.prepare(`
    INSERT INTO referrals (id, referrer_id, business_id, customer_name, customer_email, customer_phone, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
  `).run(
    id,
    data.referrer_id,
    data.business_id,
    data.customer_name,
    data.customer_email,
    data.customer_phone || null,
    data.notes || null
  );

  return id;
}

// Reviews
export function getReviewsByBusinessId(businessId: string, limit: number = 10) {
  const db = getDb();
  return db.prepare(`
    SELECT r.*, u.full_name as user_name
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.business_id = ?
    ORDER BY r.created_at DESC
    LIMIT ?
  `).all(businessId, limit);
}

export function createReview(data: {
  business_id: string;
  user_id: string;
  rating: number;
  comment?: string;
}) {
  const db = getDb();
  const id = crypto.randomUUID();
  
  db.prepare(`
    INSERT INTO reviews (id, business_id, user_id, rating, comment)
    VALUES (?, ?, ?, ?, ?)
  `).run(id, data.business_id, data.user_id, data.rating, data.comment || null);

  // Update business rating
  const ratingResult = db.prepare(`
    SELECT AVG(rating) as avg_rating, COUNT(*) as count
    FROM reviews WHERE business_id = ?
  `).get(data.business_id) as { avg_rating: number; count: number };

  db.prepare(`
    UPDATE businesses SET rating = ?, review_count = ? WHERE id = ?
  `).run(ratingResult.avg_rating, ratingResult.count, data.business_id);

  return id;
}
