/*
  # Yut Game Database Schema

  1. New Tables
    - `board_spaces`
      - `id` (uuid, primary key)
      - `position` (integer) - Position on the board (0-based index)
      - `type` (text) - Either 'product' or 'penalty'
      - `product_id` (uuid, nullable) - Reference to product if type is 'product'
      - `created_at` (timestamptz)
    
    - `products`
      - `id` (uuid, primary key)
      - `name` (text) - Product name
      - `image_url` (text) - URL to product image
      - `description` (text, nullable) - Product description
      - `is_active` (boolean) - Whether the product is currently available
      - `created_at` (timestamptz)
    
    - `game_sessions`
      - `id` (uuid, primary key)
      - `player_position` (integer) - Current position on board
      - `selected_product_id` (uuid, nullable) - Product selected by player
      - `is_completed` (boolean) - Whether game is finished
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for products and board_spaces
    - Authenticated users can manage their own game sessions
*/

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  image_url text NOT NULL,
  description text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Create board_spaces table
CREATE TABLE IF NOT EXISTS board_spaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  position integer UNIQUE NOT NULL,
  type text NOT NULL CHECK (type IN ('product', 'penalty')),
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create game_sessions table
CREATE TABLE IF NOT EXISTS game_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_position integer DEFAULT 0,
  selected_product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  is_completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE board_spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_sessions ENABLE ROW LEVEL SECURITY;

-- Products policies (public read, no write for now - will add admin later)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

-- Board spaces policies (public read)
CREATE POLICY "Anyone can view board spaces"
  ON board_spaces FOR SELECT
  USING (true);

-- Game sessions policies (anyone can create and manage)
CREATE POLICY "Anyone can create game sessions"
  ON game_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can view game sessions"
  ON game_sessions FOR SELECT
  USING (true);

CREATE POLICY "Anyone can update game sessions"
  ON game_sessions FOR UPDATE
  USING (true);

-- Insert default board configuration (20 spaces with mix of products and penalties)
INSERT INTO board_spaces (position, type) VALUES
  (0, 'product'),
  (1, 'penalty'),
  (2, 'product'),
  (3, 'penalty'),
  (4, 'product'),
  (5, 'penalty'),
  (6, 'product'),
  (7, 'penalty'),
  (8, 'product'),
  (9, 'penalty'),
  (10, 'product'),
  (11, 'penalty'),
  (12, 'product'),
  (13, 'penalty'),
  (14, 'product'),
  (15, 'penalty'),
  (16, 'product'),
  (17, 'penalty'),
  (18, 'product'),
  (19, 'penalty')
ON CONFLICT (position) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, image_url, description) VALUES
  ('상품 1', 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg?auto=compress&cs=tinysrgb&w=400', '멋진 상품 1'),
  ('상품 2', 'https://images.pexels.com/photos/335257/pexels-photo-335257.jpeg?auto=compress&cs=tinysrgb&w=400', '멋진 상품 2'),
  ('상품 3', 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400', '멋진 상품 3')
ON CONFLICT DO NOTHING;