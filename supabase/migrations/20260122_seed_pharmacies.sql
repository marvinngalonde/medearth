-- =====================================================
-- Migration: Seed Pharmacies
-- =====================================================

-- Ensure Pharmacies table has correct columns (idempotent check)
CREATE TABLE IF NOT EXISTS pharmacies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0,
  image_url TEXT,
  is_open BOOLEAN DEFAULT TRUE,
  delivery_fee DECIMAL(10, 2) DEFAULT 0,
  delivery_time TEXT,
  phone TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  owner_id UUID REFERENCES auth.users(id), -- Optional linking for now
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Turn on RLS
ALTER TABLE pharmacies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can view active pharmacies" ON pharmacies;
CREATE POLICY "Public can view active pharmacies" ON pharmacies FOR SELECT USING (is_active = true);

-- Insert Mock Data (Only if empty)
INSERT INTO pharmacies (name, address, rating, image_url, is_open, delivery_fee, delivery_time, phone)
SELECT 'HealthPlus Pharmacy', '123 Main St, Harare', 4.8, 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=800&q=80', true, 2.99, '20-30 min', '+263771234567'
WHERE NOT EXISTS (SELECT 1 FROM pharmacies WHERE name = 'HealthPlus Pharmacy');

INSERT INTO pharmacies (name, address, rating, image_url, is_open, delivery_fee, delivery_time, phone)
SELECT 'City Care Chemist', '456 Samora Machel Ave', 4.5, 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&q=80', true, 0.00, '30-45 min', '+263777654321'
WHERE NOT EXISTS (SELECT 1 FROM pharmacies WHERE name = 'City Care Chemist');

INSERT INTO pharmacies (name, address, rating, image_url, is_open, delivery_fee, delivery_time, phone)
SELECT 'MediLife Drugstore', 'Avondale Shops', 4.2, 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=800&q=80', false, 5.00, 'Closed', '+263712345678'
WHERE NOT EXISTS (SELECT 1 FROM pharmacies WHERE name = 'MediLife Drugstore');
