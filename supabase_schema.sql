-- ==============================================================
-- ABCD SALON SUPABASE SCHEMA & TABLES
-- Copy and run this script in your Supabase SQL Editor if you
-- wish to use cloud Supabase Postgres instead of local JSON storage.
-- ==============================================================

-- 1. SALON INFORMATION TABLE
CREATE TABLE IF NOT EXISTS salon_info (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  name TEXT NOT NULL DEFAULT 'ABCD Salon',
  tagline TEXT DEFAULT 'Your Beauty, Our Passion',
  short_intro TEXT,
  description TEXT,
  address TEXT,
  city TEXT DEFAULT 'Mumbai',
  state TEXT DEFAULT 'Maharashtra',
  pincode TEXT DEFAULT '400050',
  phone TEXT DEFAULT '+91 98765 43210',
  whatsapp TEXT DEFAULT '+91 98765 43210',
  email TEXT DEFAULT 'appointments@abcdsalon.in',
  opening_hours TEXT DEFAULT 'Mon - Sun: 9:30 AM – 9:00 PM',
  closed_day TEXT DEFAULT 'Tuesday',
  google_maps_url TEXT,
  google_maps_embed TEXT,
  instagram TEXT,
  facebook TEXT,
  youtube TEXT,
  hero_headline TEXT DEFAULT 'Your Beauty, Our Passion.',
  hero_subheadline TEXT,
  hero_image TEXT,
  announcement_banner TEXT,
  show_announcement BOOLEAN DEFAULT true,
  about_title TEXT,
  about_story TEXT,
  about_image1 TEXT,
  about_image2 TEXT,
  years_of_excellence TEXT DEFAULT '8+',
  happy_clients TEXT DEFAULT '15,000+',
  expert_stylists TEXT DEFAULT '12',
  rating TEXT DEFAULT '4.9★',
  website_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. SERVICES TABLE
CREATE TABLE IF NOT EXISTS salon_services (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price NUMERIC NOT NULL,
  original_price NUMERIC,
  duration TEXT,
  description TEXT,
  image TEXT,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  display_order INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. SPECIAL OFFERS TABLE
CREATE TABLE IF NOT EXISTS salon_offers (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  original_price NUMERIC NOT NULL,
  discounted_price NUMERIC NOT NULL,
  discount_badge TEXT,
  image TEXT,
  start_date DATE NOT NULL,
  expiry_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  terms TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. PHOTO GALLERY TABLE
CREATE TABLE IF NOT EXISTS salon_gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ADMIN CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS salon_admin (
  id TEXT PRIMARY KEY DEFAULT 'admin',
  username TEXT NOT NULL UNIQUE DEFAULT 'admin',
  password_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE salon_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE salon_admin ENABLE ROW LEVEL SECURITY;

-- Allow public read on content tables
CREATE POLICY "Public read for salon_info" ON salon_info FOR SELECT USING (true);
CREATE POLICY "Public read for salon_services" ON salon_services FOR SELECT USING (true);
CREATE POLICY "Public read for salon_offers" ON salon_offers FOR SELECT USING (true);
CREATE POLICY "Public read for salon_gallery" ON salon_gallery FOR SELECT USING (true);

-- Allow full access to service role for authenticated admin updates
CREATE POLICY "Service role full access on salon_info" ON salon_info USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on salon_services" ON salon_services USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on salon_offers" ON salon_offers USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on salon_gallery" ON salon_gallery USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access on salon_admin" ON salon_admin USING (auth.role() = 'service_role');
