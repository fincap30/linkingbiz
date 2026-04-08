# LinkingBiz - B2B Marketplace & Referral Platform

A modern Next.js application for connecting businesses and tracking referrals in South Africa.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Turso (libSQL) — serverless-compatible SQLite
- **Authentication**: JWT-based with bcryptjs password hashing
- **Icons**: Lucide React
- **Validation**: Zod
- **Deployment**: Netlify

## Getting Started

### Prerequisites

- Node.js 22+
- A [Turso](https://turso.tech) account and database
- npm or yarn

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd linkingbiz
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:

| Variable | Required | Description |
|---|---|---|
| `TURSO_DATABASE_URL` | ✅ | Your Turso database URL (e.g., `libsql://your-db.turso.io`) |
| `TURSO_AUTH_TOKEN` | ✅ | Turso authentication token |
| `JWT_SECRET` | ✅ | Secret key for JWT signing. Generate with: `openssl rand -base64 64` |
| `NEXT_PUBLIC_SITE_URL` | ❌ | Public URL of your deployed site (used for redirects) |

### 3. Initialize the database

```bash
npm run db:init
```

This creates all tables and seeds demo data.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment to Netlify

1. Push your code to GitHub/GitLab
2. Connect the repository to Netlify
3. Set the required environment variables in Netlify's dashboard:
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_SITE_URL`
4. Deploy — the `netlify.toml` handles build configuration automatically

### Setting up Turso

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create a database
turso db create linkingbiz

# Get the database URL
turso db show linkingbiz --url

# Create an auth token
turso db tokens create linkingbiz
```

## Project Structure

```
linkingbiz/
├── app/                    # Next.js app router
│   ├── api/auth/          # Authentication API routes
│   ├── api/referrals/     # Referral API routes
│   ├── auth/              # Auth pages (login, register)
│   ├── admin/             # Admin dashboard
│   ├── business/          # Business detail pages
│   ├── dashboard/         # User dashboard
│   └── hub/               # Business discovery hub
├── components/ui/         # Reusable UI components
├── lib/
│   ├── db/                # Database layer (Turso/libSQL)
│   │   ├── database.ts    # Connection management
│   │   ├── auth.ts        # Authentication logic
│   │   ├── queries.ts     # CRUD operations
│   │   ├── schema.ts      # Schema & seed data
│   │   └── index.ts       # Barrel exports
│   ├── validation.ts      # Zod input validation schemas
│   ├── rate-limit.ts      # Rate limiting for API routes
│   └── env.ts             # Environment variable validation
├── scripts/
│   └── init-db.ts         # Database initialization script
├── types/
│   └── index.ts           # TypeScript type definitions
├── netlify.toml           # Netlify deployment config
└── .env.example           # Environment variable template
```

## Security Features

- **Password Hashing**: bcryptjs with 10 salt rounds
- **JWT Authentication**: Secure token-based auth with httpOnly cookies
- **Input Validation**: Zod schemas on all API endpoints
- **Rate Limiting**: Per-IP rate limiting on auth endpoints
- **Parameterized Queries**: SQL injection protection throughout
- **Strict JWT Secret**: No fallback — `JWT_SECRET` must be set

## License

MIT
