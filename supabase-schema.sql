-- Umanity Solana Database Schema
-- Run this in your Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR_PROJECT/editor

-- Users table
CREATE TABLE IF NOT EXISTS users (
  address TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  bio TEXT DEFAULT '',
  total_received DECIMAL(20, 9) DEFAULT 0,
  total_sent DECIMAL(20, 9) DEFAULT 0,
  total_donated DECIMAL(20, 9) DEFAULT 0,
  reward_points INTEGER DEFAULT 50,
  tip_count_received INTEGER DEFAULT 0,
  tip_count_sent INTEGER DEFAULT 0,
  donation_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Donations table
CREATE TABLE IF NOT EXISTS donations (
  id TEXT PRIMARY KEY,
  donor TEXT NOT NULL,
  amount DECIMAL(20, 9) NOT NULL,
  signature TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  type TEXT DEFAULT 'one-tap',
  reward_points_earned INTEGER DEFAULT 0,
  status TEXT DEFAULT 'pending'
);

-- Tips table
CREATE TABLE IF NOT EXISTS tips (
  id TEXT PRIMARY KEY,
  sender TEXT NOT NULL,
  recipient TEXT NOT NULL,
  recipient_username TEXT NOT NULL,
  amount DECIMAL(20, 9) NOT NULL,
  message TEXT DEFAULT '',
  signature TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  reward_points_earned INTEGER DEFAULT 0
);

-- Pools table
CREATE TABLE IF NOT EXISTS pools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  total_donated DECIMAL(20, 9) DEFAULT 0,
  donor_count INTEGER DEFAULT 0
);

-- Pool donations table
CREATE TABLE IF NOT EXISTS pool_donations (
  id TEXT PRIMARY KEY,
  donor TEXT NOT NULL,
  pool_id TEXT NOT NULL,
  pool_name TEXT NOT NULL,
  amount DECIMAL(20, 9) NOT NULL,
  signature TEXT UNIQUE NOT NULL,
  timestamp TIMESTAMP DEFAULT NOW(),
  reward_points_earned INTEGER DEFAULT 0,
  FOREIGN KEY (pool_id) REFERENCES pools(id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_donations_donor ON donations(donor);
CREATE INDEX IF NOT EXISTS idx_donations_timestamp ON donations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_tips_sender ON tips(sender);
CREATE INDEX IF NOT EXISTS idx_tips_recipient ON tips(recipient);
CREATE INDEX IF NOT EXISTS idx_tips_timestamp ON tips(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_pool_donations_donor ON pool_donations(donor);
CREATE INDEX IF NOT EXISTS idx_pool_donations_pool_id ON pool_donations(pool_id);

-- Insert default pools
INSERT INTO pools (id, name, description, total_donated, donor_count) VALUES
  ('medical', 'Medical Emergency Fund', 'Urgent medical care worldwide - Surgery, medicine, hospital care', 0, 0),
  ('education', 'Education for All', 'Quality education for underprivileged children - Books, tuition, supplies', 0, 0),
  ('disaster', 'Disaster Relief Fund', 'Emergency aid for disaster victims - Food, shelter, medical supplies', 0, 0),
  ('water', 'Clean Water Access', 'Clean drinking water for remote areas - Wells, filters, infrastructure', 0, 0)
ON CONFLICT (id) DO NOTHING;

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE pools ENABLE ROW LEVEL SECURITY;
ALTER TABLE pool_donations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Users are viewable by everyone" ON users FOR SELECT USING (true);
CREATE POLICY "Donations are viewable by everyone" ON donations FOR SELECT USING (true);
CREATE POLICY "Tips are viewable by everyone" ON tips FOR SELECT USING (true);
CREATE POLICY "Pools are viewable by everyone" ON pools FOR SELECT USING (true);
CREATE POLICY "Pool donations are viewable by everyone" ON pool_donations FOR SELECT USING (true);

-- Create policies for insert access (anyone can insert)
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert donations" ON donations FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert tips" ON tips FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can insert pool donations" ON pool_donations FOR INSERT WITH CHECK (true);

-- Create policies for update access (anyone can update)
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);
CREATE POLICY "Anyone can update pools" ON pools FOR UPDATE USING (true);
