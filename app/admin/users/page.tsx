import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllUsers } from '@/actions/users';
import { Users } from '@/admin/components';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/searchParams';

export default async function UsersPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClinet = new QueryClient();

  await prefetchData(queryClinet, getAllUsers, ['users'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Users searchParams={params} />
    </HydrationBoundary>
  );
}
