import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

// In-memory user store (replace with database in production)
interface User {
  id: string;
  email: string;
  name: string;
  password: string;
}

const users: User[] = [];

export function getUsers() {
  return users;
}

export async function createUser(email: string, name: string, password: string): Promise<User | null> {
  const exists = users.find(u => u.email === email);
  if (exists) return null;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user: User = {
    id: `user_${Date.now()}`,
    email,
    name,
    password: hashedPassword,
  };
  users.push(user);
  return user;
}

export async function verifyUser(email: string, password: string): Promise<User | null> {
  const user = users.find(u => u.email === email);
  if (!user) return null;

  const valid = await bcrypt.compare(password, user.password);
  return valid ? user : null;
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
