import { getDb } from './database';

export async function initSchema() {
  const db = getDb();

  // Users table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('business', 'referrer', 'admin')),
      full_name TEXT NOT NULL,
      phone TEXT,
      avatar_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Industries table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS industries (
      id TEXT PRIMARY KEY,
      name TEXT UNIQUE NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      icon TEXT,
      description TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Businesses table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS businesses (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      description TEXT NOT NULL,
      short_description TEXT,
      logo_url TEXT,
      cover_image_url TEXT,
      website TEXT,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      city TEXT NOT NULL,
      province TEXT NOT NULL,
      postal_code TEXT,
      country TEXT DEFAULT 'South Africa',
      industry TEXT NOT NULL,
      services TEXT DEFAULT '[]',
      commission_rate REAL DEFAULT 10,
      is_verified INTEGER DEFAULT 0,
      is_active INTEGER DEFAULT 1,
      rating REAL DEFAULT 5,
      review_count INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Referrals table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS referrals (
      id TEXT PRIMARY KEY,
      referrer_id TEXT NOT NULL,
      business_id TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_email TEXT NOT NULL,
      customer_phone TEXT,
      notes TEXT,
      status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'converted', 'declined', 'cancelled')),
      commission_amount REAL,
      commission_paid INTEGER DEFAULT 0,
      paid_at DATETIME,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (referrer_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE
    )
  `);

  // Reviews table
  await db.execute(`
    CREATE TABLE IF NOT EXISTS reviews (
      id TEXT PRIMARY KEY,
      business_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Sessions table for JWT tokens
  await db.execute(`
    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Insert default industries
  const industries = [
    { name: 'Technology', slug: 'technology', icon: 'Laptop', description: 'Software, IT services, and tech solutions' },
    { name: 'Marketing', slug: 'marketing', icon: 'Megaphone', description: 'Digital marketing, advertising, and PR' },
    { name: 'Finance', slug: 'finance', icon: 'DollarSign', description: 'Accounting, banking, and financial services' },
    { name: 'Legal', slug: 'legal', icon: 'Scale', description: 'Legal services and consulting' },
    { name: 'Construction', slug: 'construction', icon: 'HardHat', description: 'Building, renovation, and construction' },
    { name: 'Healthcare', slug: 'healthcare', icon: 'Heart', description: 'Medical and wellness services' },
    { name: 'Education', slug: 'education', icon: 'GraduationCap', description: 'Training and educational services' },
    { name: 'Real Estate', slug: 'real-estate', icon: 'Home', description: 'Property sales and management' },
    { name: 'Consulting', slug: 'consulting', icon: 'Users', description: 'Business and management consulting' },
    { name: 'Manufacturing', slug: 'manufacturing', icon: 'Factory', description: 'Production and manufacturing' },
  ];

  for (const industry of industries) {
    await db.execute({
      sql: `INSERT OR IGNORE INTO industries (id, name, slug, icon, description)
            VALUES (lower(hex(randomblob(16))), ?, ?, ?, ?)`,
      args: [industry.name, industry.slug, industry.icon, industry.description],
    });
  }

  console.log('Database schema initialized successfully');
}

export async function seedDemoData() {
  const db = getDb();

  // Check if we already have data
  const result = await db.execute('SELECT COUNT(*) as count FROM users');
  const userCount = Number(result.rows[0].count);
  if (userCount > 0) {
    console.log('Demo data already exists, skipping...');
    return;
  }

  // Create demo admin user
  const adminId = crypto.randomUUID();
  const adminPasswordHash = '$2b$10$YourHashedPasswordHere'; // Placeholder - will be set via auth

  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, role, full_name, phone)
          VALUES (?, ?, ?, 'admin', 'Admin User', '+27 12 345 6789')`,
    args: [adminId, 'admin@linkingbiz.co.za', adminPasswordHash],
  });

  // Create demo business user
  const businessUserId = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, role, full_name, phone)
          VALUES (?, ?, ?, 'business', 'Demo Business Owner', '+27 12 345 6790')`,
    args: [businessUserId, 'business@example.com', adminPasswordHash],
  });

  // Create demo referrer user
  const referrerId = crypto.randomUUID();
  await db.execute({
    sql: `INSERT INTO users (id, email, password_hash, role, full_name, phone)
          VALUES (?, ?, ?, 'referrer', 'Demo Referrer', '+27 12 345 6791')`,
    args: [referrerId, 'referrer@example.com', adminPasswordHash],
  });

  // Create demo businesses
  const businesses = [
    {
      id: crypto.randomUUID(),
      user_id: businessUserId,
      name: 'TechFlow Solutions',
      slug: 'techflow-solutions',
      description: 'We provide cutting-edge software development and IT consulting services for businesses of all sizes.',
      short_description: 'Custom software development and IT consulting',
      email: 'info@techflow.co.za',
      phone: '+27 11 123 4567',
      city: 'Johannesburg',
      province: 'Gauteng',
      industry: 'Technology',
      services: JSON.stringify(['Web Development', 'Mobile Apps', 'Cloud Services', 'IT Consulting']),
      commission_rate: 15,
      is_verified: 1,
      rating: 4.8,
      review_count: 12,
    },
    {
      id: crypto.randomUUID(),
      user_id: businessUserId,
      name: 'Growth Marketing SA',
      slug: 'growth-marketing-sa',
      description: 'Full-service digital marketing agency helping South African businesses grow their online presence.',
      short_description: 'Digital marketing and growth strategies',
      email: 'hello@growthmarketing.co.za',
      phone: '+27 21 987 6543',
      city: 'Cape Town',
      province: 'Western Cape',
      industry: 'Marketing',
      services: JSON.stringify(['SEO', 'PPC Advertising', 'Social Media', 'Content Marketing']),
      commission_rate: 12,
      is_verified: 1,
      rating: 4.5,
      review_count: 8,
    },
    {
      id: crypto.randomUUID(),
      user_id: businessUserId,
      name: 'ProBuild Construction',
      slug: 'probuild-construction',
      description: 'Commercial and residential construction services with over 20 years of experience.',
      short_description: 'Commercial and residential construction',
      email: 'projects@probuild.co.za',
      phone: '+27 11 456 7890',
      city: 'Pretoria',
      province: 'Gauteng',
      industry: 'Construction',
      services: JSON.stringify(['Commercial Building', 'Renovations', 'Project Management', 'Architectural Design']),
      commission_rate: 10,
      is_verified: 1,
      rating: 4.9,
      review_count: 23,
    },
    {
      id: crypto.randomUUID(),
      user_id: businessUserId,
      name: 'LegalWise Consulting',
      slug: 'legalwise-consulting',
      description: 'Corporate legal services including contract review, company registration, compliance, and business advisory for SMEs.',
      short_description: 'Corporate legal services for SMEs',
      email: 'consult@legalwise.co.za',
      phone: '+27 31 234 5678',
      city: 'Durban',
      province: 'KwaZulu-Natal',
      industry: 'Legal',
      services: JSON.stringify(['Contract Review', 'Company Registration', 'Compliance', 'Business Advisory']),
      commission_rate: 20,
      is_verified: 0,
      rating: 4.2,
      review_count: 5,
    },
    {
      id: crypto.randomUUID(),
      user_id: businessUserId,
      name: 'CloudFirst Finance',
      slug: 'cloudfirst-finance',
      description: 'Cloud-based accounting and financial services for modern businesses.',
      short_description: 'Cloud accounting and financial services',
      email: 'info@cloudfirst.co.za',
      phone: '+27 11 789 0123',
      city: 'Johannesburg',
      province: 'Gauteng',
      industry: 'Finance',
      services: JSON.stringify(['Bookkeeping', 'Tax Preparation', 'Financial Planning', 'Payroll Services']),
      commission_rate: 15,
      is_verified: 1,
      rating: 4.7,
      review_count: 15,
    },
  ];

  for (const b of businesses) {
    await db.execute({
      sql: `INSERT INTO businesses (
              id, user_id, name, slug, description, short_description, email, phone,
              city, province, industry, services, commission_rate, is_verified, rating, review_count
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        b.id, b.user_id, b.name, b.slug, b.description, b.short_description,
        b.email, b.phone, b.city, b.province, b.industry, b.services,
        b.commission_rate, b.is_verified, b.rating, b.review_count,
      ],
    });
  }

  // Create demo referrals
  const referrals = [
    {
      id: crypto.randomUUID(),
      referrer_id: referrerId,
      business_id: businesses[0].id,
      customer_name: 'John Smith',
      customer_email: 'john@example.com',
      customer_phone: '+27 82 123 4567',
      status: 'converted',
      commission_amount: 15000,
      commission_paid: 1,
    },
    {
      id: crypto.randomUUID(),
      referrer_id: referrerId,
      business_id: businesses[1].id,
      customer_name: 'Sarah Johnson',
      customer_email: 'sarah@example.com',
      customer_phone: null,
      status: 'pending',
      commission_amount: null,
      commission_paid: 0,
    },
    {
      id: crypto.randomUUID(),
      referrer_id: referrerId,
      business_id: businesses[2].id,
      customer_name: 'Mike Brown',
      customer_email: 'mike@example.com',
      customer_phone: '+27 83 987 6543',
      status: 'contacted',
      commission_amount: null,
      commission_paid: 0,
    },
  ];

  for (const r of referrals) {
    await db.execute({
      sql: `INSERT INTO referrals (
              id, referrer_id, business_id, customer_name, customer_email, customer_phone,
              status, commission_amount, commission_paid
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [
        r.id, r.referrer_id, r.business_id, r.customer_name, r.customer_email,
        r.customer_phone, r.status, r.commission_amount, r.commission_paid,
      ],
    });
  }

  console.log('Demo data seeded successfully');
}
