# LinkingBiz Code Audit Report

**Date:** April 8, 2026  
**Repository:** https://github.com/fincap30/linkingbiz  
**Stack:** Next.js 16.2.2, React 19, TypeScript, SQLite (better-sqlite3), Tailwind CSS v4  
**Target Platform:** Netlify  

---

## Overall Deployment Readiness: 🔴 CRITICAL ISSUES — Needs Fixes Before Deploy

---

## Executive Summary

The codebase is well-structured with clean code organization, proper TypeScript usage, and good separation of concerns. However, there are **critical issues** that will prevent successful deployment on Netlify, along with several security concerns and cleanup items.

| Category | Critical | Warning | Info |
|----------|----------|---------|------|
| Netlify Deployment | 2 | 1 | 1 |
| Security | 1 | 2 | 1 |
| SQLite Setup | 1 | 1 | 0 |
| Code Quality | 0 | 2 | 3 |
| Cleanup | 0 | 1 | 2 |

---

## 🔴 Critical Issues

### CRITICAL-1: `better-sqlite3` is incompatible with Netlify serverless functions
- **File:** `package.json:16`, `lib/db/database.ts`
- **Severity:** 🔴 CRITICAL — Will cause deployment failure
- **Details:** `better-sqlite3` is a **native C++ Node.js addon** that requires compilation against the target platform's architecture. Netlify serverless functions (AWS Lambda) have a different binary environment than the build environment. The native `.node` binary compiled during `npm install` at build time will likely fail at runtime.
- **Additionally:** Netlify serverless functions are **stateless and ephemeral** — any SQLite database written to `/tmp` will be lost between invocations and across function instances. Each cold start creates a fresh filesystem. This means **all data is transient and will be lost**.
- **Fix Options:**
  1. **Recommended:** Switch to a cloud database (e.g., Turso/libSQL which is SQLite-compatible but cloud-hosted, or PlanetScale, Neon Postgres, Supabase)
  2. **Alternative:** Use Netlify's Blobs storage for persistence + an edge-compatible SQLite like `sql.js` (WASM-based)
  3. **Alternative:** Deploy on a VPS (DigitalOcean, Railway, Render) where SQLite works natively with persistent filesystem

### CRITICAL-2: SQLite database file committed to repository
- **File:** `data/database.sqlite` (73KB)
- **Severity:** 🔴 CRITICAL — Security & data integrity risk
- **Details:** A populated SQLite database file is committed to the Git repository. This file may contain user data (including password hashes from demo seeding). Binary database files should never be in version control — they cause merge conflicts, bloat the repo, and may leak data.
- **Fix:** 
  1. Add `data/*.sqlite` and `*.sqlite` to `.gitignore`
  2. Remove the file from git history: `git rm --cached data/database.sqlite`
  3. Rely on `npm run db:init` to create/seed the database at runtime

### CRITICAL-3: Hardcoded JWT secret fallback
- **File:** `lib/db/auth.ts:6`
- **Code:** `const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';`
- **Severity:** 🔴 CRITICAL — Security vulnerability
- **Details:** If `JWT_SECRET` environment variable is not set (which is the default), the application uses a **known, hardcoded secret**. Anyone can forge JWT tokens and impersonate any user, including admins.
- **Fix:**
  1. Remove the fallback: `const JWT_SECRET = process.env.JWT_SECRET;`
  2. Add a startup check that throws if JWT_SECRET is not defined
  3. Set `JWT_SECRET` in Netlify environment variables with a strong random value (e.g., `openssl rand -base64 32`)

---

## ⚠️ Warnings

### WARN-1: No CSRF protection on API routes
- **Files:** `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`, `app/api/referrals/route.ts`
- **Details:** POST API routes accept requests without any CSRF token validation. While `SameSite=lax` cookies provide some protection, adding explicit CSRF protection is recommended for production.
- **Fix:** Implement CSRF token validation or use the `Origin` / `Referer` header check pattern.

### WARN-2: No rate limiting on authentication endpoints
- **Files:** `app/api/auth/login/route.ts`, `app/api/auth/register/route.ts`
- **Details:** Login and registration endpoints have no rate limiting, making them vulnerable to brute force attacks and credential stuffing.
- **Fix:** Add rate limiting middleware (e.g., using in-memory counters or a service like Upstash Redis).

### WARN-3: No input validation/sanitization
- **Files:** `app/api/auth/register/route.ts`, `app/api/referrals/route.ts`
- **Details:** API routes check for presence of fields but don't validate email format, password strength (beyond client-side `minLength=6`), or sanitize text inputs. The parameterized SQL queries protect against SQL injection, but XSS through stored data is possible if rendered unsafely.
- **Fix:** Add server-side validation using a library like `zod` for schema validation.

### WARN-4: The `.netlify` directory is committed to the repository
- **File:** `.netlify/` directory
- **Details:** The `.netlify/` directory contains build artifacts and local config that should not be in version control. It includes a `netlify.toml` with hardcoded paths (`publish = "/home/ubuntu/linkingbiz/.next"`) that will differ between environments.
- **Fix:** Add `.netlify/` to `.gitignore` and remove from git: `git rm -r --cached .netlify/`

