# Umanity Solana - Quick Start Guide

## 🚀 YOU NEED TO DO THIS NOW (5 minutes)

Your app is running on **http://localhost:3001** but **data won't persist** until you set up Supabase.

### Step 1: Create Supabase Project (2 minutes)

1. Go to https://supabase.com
2. Click "Start your project" → Sign in with GitHub
3. Click "New Project"
4. Name it "umanity-solana"
5. Set a strong password (save it!)
6. Choose closest region
7. Click "Create new project"
8. **Wait 2 minutes** for setup to complete

### Step 2: Get API Keys (1 minute)

1. In your Supabase dashboard, click **"Settings"** (gear icon bottom left)
2. Click **"API"** in the left sidebar
3. You'll see two values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon/public key**: Long string starting with `eyJ...`

### Step 3: Update .env.local (30 seconds)

Open the file `.env.local` in your project root and replace:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...your-actual-key
```

### Step 4: Run Database Schema (1 minute)

1. In Supabase dashboard, click **"SQL Editor"** in left sidebar
2. Click **"New query"**
3. Open the file `supabase-schema.sql` in your project
4. Copy ALL the contents
5. Paste into the SQL editor
6. Click **"Run"** button (or press Cmd/Ctrl + Enter)
7. You should see: ✅ **"Success. No rows returned"**

### Step 5: Restart Server (30 seconds)

```bash
# In your terminal, stop the server (Ctrl+C)
# Then restart:
npm run dev
```

## ✅ Verify It's Working

1. Open **http://localhost:3001**
2. Go to "Tips" tab
3. Click "Connect Wallet" → Connect Phantom wallet
4. Register a profile (username, display name, bio)
5. **Refresh the page** - your profile should still be there! 🎉

## 📊 View Your Data

In Supabase dashboard:
- Click **"Table Editor"**
- You'll see 5 tables: `users`, `donations`, `tips`, `pools`, `pool_donations`
- Click on any table to see real-time data
- The `pools` table already has 4 charity pools

## 🎯 Features Now Working

✅ **User Registration** - Persists across refreshes
✅ **Reward Points** - Saved to database, visible to all users
✅ **Donations** - All donations tracked with full stats
✅ **Tips** - Tipping system with full history
✅ **Transparency** - All data viewable in Supabase dashboard

## 🐛 Troubleshooting

**"Invalid API key"**
- Make sure you copied the **anon/public** key, NOT the service_role key
- Check for extra spaces in .env.local

**"Project URL is required"**
- Verify the URL starts with `https://` and ends with `.supabase.co`

**Data still not persisting**
- Did you restart the dev server after updating .env.local?
- Check the SQL query ran successfully (green success message)
- Open browser console (F12) and check for errors

**Server won't start**
- Run: `killall node` then `npm run dev`

## 🎨 Test the Full Flow

1. **Register** a profile in Tips section
2. **Donate** $2 in the Donate tab → Check your reward points
3. **Register** another wallet (use different browser or incognito)
4. **Tip** between the two users
5. **Refresh** page → All data should persist!
6. **Check Supabase** Table Editor to see all records

## 🔥 You're Ready for the Hackathon!

All features working:
- ✅ Persistent user profiles
- ✅ One-tap donations with rewards
- ✅ Custom donation pools
- ✅ Tipping system with rewards
- ✅ Real-time stats
- ✅ Full transparency
- ✅ Solana blockchain integration

**App running at:** http://localhost:3001
