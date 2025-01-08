/*
  # Initial Schema Setup for Gym Management

  1. New Tables
    - `members`
      - `id` (uuid, primary key)
      - `name` (text)
      - `mobile` (text)
      - `plan_type` (text)
      - `amount_paid` (numeric)
      - `due_amount` (numeric)
      - `expiry_date` (timestamptz)
      - `join_date` (timestamptz)
      - `user_id` (uuid, foreign key to auth.users)
    
  2. Security
    - Enable RLS on `members` table
    - Add policies for authenticated users to:
      - Read their own members
      - Create new members
      - Update their own members
      - Delete their own members
*/

CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  mobile text NOT NULL,
  plan_type text NOT NULL,
  amount_paid numeric NOT NULL DEFAULT 0,
  due_amount numeric NOT NULL DEFAULT 0,
  expiry_date timestamptz NOT NULL,
  join_date timestamptz NOT NULL DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own members"
  ON members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create members"
  ON members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own members"
  ON members
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own members"
  ON members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);