### WARN-5: `auth/callback/route.ts` has conflicting configuration
- **File:** `app/auth/callback/route.ts`
- **Details:** This route is marked `force-static` but accesses `request.url` which requires a dynamic context. This is a Supabase remnant that's no longer needed. While it works (Next.js handles it), it's dead code that could confuse future developers.
- **Fix:** Remove this file entirely since Supabase auth callback is no longer used.

### WARN-6: Database path uses `/tmp` which is volatile on serverless
- **File:** `lib/db/database.ts:11`
- **Code:** `const dataDir = process.env.SQLITE_DIR || '/tmp';`
- **Details:** On Netlify (AWS Lambda), `/tmp` is a temporary directory that is cleared between cold starts. Data written there will not persist. This is related to CRITICAL-1 but worth noting separately.

---

## ℹ️ Informational / Recommendations

### INFO-1: Supabase remnants should be cleaned up
- **Files:** `types/supabase.ts`, `supabase/schema.sql`
- **Details:** These files are leftover from the Supabase migration and are not imported or used anywhere in the codebase. They add confusion about the actual architecture.
- **Fix:** Delete `types/supabase.ts` and the `supabase/` directory.

### INFO-2: `netlify/functions/auth-session.ts` may conflict with Next.js API route
- **File:** `netlify/functions/auth-session.ts`
- **Details:** There's both a Netlify function (`netlify/functions/auth-session.ts`) and a Next.js API route (`app/api/auth/session/route.ts`) for session handling. The Netlify function uses `getUser()` which requires `next/headers` cookies — this won't work in a standalone Netlify function context (outside of Next.js request lifecycle).
- **Fix:** Remove `netlify/functions/auth-session.ts` and rely solely on the Next.js API route.

### INFO-3: Console statements in production code
- **Files:** `lib/db/schema.ts:135,144,326`
- **Details:** `console.log` statements in the schema initialization are fine for the init script but the schema module is also imported at runtime. Consider using a proper logger or environment-gated logging.

### INFO-4: Duplicate type definitions
- **Files:** `types/index.ts`, `lib/db/queries.ts:48-74`, `lib/db/auth.ts:9-16`
- **Details:** The `User`, `Business`, and `Referral` interfaces are defined in multiple places. This can lead to drift. Consider a single source of truth for types.

### INFO-5: Missing `netlify.toml` `publish` directory
- **File:** `netlify.toml`
- **Details:** The root `netlify.toml` doesn't specify a `publish` directory. The `@netlify/plugin-nextjs` handles this automatically, but explicitly setting it is best practice:
  ```toml
  [build]
    command = "npm run build"
    publish = ".next"
  ```

### INFO-6: No `.env.example` file
- **Details:** There's no `.env.example` or `.env.template` to document required environment variables. The `SQLITE_MIGRATION.md` mentions them, but a dedicated template is standard practice.
- **Required variables:** `JWT_SECRET`, `NEXT_PUBLIC_SITE_URL`, `SQLITE_DIR` (optional)

---

## ✅ What's Done Well

1. **Code Organization:** Clean Next.js App Router structure with proper separation of API routes, pages, components, and database layer.
2. **TypeScript Usage:** Proper typing throughout, strict mode enabled, type definitions in place.
3. **SQL Injection Prevention:** All database queries use parameterized statements via `better-sqlite3`'s `prepare()` method.
4. **Auth Cookie Security:** HTTP-only cookies with `secure` flag in production and `SameSite=lax`.
5. **Password Hashing:** Using `bcryptjs` with salt rounds of 10 — industry standard.
6. **Build Success:** The project builds cleanly with zero TypeScript errors.
7. **UI Components:** Clean use of shadcn/ui components with consistent styling.
8. **Role-based Access:** Proper authorization checks in admin pages and middleware.
9. **Database Schema:** Well-designed schema with foreign keys, constraints, and WAL mode.
10. **Error Handling:** API routes have try-catch blocks with appropriate error responses.

---

## Build Verification Results

```
✓ npm install — 0 vulnerabilities
✓ npm run build — Compiled successfully in 6.2s
✓ TypeScript — No type errors
✓ 18 pages generated (mix of static and dynamic)
⚠ 1 warning: Turbopack NFT trace warning for database.ts filesystem operations
⚠ Middleware deprecation warning (Next.js 16 recommends "proxy" over "middleware")
```

---

## Priority Fix Order

1. **🔴 Decide on database strategy** — SQLite + Netlify serverless is fundamentally incompatible for persistent data. Switch to Turso, Neon, PlanetScale, or deploy on a VPS.
2. **🔴 Fix JWT secret** — Remove hardcoded fallback, require env variable.
3. **🔴 Remove `data/database.sqlite` from git** — Add to `.gitignore`.
4. **⚠️ Remove `.netlify/` from git** — Add to `.gitignore`.
5. **⚠️ Clean up Supabase remnants** — Delete unused files.
6. **⚠️ Remove dead `netlify/functions/auth-session.ts`** — Conflicts with Next.js API route.
7. **⚠️ Remove dead `app/auth/callback/route.ts`** — Supabase remnant.
8. **ℹ️ Add `.env.example`** — Document required environment variables.
9. **ℹ️ Add input validation** — Use `zod` or similar for server-side validation.
10. **ℹ️ Consolidate type definitions** — Single source of truth.

---

*Report generated by Abacus AI Agent — April 8, 2026*
