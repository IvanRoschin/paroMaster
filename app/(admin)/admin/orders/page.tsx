import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllOrdersAction } from '@/actions/orders';
import { Orders } from '@/app/(admin)/components/index';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/searchParams';

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const queryClient = new QueryClient();
  const params = await searchParams;

  await prefetchData(queryClient, getAllOrdersAction, ['orders'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Orders />
    </HydrationBoundary>
  );
}
