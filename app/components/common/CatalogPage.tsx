import { Metadata } from 'next';

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllGoods } from '@/actions/goods';
import { generateMetadata } from '@/app/helpers/generateMetadata';
import { Breadcrumbs, GoodsSection, InfiniteScroll } from '@/components';
import prefetchData from '@/hooks/usePrefetchData';
import { IGoodUI, ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

interface GoodsData {
  goods: IGoodUI[];
}

interface CatalogPageProps {
  searchParams: Promise<ISearchParams>;
  role: UserRole;
}

export async function generateCatalogMetadata(
  searchParams: ISearchParams
): Promise<Metadata> {
  const searchQuery = searchParams.search
    ? `Результати пошуку: ${searchParams.search}`
    : '';

  return generateMetadata({
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
    url: `${process.env.PUBLIC_URL}/catalog`,
    imageUrl: '/services/02.webp',
    imageAlt: 'Каталог товарів ParoMaster',
  });
}

export default async function CatalogPage({
  searchParams,
  role,
}: CatalogPageProps) {
  const params = await searchParams;
  const queryClient = new QueryClient();
  const goodsKey = ['goods', params];

  await prefetchData(queryClient, getAllGoods, goodsKey, {
    ...params,
    limit: 4,
  });

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
  const goods = goodsData?.goods || [];

  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(params),
    getAllBrands(params),
  ]);

  const categories = (categoriesResponse.categories ?? [])
    .filter(c => c._id)
    .map(c => ({ value: String(c._id), label: c.name ?? 'Без назви' }));

  const brands = (brandsResponse.brands ?? [])
    .filter(b => b._id)
    .map(b => ({ value: String(b._id), label: b.name ?? 'Без назви' }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Каталог товарів</h2>

        {role === UserRole.ADMIN ? (
          <GoodsSection
            goods={goods}
            searchParams={params}
            categories={categories}
            brands={brands}
            role={role}
          />
        ) : (
          <InfiniteScroll
            initialGoods={goods}
            searchParams={params}
            categories={categories}
            brands={brands}
            role={role}
          />
        )}
      </div>
    </HydrationBoundary>
  );
}
