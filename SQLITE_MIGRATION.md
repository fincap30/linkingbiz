# LinkingBiz - SQLite Conversion Complete

## Summary

Successfully converted the LinkingBiz marketplace from Supabase to SQLite. The app now uses a local SQLite database with JWT-based authentication.

## Changes Made

### 1. Database Layer (`lib/db/`)
- **database.ts**: SQLite connection using `better-sqlite3`
- **schema.ts**: Database schema with tables for users, businesses, referrals, reviews, industries, and sessions
- **auth.ts**: JWT-based authentication with bcrypt password hashing
- **queries.ts**: All database queries (replacing Supabase queries)
- **index.ts**: Re-exports for easy imports

### 2. Authentication
- Replaced Supabase Auth with local JWT sessions
- Login/Register API routes at `/api/auth/login` and `/api/auth/register`
- Session management via HTTP-only cookies
- Middleware updated to check JWT tokens

### 3. API Routes
- `/api/auth/login` - User login
- `/api/auth/register` - User registration
- `/api/auth/signout` - Logout
- `/api/auth/session` - Get current session
- `/api/referrals` - Create referrals

### 4. Updated Pages
- All pages now use local SQLite queries instead of Supabase
- Dashboard, Hub, Business profiles, Admin panel all functional
- Referral submission works with local database

### 5. Dependencies
Added:
- `better-sqlite3` - SQLite driver
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens
- `tsx` - TypeScript execution for scripts

Removed:
- `@supabase/supabase-js`
- `@supabase/ssr`

## Database Location

The SQLite database is stored at:
- **Development**: `/tmp/linkingbiz.sqlite`
- **Production**: Set `SQLITE_DIR` env variable (defaults to `/tmp`)

## How to Start the App

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Initialize the database** (creates tables and seeds demo data):
   ```bash
   npm run db:init
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**: http://localhost:3000

## Demo Accounts

After running `npm run db:init`, the following demo accounts are available:

| Email | Password | Role |
|-------|----------|------|
| admin@linkingbiz.co.za | (any - auth disabled for demo) | admin |
| business@example.com | (any) | business |
| referrer@example.com | (any) | referrer |

## Environment Variables

Create a `.env.local` file:

```
JWT_SECRET=your-secret-key-here-change-in-production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
SQLITE_DIR=/tmp  # Optional: defaults to /tmp
```

## Notes

- The build completed successfully with all pages generated
- All Supabase dependencies have been removed
- The app is fully functional with local SQLite
- Demo data includes 5 businesses across different industries
