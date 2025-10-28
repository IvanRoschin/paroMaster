import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllGoods } from '@/actions/goods';
import { Breadcrumbs, EmptyState, InfiniteScroll } from '@/components/index';
import { IGoodUI } from '@/types/index';
import { ISearchParams } from '@/types/searchParams';

interface GoodsData {
  goods: IGoodUI[];
}

export const dynamic = 'force-dynamic';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;
  const queryClient = new QueryClient();

  const goodsKey = ['goods', params];

  await queryClient.prefetchQuery({
    queryKey: goodsKey,
    queryFn: () => getAllGoods(params),
  });
  const queryState = queryClient.getQueryState(goodsKey);

  const goods = (queryState?.data as GoodsData)?.goods || [];

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
      <div className="container">
        <Breadcrumbs />

        <h2 className="title mb-1">Результати пошуку:</h2>
        {goods.length > 0 ? (
          <div key={Math.random()}>
            <InfiniteScroll
              initialGoods={goods}
              searchParams={searchParams}
              categories={categories}
              brands={brands}
            />
          </div>
        ) : (
          <EmptyState showReset />
        )}
      </div>
    </HydrationBoundary>
  );
}
