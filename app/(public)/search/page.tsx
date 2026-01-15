import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata, ResolvingMetadata } from 'next';
import { getServerSession } from 'next-auth';

import { getAllGoodsAction } from '@/actions/goods';
import { authOptions } from '@/app/config/authOptions';
import prefetchData from '@/app/hooks/usePrefetchData';
import { Breadcrumbs, EmptyState, InfiniteScroll } from '@/components/index';
import { IGoodUI } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface GoodsData {
  goods: IGoodUI[];
}

type Props = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const resolvedSearchParams = await searchParams;

  const q = Array.isArray(resolvedSearchParams?.q)
    ? resolvedSearchParams.q[0]
    : resolvedSearchParams?.q;
  const searchQuery = q ? `Результати пошуку: ${q}` : '';

  return {
    title: searchQuery
      ? `${searchQuery} | ParoMaster`
      : 'Каталог товарів | ParoMaster',
    description: searchQuery
      ? `Результати пошуку для "${q}" у каталозі ParoMaster. Великий вибір запчастин та обладнання.`
      : 'Великий каталог товарів для парогенераторів: запчастини, аксесуари, обладнання. Доставка по Україні. ParoMaster – надійний партнер у ремонті та сервісі.',
    keywords: [
      'каталог товарів',
      'запчастини для парогенератора',
      'купити парогенератор',
      'ремонт парогенератора',
      'ParoMaster',
    ],
    openGraph: {
      title: searchQuery
        ? `${searchQuery} | ParoMaster`
        : 'Каталог товарів | ParoMaster',
      description: searchQuery
        ? `Результати пошуку для "${q}" у каталозі ParoMaster. Великий вибір запчастин та обладнання.`
        : 'Великий каталог товарів для парогенераторів: запчастини, аксесуари, обладнання. Доставка по Україні. ParoMaster – надійний партнер у ремонті та сервісі.',
      url: `${process.env.PUBLIC_URL}/search`,
      images: [{ url: '/services/03.webp', alt: 'Каталог товарів ParoMaster' }],
    },
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;

  const queryClient = new QueryClient();
  const goodsKey = ['goods', params];
  const limit = role === UserRole.ADMIN ? 16 : 8;

  await prefetchData(queryClient, getAllGoodsAction, goodsKey, {
    ...params,
    limit,
  });
  const queryState = queryClient.getQueryState(goodsKey);
  const goods = (queryState?.data as { goods: IGoodUI[] })?.goods || [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <Breadcrumbs />
        <h2 className="title mb-1">Результати пошуку:</h2>
        {goods.length > 0 ? (
          <InfiniteScroll
            initialGoods={goods}
            searchParams={params}
            role={role}
          />
        ) : (
          <EmptyState showReset />
        )}
      </div>
    </HydrationBoundary>
  );
}
