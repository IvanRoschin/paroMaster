import { getServerSession } from 'next-auth';

import { CatalogPage } from '@/app/components';
import { authOptions } from '@/app/config/authOptions';
import { generateMetadata } from '@/app/helpers/generateMetadata';
import { ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface CustomerGoodsPageProps {
  searchParams: Promise<ISearchParams>;
}

export const metadata = generateMetadata({
  title: 'Каталог товарів | ParoMaster',
  description:
    'Великий каталог товарів для парогенераторів: запчастини, аксесуари, обладнання. Доставка по Україні. ParoMaster – надійний партнер у ремонті та сервісі.',
  keywords: [
    'каталог товарів',
    'запчастини для парогенератора',
    'купити парогенератор',
    'ремонт парогенератора',
    'ParoMaster',
  ],
  url: process.env.PUBLIC_URL,
  extra: {
    openGraph: {
      url: `${process.env.PUBLIC_URL}/catalog`,
    },
  },
  imageUrl: '/services/02.webp',
  imageAlt: 'Каталог товарів ParoMaster',
});

export default async function CustomerGoodsPage({
  searchParams,
}: CustomerGoodsPageProps) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;

  return <CatalogPage searchParams={Promise.resolve(params)} role={role} />;
}
