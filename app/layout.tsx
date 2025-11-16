import { Suspense } from 'react';

import { dehydrate, QueryClient } from '@tanstack/react-query';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Script from 'next/script';

import {
  eUkraine,
  eUkrainehead,
  geistMono,
  geistSans,
  manrope,
} from '@/app/ui/fonts';
import { Header, Loader, Sidebar } from '@/components';
import AdminLayout from '@/components/layouts/AdminLayout';
import CustomerLayout from '@/components/layouts/CustomerLayout';
import PublicLayout from '@/components/layouts/PublicLayout';
import { SessionUser, UserRole } from '@/types/IUser';
import PublicSidebarServer from './(public)/components/PublicSidebarSidebarServer';
import { getAllBrandsAction } from './actions/brands';
import { getAllCategoriesAction } from './actions/categories';
import FooterServer from './components/sections/FooterServer';
import { authOptions } from './config/authOptions';
import { routes } from './helpers/routes';
import { Providers } from './providers/providers';

import '@/app/ui/globals.css';

// Шрифты (предполагаю, что ты их подключаешь где-то сверху)

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  const role = (session?.user?.role as UserRole) ?? UserRole.GUEST;
  // Унифицированный объект пользователя
  const user: SessionUser = {
    _id: session?.user?._id ?? '',
    name: session?.user?.name ?? 'Guest',
    email: session?.user?.email ?? '',
    image: session?.user?.image ?? `${process.env.PUBLIC_URL}/noavatar.png`,
    role,
  };

  // Если пользователь не ADMIN и не CUSTOMER, редиректим на вход
  if (![UserRole.ADMIN, UserRole.CUSTOMER, UserRole.GUEST].includes(role)) {
    redirect(routes.publicRoutes.auth.signIn);
  }

  // Выбор layout-а по роли
  const LayoutComponent =
    role === UserRole.ADMIN
      ? AdminLayout
      : role === UserRole.CUSTOMER
        ? CustomerLayout
        : PublicLayout;

  const showSidebar =
    role === UserRole.ADMIN || role === UserRole.CUSTOMER ? (
      <Sidebar />
    ) : (
      <PublicSidebarServer />
    );

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: () => getAllCategoriesAction(),
    }),
    queryClient.prefetchQuery({
      queryKey: ['brands'],
      queryFn: () => getAllBrandsAction(),
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <html
      lang="uk"
      className={`${geistSans.variable} ${geistMono.variable} ${eUkrainehead.variable} ${manrope.variable} ${eUkraine.variable} antialiased`}
    >
      <body className="font-manrope text-gray-900">
        <Providers dehydratedState={dehydratedState}>
          <Header user={user} />
          <aside className="px-8 flex items-start flex-col md:flex-row">
            <Suspense fallback={<Loader />}>
              {showSidebar}
              <LayoutComponent user={user}>{children}</LayoutComponent>
            </Suspense>
          </aside>
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
