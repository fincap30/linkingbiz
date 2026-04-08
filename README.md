# LinkingBiz - B2B Marketplace & Referral Platform

A modern Next.js application for connecting businesses and tracking referrals.

## Tech Stack

- **Framework**: Next.js 16+ with App Router
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Icons**: Lucide React

## Project Structure

```
linkingbiz/
├── app/                    # Next.js app router
│   ├── auth/              # Auth routes
│   ├── dashboard/         # Dashboard routes
│   ├── hub/               # Marketplace
│   ├── business/          # Business profiles
│   ├── admin/             # Admin dashboard
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   └── ui/                # shadcn/ui components
├── lib/
│   ├── utils.ts           # Utility functions
│   └── supabase/          # Supabase clients
├── types/                 # TypeScript types
└── supabase/              # Database schema
```

## Features

1. **User Authentication** - Register/login for businesses & referrers
2. **Business Profiles** - Create and manage business listings
3. **Referral Tracking** - Track referrals and commissions
4. **Hub Marketplace** - Browse and search businesses
5. **Admin Dashboard** - Manage users, listings, and payments

## Environment Variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)
