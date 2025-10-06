import { QueryClient } from '@tanstack/react-query';

import { getAllBrands } from '@/actions/brands';
import { getAllCategories } from '@/actions/categories';
import { addGood, getAllGoods } from '@/actions/goods';
import { GoodForm } from '@/admin/components';
import prefetchData from '@/hooks/usePrefetchData';
import { IGoodUI } from '@/types/index';
import { ISearchParams } from '@/types/searchParams';

interface GoodsData {
  goods: IGoodUI[];
}

export default async function AddGoodPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;
  const queryClient = new QueryClient();

  const goodsKey = ['goods', params];

  await prefetchData(queryClient, getAllGoods, goodsKey, {
    ...params,
  });

  const [categoriesResponse, brandsResponse] = await Promise.all([
    getAllCategories(params),
    getAllBrands(params),
  ]);

  const categories = categoriesResponse.categories ?? [];
  const brands = brandsResponse.brands ?? [];

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
  const goods = goodsData?.goods || [];

  return (
    <div className="mb-20">
      <GoodForm
        title="Додати новий товар"
        action={addGood}
        goods={goods}
        allowedCategories={categories}
        allowedBrands={brands}
      />
    </div>
  );
}
