import { getAllSlides } from '@/actions/slider';
import { Slides } from '@/admin/components';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/searchParams';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export default async function SlidesPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await prefetchData(queryClient, getAllSlides, ['slides'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Slides searchParams={params} />
    </HydrationBoundary>
  );
}
