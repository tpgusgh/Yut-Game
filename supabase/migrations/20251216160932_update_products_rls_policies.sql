/*
  # Update Products RLS Policies

  1. Changes
    - Add INSERT policy for products
    - Add UPDATE policy for products
    - Add DELETE policy for products
    - Allow anyone to manage products (in production, this should be restricted to admins)
*/

-- Drop existing policy and create new ones
DROP POLICY IF EXISTS "Anyone can view active products" ON products;

-- Allow anyone to view all products (including inactive)
CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  USING (true);

-- Allow anyone to insert products
CREATE POLICY "Anyone can insert products"
  ON products FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update products
CREATE POLICY "Anyone can update products"
  ON products FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- Allow anyone to delete products
CREATE POLICY "Anyone can delete products"
  ON products FOR DELETE
  USING (true);
