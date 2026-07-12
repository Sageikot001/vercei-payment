import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import fs from 'fs';
import path from 'path';

interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
}

function loadUsers(): User[] {
  ensureDataDir();
  if (!fs.existsSync(USERS_FILE)) {
    return [];
  }
  try {
    const data = fs.readFileSync(USERS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function saveUsers(users: User[]) {
  ensureDataDir();
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

export async function createUser(email: string, name: string, password: string): Promise<User | null> {
  const users = loadUsers();
  const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (exists) return null;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: `user_${Date.now()}`,
    email: email.toLowerCase(),
    name,
    password: hashedPassword,
  };
  users.push(user);
  saveUsers(users);
  return user;
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const users = loadUsers();
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
}

async function syncUserToSupabase(user: { id: string; email: string; name: string }): Promise<void> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.log('Supabase not configured, skipping sync');
    return;
  }

  // Dynamic import to avoid module issues
  const { createClient } = await import('@supabase/supabase-js');
  const supabase = createClient(supabaseUrl, supabaseKey);

  // Check if profile exists
  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id')
    .eq('email', user.email)
    .single();

  // PGRST116 = no rows returned (profile doesn't exist yet)
  if (lookupError && lookupError.code !== 'PGRST116') {
    throw new Error(`Profile lookup failed: ${lookupError.message}`);
  }

  if (existing) {
    // Update existing profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ name: user.name, updated_at: new Date().toISOString() })
      .eq('email', user.email);

    if (updateError) {
      throw new Error(`Profile update failed: ${updateError.message}`);
    }
  } else {
    // Create new profile - let Supabase generate the UUID
    const { error: insertError } = await supabase
      .from('profiles')
      .insert({
        email: user.email,
        name: user.name,
      });

    if (insertError) {
      throw new Error(`Profile creation failed: ${insertError.message}`);
    }
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await verifyUser(credentials.email, credentials.password);
        if (!user) return null;

        // Sync user to Supabase for dashboard data
        try {
          await syncUserToSupabase({
            id: user.id,
            email: user.email,
            name: user.name,
          });
        } catch (syncError) {
          console.error('Failed to sync user to Supabase:', syncError);
          // Continue with login even if sync fails - dashboard will handle missing profile
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  jwt: {
    maxAge: 3 * 24 * 60 * 60, // 3 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as { id?: string }).id = token.id as string;
      }
      return session;
    },
  },
};
