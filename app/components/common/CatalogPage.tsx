import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllGoodsAction } from '@/actions/goods';
import { Breadcrumbs, GoodsSection, InfiniteScroll } from '@/components';
import prefetchData from '@/hooks/usePrefetchData';
import { IGoodUI, ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface GoodsData {
  goods: IGoodUI[];
}

interface CatalogPageProps {
  searchParams: Promise<ISearchParams>;
  role: UserRole;
}

export default async function CatalogPage({
  searchParams,
  role,
}: CatalogPageProps) {
  const params = await searchParams;
  const queryClient = new QueryClient();
  const goodsKey = ['goods', params];

  const limit = role === UserRole.ADMIN ? 4 : 8;

  await prefetchData(queryClient, getAllGoodsAction, goodsKey, {
    ...params,
    limit,
  });

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
  const goods = goodsData?.goods || [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container mb-20">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Каталог товарів</h2>
        {role === UserRole.ADMIN ? (
          <GoodsSection goods={goods} searchParams={params} role={role} />
        ) : (
          <InfiniteScroll
            initialGoods={goods}
            searchParams={params}
            role={role}
          />
        )}
      </div>
    </HydrationBoundary>
  );
}
