import '../ui/globals.css';

import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Script from 'next/script';
import { ReactNode } from 'react';

import { SessionUser, UserRole } from '@/types/IUser';

import { Header } from '../components';
import PublicLayout from '../components/layouts/PublicLayout';
import FooterServer from '../components/sections/FooterServer';
import { authOptions } from '../config/authOptions';
import { Providers } from '../providers/providers';
import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
} from '../ui/fonts/index';
import PublicSidebarServer from './components/PublicSidebarSidebarServer';

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL || 'https://paromaster.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'ParoMaster',
    template: '%s | ParoMaster',
  },
  description: 'Магазин запчасти та послуги з ремонту парогенераторів',
  keywords: [
    'ремонт парогенераторів Київ',
    'запчастини для парогенератора',
    'майстер по ремонту парогенераторів',
    'купити парогенератор б/у',
    'ремонт побутової техніки Київ',
  ],
  authors: [{ name: process.env.NEXT_PUBLIC_ADMIN_NAME || 'ParoMaster' }],
  creator: 'ParoMaster Team',
  metadataBase: new URL(baseUrl),
  openGraph: {
    type: 'website',
    url: baseUrl,
    title: 'ParoMaster',
    description:
      'Веб-сайт по ремонту парогенераторів та продажу запчастин до парогенераторів',
    siteName: 'ParoMaster',
    images: [
      {
        url: `${baseUrl}/dervices/03.webp`,
        width: 1200,
        height: 630,
        alt: 'ParoMaster Preview',
      },
    ],
  },
};

export default async function PublicRootLayout({
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

  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${manrope.variable} ${eUkraine.variable} antialiased`}
    >
      <body className="font-manrope text-gray-900">
        <Providers>
          <Header user={user} />
          <div className="px-8 flex items-start flex-col md:flex-row">
            <PublicSidebarServer />
            <PublicLayout user={user}>{children}</PublicLayout>
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
