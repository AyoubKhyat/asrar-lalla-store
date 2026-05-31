-- ASRAR LALLA — Supabase Database Schema
-- Run this in the Supabase SQL Editor to set up all tables

-- ============================================
-- PRODUCTS
-- ============================================
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('visage', 'corps', 'cheveux', 'lèvres', 'yeux')),
  price DECIMAL(10,2) NOT NULL,
  old_price DECIMAL(10,2),
  description TEXT NOT NULL DEFAULT '',
  tagline TEXT NOT NULL DEFAULT '',
  benefits TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  how_to_use TEXT NOT NULL DEFAULT '',
  stock INTEGER NOT NULL DEFAULT 0,
  is_trending BOOLEAN NOT NULL DEFAULT FALSE,
  is_best_seller BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  badge TEXT,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  reviews_count INTEGER NOT NULL DEFAULT 0,
  color TEXT NOT NULL DEFAULT '#FFCFE1',
  gradient TEXT[] NOT NULL DEFAULT '{#FFCFE1,#FFB5D0}',
  packaging TEXT NOT NULL DEFAULT 'jar' CHECK (packaging IN ('bottle','jar','tube','stick','dropper','spray','bar','pot')),
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ORDERS
-- ============================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ref TEXT UNIQUE NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_city TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  customer_notes TEXT,
  total DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new','confirmed','shipped','delivered','cancelled')),
  source TEXT NOT NULL DEFAULT 'website' CHECK (source IN ('website','whatsapp','instagram','other')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_ref ON orders(ref);
CREATE INDEX idx_orders_phone ON orders(customer_phone);

-- ============================================
-- ORDER ITEMS
-- ============================================
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id TEXT NOT NULL REFERENCES products(id),
  product_name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ============================================
-- REVIEWS
-- ============================================
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id TEXT NOT NULL REFERENCES products(id),
  customer_name TEXT NOT NULL,
  customer_city TEXT,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  text TEXT NOT NULL,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  is_visible BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_visible ON reviews(is_visible);

-- ============================================
-- DELIVERY PRICES
-- ============================================
CREATE TABLE delivery_prices (
  id SERIAL PRIMARY KEY,
  city TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  delay TEXT NOT NULL DEFAULT '48-72h',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- ============================================
-- PROMO / SITE SETTINGS
-- ============================================
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Default settings
INSERT INTO site_settings (key, value) VALUES
  ('whatsapp_number', '212600000000'),
  ('free_shipping_threshold', '99'),
  ('promo_banner_text', '🚚 Livraison offerte à partir de 99 DH · Paiement à la livraison 💵'),
  ('promo_banner_enabled', 'true'),
  ('admin_pin', '1234');

-- Default delivery prices
INSERT INTO delivery_prices (city, price, delay, sort_order) VALUES
  ('Casablanca', 0, '24h', 1),
  ('Rabat', 0, '24h', 2),
  ('Marrakech', 0, '24-48h', 3),
  ('Fès', 10, '48h', 4),
  ('Tanger', 10, '48h', 5),
  ('Agadir', 10, '48-72h', 6),
  ('Meknès', 10, '48h', 7),
  ('Oujda', 15, '72h', 8),
  ('Tétouan', 10, '48-72h', 9),
  ('Kénitra', 0, '24-48h', 10),
  ('Autres villes', 15, '48-72h', 99);

-- Auto-update updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Generate order reference
CREATE OR REPLACE FUNCTION generate_order_ref()
RETURNS TRIGGER AS $$
DECLARE
  year_str TEXT;
  next_num INTEGER;
BEGIN
  year_str := TO_CHAR(NOW(), 'YYYY');
  SELECT COALESCE(MAX(
    CAST(SPLIT_PART(ref, '-', 3) AS INTEGER)
  ), 0) + 1 INTO next_num
  FROM orders
  WHERE ref LIKE 'AL-' || year_str || '-%';
  NEW.ref := 'AL-' || year_str || '-' || LPAD(next_num::TEXT, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER orders_generate_ref BEFORE INSERT ON orders FOR EACH ROW WHEN (NEW.ref IS NULL OR NEW.ref = '') EXECUTE FUNCTION generate_order_ref();
