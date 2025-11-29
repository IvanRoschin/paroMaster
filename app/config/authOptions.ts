import { DefaultSession, DefaultUser, NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import Customer from '@/models/Customer';
import User from '@/models/User';
import { connectToDB } from '@/utils/dbConnect';
import { routes } from '../helpers/routes';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
      phone: string;
      surname: string;

      city: string;
      warehouse: string;
      payment: string;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;

    city?: string;
    warehouse?: string;
    payment?: string;
  }
}

// -------------------------------
// Helpers
// -------------------------------

async function loadUserData(userId: string) {
  const dbUser = await User.findById(userId).lean();
  const dbCustomer = await Customer.findOne({ user: userId }).lean();

  return {
    id: dbUser?._id?.toString(),
    role: dbUser?.role,
    phone: dbUser?.phone,
    surname: dbUser?.surname,

    city: dbCustomer?.city || '',
    warehouse: dbCustomer?.warehouse || '',
    payment: dbCustomer?.payment || '',
  };
}

// -------------------------------
// Auth Config
// -------------------------------

export const authOptions: NextAuthOptions = {
  pages: {
    signIn: routes.publicRoutes.auth.signIn,
  },

  session: {
    strategy: 'jwt',
  },

  providers: [
    Credentials({
      name: 'credentials',

      credentials: {
        phone: { label: 'Phone', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        if (!credentials?.phone || !credentials?.password) return null;

        await connectToDB();

        const user = await User.findOne({ phone: credentials.phone });
        if (!user) return null;

        const isCorrect = user.comparePassword(credentials.password);

        if (!isCorrect) return null;

        return {
          id: user._id.toString(),
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,

      async profile(profile) {
        await connectToDB();

        let user = await User.findOne({ googleId: profile.sub });

        if (!user) {
          user = await User.findOne({ email: profile.email });

          if (user) {
            user.googleId = profile.sub;
            await user.save();
          } else {
            user = await User.create({
              name: profile.given_name,
              surname: profile.family_name || '',
              email: profile.email,
              googleId: profile.sub,
              phone: '',
              role: 'customer',
            });
          }
        }

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

  // -------------------------------
  // JWT callback
  // -------------------------------
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      await connectToDB();

      // 1) Login → записываем только id
      if (user) {
        token.id = (user as any).id;
      }

      // 2) update() → обновляем только переданные поля
      if (trigger === 'update' && session?.user) {
        for (const key of Object.keys(session.user)) {
          (token as any)[key] = (session.user as any)[key];
        }
        return token;
      }

      // 3) Любой обычный вызов → загружаем свежие данные из БД
      if (token.id) {
        const fullData = await loadUserData(token.id.toString());
        Object.assign(token, fullData);
      }

      return token;
    },

    // -------------------------------
    // Session → отдаём ровно то, что в JWT
    // -------------------------------
    async session({ session, token }) {
      session.user = {
        id: token.id,
        role: token.role || '',
        phone: token.phone || '',
        surname: token.surname || '',

        city: token.city || '',
        warehouse: token.warehouse || '',
        payment: token.payment || '',
      };

      return session;
    },
  },
};
