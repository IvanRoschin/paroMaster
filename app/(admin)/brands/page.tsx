import { getAllBrands } from '@/actions/brands';
import Brands from '@/app/(admin)/components/sections/Brands';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/index';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

export type paramsType = Promise<{ id: string }>;

export default async function BrandsPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await prefetchData(queryClient, getAllBrands, ['brands'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Brands searchParams={params} />
    </HydrationBoundary>
  );
}
