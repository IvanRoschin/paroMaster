import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllCustomersAction } from '@/actions/customers';
import { Customers } from '@/admin/components';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/searchParams';

export default async function CustomersPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await prefetchData(queryClient, getAllCustomersAction, ['customers'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Customers params={params} />
    </HydrationBoundary>
  );
}
