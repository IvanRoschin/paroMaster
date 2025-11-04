import '../ui/globals.css';

import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Script from 'next/script';
import { ReactNode } from 'react';

import { SessionUser, UserRole } from '@/types/IUser';

import { Header, Sidebar } from '../components';
import CustomerLayout from '../components/layouts/CustomerLayout';
import FooterServer from '../components/sections/FooterServer';
import { authOptions } from '../config/authOptions';
import { routes } from '../helpers/routes';
import { Providers } from '../providers/providers';
import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
} from '../ui/fonts/index';

export default async function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const user: SessionUser | null = session?.user
    ? {
        name: session.user.name ?? 'Guest',
        email: session.user.email ?? '',
        image: session.user.image ?? `${process.env.PUBLIC_URL}/noavatar.png`,
        role: (session.user.role as UserRole) ?? UserRole.CUSTOMER,
      }
    : null;

  if (!user || user.role !== UserRole.CUSTOMER)
    redirect(routes.publicRoutes.auth.signIn);

  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${manrope.variable} ${eUkraine.variable} antialiased`}
    >
      <body className="font-manrope text-gray-900">
        <Providers>
          {user && <Header user={user} />}
          <div className="px-8 flex items-start flex-col md:flex-row">
            {user && <Sidebar user={user} />}
            <CustomerLayout user={user}>{children}</CustomerLayout>
          </div>
          <section id="footer" className="snap-start px-4">
            <FooterServer />
          </section>
        </Providers>

        {/* Cloudinary Upload Widget */}
        <Script
          src="https://widget.cloudinary.com/v2.0/global/all.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
