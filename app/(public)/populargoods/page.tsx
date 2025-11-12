import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import { getServerSession } from 'next-auth';

import { getMostPopularGoods } from '@/actions/goods';
import { authOptions } from '@/app/config/authOptions';
import { Breadcrumbs, InfiniteScroll } from '@/components/index';
import prefetchData from '@/hooks/usePrefetchData';
import { IGoodUI, ISearchParams } from '@/types/index';
import { UserRole } from '@/types/IUser';

interface GoodsData {
  goods: IGoodUI[];
}

export const dynamic = 'force-dynamic';

export default async function MostPopularGoodsPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  const role = session?.user?.role
    ? (session.user.role as UserRole)
    : UserRole.GUEST;
  const queryClient = new QueryClient();
  const goodsKey = ['popularGoods', params];

  await prefetchData(queryClient, getMostPopularGoods, goodsKey, {
    ...params,
    limit: 8,
  });

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey);
  const goods = goodsData?.goods || [];

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Популярні товари</h2>
        <InfiniteScroll
          initialGoods={goods}
          searchParams={params}
          role={role}
        />
      </div>
    </HydrationBoundary>
  );
}
