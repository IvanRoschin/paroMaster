import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { getAllGoods } from '@/actions/goods';
import Goods from '@/admin/components/sections/Goods';
import prefetchData from '@/hooks/usePrefetchData';
import { IGoodUI } from '@/types/index';
import { ISearchParams } from '@/types/searchParams';

interface GoodsData {
  goods: IGoodUI[];
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const goodsKey = ['goods', params];

  const queryClient = new QueryClient();

  await prefetchData(queryClient, getAllGoods, goodsKey, params);

  // 🛠️ Гарантируем что _id всегда строка
  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(params),
    getAllBrands(params),
  ]);

  const categories = (categoriesResponse.categories ?? [])
    .filter(c => c._id)
    .map(c => ({
      value: String(c._id),
      label: c.title ?? 'Без назви',
    }));

  const brands = (brandsResponse.brands ?? [])
    .filter(b => b._id)
    .map(b => ({
      value: String(b._id),
      label: b.name ?? 'Без назви',
    }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Goods searchParams={params} categories={categories} brands={brands} />
    </HydrationBoundary>
  );
}
