import bcrypt from 'bcryptjs';
import { DefaultSession, NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';

import Customer from '@/models/Customer';
import User from '@/models/User';
import { connectToDB } from '@/utils/dbConnect';

import { routes } from '../helpers/routes';

// ---------- TYPE AUGMENTATION ----------
declare module 'next-auth' {
  interface Session {
    user: {
      _id: string;
      role?: string;
      phone?: string;
      surname?: string;
      city?: string;
      warehouse?: string;
      payment?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role?: string;
    phone?: string;
    surname?: string;
    city?: string;
    warehouse?: string;
    payment?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id?: string;
    role?: string;
    phone?: string;
    surname?: string;
    city?: string;
    warehouse?: string;
    payment?: string;
  }
}

// const allowedEmails = ['ivan.roschin86@gmail.com', 'paromaster2@gmail.com'];

export const authOptions: NextAuthOptions = {
  providers: [
    // ----------- GOOGLE -----------
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      async profile(profile) {
        await connectToDB();

        let user = await User.findOne({ googleId: profile.sub });

        if (!user) {
          user = await User.findOne({ email: profile.email });

          if (user) {
            // Пользователь есть, просто привязываем googleId
            user.googleId = profile.sub;
            await user.save();
          } else {
            // Пользователя нет — создаем нового
            user = await User.create({
              name: profile.name,
              surname: profile.family_name || '',
              email: profile.email,
              role: 'customer',
              googleId: profile.sub,
              phone: 'N/A',
            });
          }
        }

        return {
          id: user._id.toString(),
          name: user.name,
          surname: user.surname,
          email: user.email,
          role: user.role,
          phone: user.phone,
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
        // if (!allowedEmails.includes(user.email)) {
        //   throw new Error('You are not allowed to access admin panel');
        // }

        if (!user.password) {
          throw new Error('User has no password set');
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

  pages: { signIn: `${routes.publicRoutes.auth.signIn}` },
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,

  // ----------- CALLBACKS -----------
  callbacks: {
    async jwt({ token, user }) {
      // 1️⃣ Если юзер только что залогинился — сохраняем данные
      if (user) {
        token.id = (user as any).id?.toString();
        token.role = (user as any).role;
        token.phone = (user as any).phone;
        token.surname = (user as any).surname;

        // Загружаем связанные данные Customer
        const dbCustomer = await Customer.findOne({ user: token.id });
        if (dbCustomer) {
          token.city = dbCustomer.city;
          token.warehouse = dbCustomer.warehouse;
          token.payment = dbCustomer.payment;
        }
      }

      // 2️⃣ Если это не первый вызов (user undefined) — подтягиваем актуальные данные из БД
      if (token?.id && !user) {
        const dbUser = await User.findById(token.id);
        if (dbUser) {
          token.role = dbUser.role;
          token.phone = dbUser.phone;
          token.surname = dbUser.surname;
        }
        const dbCustomer = await Customer.findOne({ user: token.id });
        if (dbCustomer) {
          token.city = dbCustomer.city;
          token.warehouse = dbCustomer.warehouse;
          token.payment = dbCustomer.payment;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (token?.id) (session.user as any)._id = token.id;
      if (token?.role) (session.user as any).role = token.role;
      if (token?.phone) (session.user as any).phone = token.phone;
      if (token?.surname) (session.user as any).surname = token.surname;

      if (token?.city) (session.user as any).city = token.city;
      if (token?.warehouse) (session.user as any).warehouse = token.warehouse;
      if (token?.payment) (session.user as any).payment = token.payment;

      return session;
    },
    async redirect({ url, baseUrl }) {
      // после успешного логина → на /auth/redirect
      if (url.startsWith('/api/auth/callback'))
        return `${baseUrl}/auth/redirect`;
      return baseUrl;
    },
  },

  debug: process.env.NODE_ENV === 'development',
};
