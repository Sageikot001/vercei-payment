-- Move credential storage into Supabase (replaces local users.json)
-- Run this in your Supabase SQL editor

-- Profiles are managed by NextAuth credentials, not Supabase Auth
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
ALTER TABLE profiles ALTER COLUMN id SET DEFAULT uuid_generate_v4();

-- Store bcrypt password hashes for the NextAuth credentials provider
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;

-- Emails must be unique since they are the login identifier
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email ON profiles (email);
