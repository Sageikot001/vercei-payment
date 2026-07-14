import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { createAdminClient } from '@/lib/supabase/admin';

interface User {
  id: string;
  email: string;
  name: string;
}

export async function createUser(email: string, name: string, password: string): Promise<User | null> {
  const supabase = createAdminClient();
  const normalizedEmail = email.toLowerCase();

  const { data: existing, error: lookupError } = await supabase
    .from('profiles')
    .select('id, password_hash')
    .eq('email', normalizedEmail)
    .single();

  // PGRST116 = no rows returned (profile doesn't exist yet)
  if (lookupError && lookupError.code !== 'PGRST116') {
    throw new Error(`Profile lookup failed: ${lookupError.message}`);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // Profile exists without a password (synced before credentials moved to
  // Supabase) - let the owner claim it by setting a password
  if (existing && !existing.password_hash) {
    const { data: claimed, error: claimError } = await supabase
      .from('profiles')
      .update({ name, password_hash: hashedPassword, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('id, email, name')
      .single();

    if (claimError) {
      throw new Error(`Profile claim failed: ${claimError.message}`);
    }
    return claimed;
  }

  if (existing) return null;

  const { data: user, error: insertError } = await supabase
    .from('profiles')
    .insert({
      email: normalizedEmail,
      name,
      password_hash: hashedPassword,
    })
    .select('id, email, name')
    .single();

  if (insertError) {
    throw new Error(`Profile creation failed: ${insertError.message}`);
  }

  return user;
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const supabase = createAdminClient();

  const { data: user, error } = await supabase
    .from('profiles')
    .select('id, email, name, password_hash')
    .eq('email', email.toLowerCase())
    .single();

  if (error || !user || !user.password_hash) return null;

  const valid = await bcrypt.compare(password, user.password_hash);
  return valid ? { id: user.id, email: user.email, name: user.name } : null;
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
