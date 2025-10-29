import { Metadata } from 'next';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { IGoodUI, ISearchParams } from '@/types/index';
import prefetchData from '@/hooks/usePrefetchData';
import { Breadcrumbs, InfiniteScroll } from '@/components/index';
import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllGoods } from '@/actions/goods';

interface GoodsData {
  goods: IGoodUI[];
}

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

export default async function CatalogPage(props: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await props.searchParams;
  const queryClient = new QueryClient();

  const goodsKey = ['goods', params];

  await prefetchData(queryClient, getAllGoods, goodsKey, {
    ...params,
    limit: 8,
  });

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
  const goods = goodsData?.goods || [];

  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(params),
    getAllBrands(params),
  ]);

  const categories = (categoriesResponse.categories ?? [])
    .filter(c => c._id)
    .map(c => ({
      value: String(c._id),
      label: c.name ?? 'Без назви',
    }));

  const brands = (brandsResponse.brands ?? [])
    .filter(b => b._id)
    .map(b => ({
      value: String(b._id),
      label: b.name ?? 'Без назви',
    }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Каталог товарів</h2>
        <InfiniteScroll
          initialGoods={goods}
          searchParams={params}
          categories={categories}
          brands={brands}
        />
      </div>
    </HydrationBoundary>
  );
}
