-- ================================================================
-- Kim Thao Trang Jewelry - Database Setup Script
-- ================================================================
-- Run this entire script in your Supabase SQL Editor
-- Make sure to replace 'your-admin-email@example.com' with your actual admin email
-- ================================================================

-- ================================================================
-- 1. CREATE TABLES
-- ================================================================

-- Products table (jewelry items)
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('rings', 'necklaces', 'bracelets', 'earrings')),
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Favorites table (user's saved items)
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, product_id)
);

-- Inquiries table (customer contact messages)
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ================================================================
-- 2. ENABLE ROW LEVEL SECURITY (RLS)
-- ================================================================

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- ================================================================
-- 3. DROP EXISTING POLICIES (if any)
-- ================================================================

-- Products policies
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Admin can insert products" ON products;
DROP POLICY IF EXISTS "Admin can update products" ON products;
DROP POLICY IF EXISTS "Admin can delete products" ON products;

-- Favorites policies
DROP POLICY IF EXISTS "Users can view their own favorites" ON favorites;
DROP POLICY IF EXISTS "Users can add favorites" ON favorites;
DROP POLICY IF EXISTS "Users can remove favorites" ON favorites;

-- Inquiries policies
DROP POLICY IF EXISTS "Users can view their own inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can view all inquiries" ON inquiries;
DROP POLICY IF EXISTS "Anyone can create inquiries" ON inquiries;
DROP POLICY IF EXISTS "Admin can update inquiry status" ON inquiries;

-- ================================================================
-- 4. CREATE RLS POLICIES
-- ================================================================

-- -------------------- PRODUCTS POLICIES --------------------

-- Public read access (anyone can view products)
CREATE POLICY "Anyone can view products" ON products
  FOR SELECT 
  USING (true);

-- Admin can insert products
-- ⚠️ IMPORTANT: Replace 'your-admin-email@example.com' with your actual admin email
CREATE POLICY "Admin can insert products" ON products
  FOR INSERT 
  WITH CHECK (auth.email() = 'your-admin-email@example.com');

-- Admin can update products
CREATE POLICY "Admin can update products" ON products
  FOR UPDATE 
  USING (auth.email() = 'your-admin-email@example.com')
  WITH CHECK (auth.email() = 'your-admin-email@example.com');

-- Admin can delete products
CREATE POLICY "Admin can delete products" ON products
  FOR DELETE 
  USING (auth.email() = 'your-admin-email@example.com');

-- -------------------- FAVORITES POLICIES --------------------

-- Users can view their own favorites
CREATE POLICY "Users can view their own favorites" ON favorites
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can add favorites
CREATE POLICY "Users can add favorites" ON favorites
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can remove favorites
CREATE POLICY "Users can remove favorites" ON favorites
  FOR DELETE 
  USING (auth.uid() = user_id);

-- -------------------- INQUIRIES POLICIES --------------------

-- Users can view their own inquiries
CREATE POLICY "Users can view their own inquiries" ON inquiries
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin can view all inquiries
-- ⚠️ IMPORTANT: Replace 'your-admin-email@example.com' with your actual admin email
CREATE POLICY "Admin can view all inquiries" ON inquiries
  FOR SELECT 
  USING (auth.email() = 'your-admin-email@example.com');

-- Anyone can create inquiries (even non-logged-in users)
CREATE POLICY "Anyone can create inquiries" ON inquiries
  FOR INSERT 
  WITH CHECK (true);

-- Admin can update inquiry status
-- ⚠️ IMPORTANT: Replace 'your-admin-email@example.com' with your actual admin email
CREATE POLICY "Admin can update inquiry status" ON inquiries
  FOR UPDATE 
  USING (auth.email() = 'your-admin-email@example.com')
  WITH CHECK (auth.email() = 'your-admin-email@example.com');

-- ================================================================
-- 5. CREATE INDEXES FOR PERFORMANCE
-- ================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_product_id ON favorites(product_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);

-- ================================================================
-- 6. INSERT SAMPLE DATA (Optional - for testing)
-- ================================================================

-- Sample products (you can delete these and add your own)
INSERT INTO products (name, description, price, category, image_url) VALUES
  ('Gold Diamond Ring', 'Elegant 18K gold ring with diamond centerpiece', 2500.00, 'rings', '/images/rings.webp'),
  ('Pearl Necklace', 'Classic freshwater pearl necklace', 1800.00, 'necklaces', '/images/necklaces.webp'),
  ('Silver Bracelet', 'Sterling silver charm bracelet', 950.00, 'bracelets', '/images/bracelets.webp'),
  ('Diamond Earrings', 'Stunning diamond stud earrings', 3200.00, 'earrings', '/images/earrings.webp')
ON CONFLICT DO NOTHING;

-- ================================================================
-- SETUP COMPLETE! 
-- ================================================================
-- Next steps:
-- 1. Replace all instances of 'your-admin-email@example.com' with your actual admin email
-- 2. Go to Supabase Authentication → Providers → Enable Email provider
-- 3. Disable "Confirm email" (for development)
-- 4. Register an account with your admin email in the app
-- ================================================================