import bcrypt from 'bcrypt';
import { DefaultSession, NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import User from '@/models/User';
import { connectToDB } from '@/utils/dbConnect';

// ---------- TYPE AUGMENTATION ----------
declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      role?: string;
      phone?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: string;
    phone?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    phone?: string;
  }
}

const allowedEmails = ['ivan.roschin86@gmail.com', 'paromaster2@gmail.com'];

export const authOptions: NextAuthOptions = {
  providers: [
    // ----------- GOOGLE -----------
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          role: 'CUSTOMER',
          phone: '',
        };
      },
    }),

    // ----------- CREDENTIALS -----------
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email', required: true },
        password: { label: 'Password', type: 'password', required: true },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          throw new Error('Invalid credentials');
        }

        await connectToDB();
        const user = await User.findOne({ email: credentials.email });

        if (!user) throw new Error('User not found');
        if (!user.isActive) throw new Error('User is not active');

        // Проверяем права (опционально)
        if (!allowedEmails.includes(user.email)) {
          throw new Error('You are not allowed to access admin panel');
        }

        const isPasswordCorrect = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isPasswordCorrect) throw new Error('Wrong password');

        // ✅ возвращаем объект с `id`, как требует NextAuth
        return {
          id: user._id.toString(),
          name: user.name,
          surname: user.surname,
          email: user.email,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],

  pages: { signIn: '/login' },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  // ----------- CALLBACKS -----------
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id?.toString();
        token.role = (user as any).role;
        token.phone = (user as any).phone;
        const dbUser = await User.findById((user as any).id);
        token.token = dbUser?.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as any)._id = token.id.toString();
      if (token?.role) (session.user as any).role = token.role as string;
      if (token?.phone) (session.user as any).phone = token.phone as string;
      if (token?.token) (session.user as any).token = token.token as string;
      return session;
    },
    async redirect({ baseUrl }) {
      return `${baseUrl}`;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
