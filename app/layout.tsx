import { dehydrate, QueryClient } from '@tanstack/react-query';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth';
import Script from 'next/script';

import { ISearchParams } from '../types';
import { IGetAllBrands } from './actions/brands';
import { getAllCategories, IGetAllCategories } from './actions/categories';
import { getMinMaxPrice } from './actions/goods';
import AdminSidebar from './admin/components/AdminSidebar';
import { Footer, Header, Sidebar } from './components';
import { authOptions } from './config/authOptions';
import { Providers } from './providers/providers';
import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
} from './ui/fonts/index';

import './globals.css';

const baseUrl = process.env.PUBLIC_URL || 'https://paro-master.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'ParoMaster',
    template: '%s | ParoMaster',
  },
  description: 'Веб-сайт по ремонту парогенераторів',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  const queryClient = new QueryClient();

  // Prefetch данных
  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['prices'],
      queryFn: getMinMaxPrice,
    }),
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => getAllCategories({} as ISearchParams),
    }),
    // queryClient.prefetchQuery({ queryKey: ['brands'], queryFn: uniqueBrands }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  const pricesData = queryClient.getQueryData<IGetPrices>(['prices']) ?? {
    success: false,
    minPrice: 0,
    maxPrice: 100,
  };
  const categoriesData = queryClient.getQueryData<IGetAllCategories>([
    'categories',
  ]) ?? {
    success: false,
    count: 0,
    categories: [],
  };

  const brandsData = queryClient.getQueryData<IGetAllBrands>(['brands']) ?? {
    success: false,
    count: 0,
    brands: [],
  };

  const user = session?.user
    ? {
        name: session.user.name ?? 'Guest',
        email: session.user.email ?? '',
        image: session.user.image ?? `${process.env.PUBLIC_URL}/noavatar.png`,
      }
    : null;

  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${manrope.variable} ${eUkraine.variable} antialiased`}
    >
      <body className={`font-manrope primaryTextColor ?? "text-gray-900"}`}>
        <Providers dehydratedState={dehydratedState}>
          <Header session={session} />
          <div className="px-8 flex items-start flex-col md:flex-row">
            {user ? (
              <>
                <AdminSidebar user={user} />
                <div className="w-full">{children}</div>
              </>
            ) : (
              <>
                <Sidebar
                  pricesData={pricesData}
                  categoriesData={categoriesData}
                  brandsData={brandsData}
                />
                <div className="w-full">{children}</div>
              </>
            )}
          </div>
          <section id="footer" className="snap-start px-4">
            <Footer categories={categoriesData.categories} />
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
