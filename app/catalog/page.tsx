import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { Metadata } from 'next';

import { getAllGoods } from '@/actions/goods';
import { Breadcrumbs, InfiniteScroll } from '@/components/index';
import prefetchData from '@/hooks/usePrefetchData';
import { IGoodUI, ISearchParams } from '@/types/index';

// app/catalog/page.tsx

interface GoodsData {
  goods: IGoodUI[];
}

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
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
  openGraph: {
    title: 'Каталог товарів | ParoMaster',
    description:
      'Перегляньте повний каталог запчастин та обладнання для парогенераторів.',
    url: `${process.env.PUBLIC_URL}/catalog`,
    siteName: 'ParoMaster',
    images: [
      {
        url: '/services/03.webp',
        width: 1200,
        height: 630,
        alt: 'Каталог товарів ParoMaster',
      },
    ],
  },
};

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;
  const queryClient = new QueryClient();

  const goodsKey = ['goods', params];

  await prefetchData(queryClient, getAllGoods, goodsKey, {
    ...params,
    limit: 8,
  });

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
  const goods = goodsData?.goods || [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Каталог товарів</h2>
        <InfiniteScroll initialGoods={goods} searchParams={params} />
      </div>
    </HydrationBoundary>
  );
}
