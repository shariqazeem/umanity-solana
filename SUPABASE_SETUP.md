# Supabase Setup Guide

## Quick Setup (5 minutes)

### 1. Create Supabase Project
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub
4. Click "New Project"
5. Choose organization and create project
6. Wait 2 minutes for setup

### 2. Get Your API Keys
1. In your project dashboard, click "Settings" (gear icon)
2. Click "API" in the left sidebar
3. Copy these two values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)

### 3. Update .env.local
Replace the placeholder values in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Database Schema
1. In Supabase dashboard, click "SQL Editor" in left sidebar
2. Click "New query"
3. Copy the entire contents of `supabase-schema.sql`
4. Paste into the SQL editor
5. Click "Run" (or press Cmd/Ctrl + Enter)
6. You should see "Success. No rows returned" ✓

### 5. Restart Dev Server
```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Verify Setup
1. Go to "Table Editor" in Supabase dashboard
2. You should see 5 tables: `users`, `donations`, `tips`, `pools`, `pool_donations`
3. The `pools` table should have 4 rows already

## That's it!
Your app now has persistent storage. User registrations, donations, and tips will survive page refreshes!

## Troubleshooting
- **"Invalid API key"**: Make sure you copied the anon/public key, not the service_role key
- **"Project URL is required"**: Check that `.env.local` has the correct URL format
- **Server not restarting**: Kill all node processes and run `npm run dev` again
