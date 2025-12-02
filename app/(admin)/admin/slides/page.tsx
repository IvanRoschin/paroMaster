import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { Slides } from '@/app/(admin)/components';
import { getAllSlidesAction } from '@/app/actions/slides';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/searchParams';

export default async function SlidesPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await prefetchData(queryClient, getAllSlidesAction, ['slides'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Slides searchParams={params} />
    </HydrationBoundary>
  );
}
