# Aura Blog Platform 🚀

A premium, cloud-based blog platform built with **Next.js 15 (App Router)** and **Supabase**.

## Features
- **Modern Design**: Dark mode, glassmorphism, and smooth animations with Framer Motion.
- **Supabase Integration**: Authentication, Postgres Database, and Row-Level Security (RLS).
- **Markdown Support**: Write posts in markdown with live rendering.
- **Dynamic SEO**: Auto-generated metadata and sitemap.
- **Interactive Comments**: Engage with readers through a custom comment system.

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd blog
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure Supabase
1. Create a new project at [supabase.com](https://supabase.com).
2. Copy your **Project URL** and **Anon Key** to `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```
3. Run the SQL script found in `supabase/setup.sql` in your Supabase SQL Editor to create tables and RLS policies.

### 4. Run locally
```bash
npm run dev
```

## Deployment

1. Push your code to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. Add the environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in the Vercel dashboard.
4. Deploy!

## Architecture
- **Frontend**: Next.js (TypeScript, Tailwind CSS v4)
- **Backend**: Supabase (Auth, Postgres, Storage)
- **Deployment**: Vercel
