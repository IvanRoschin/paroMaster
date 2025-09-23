import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllGoods } from '@/actions/goods';
import Breadcrumbs from '@/components/common/Breadcrumbs';
import InfiniteScrollGoods from '@/components/common/InfiniteScroll';
import { IGood } from '@/types/index';
import { ISearchParams } from '@/types/searchParams';
import { EmptyState } from '../components';

interface GoodsData {
  goods: IGood[];
}

export const dynamic = 'force-dynamic';

export default async function categoryPage({
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

  if (!goods || goods.length === 0) {
    return (
      <EmptyState
        showReset
        title={`Відсутні товари в категорії ${params?.category ?? ''}`}
      />
    );
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto px-4 pt-3 container">
        <Breadcrumbs />
        <h2 className="subtitle mb-1 text-center">{params?.category}</h2>
        <div key={Math.random()}>
          <InfiniteScrollGoods initialGoods={goods} searchParams={params} />
        </div>
      </div>
    </HydrationBoundary>
  );
}
