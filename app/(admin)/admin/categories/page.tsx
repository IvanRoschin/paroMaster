import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { ISearchParams } from '@/types/index';
import prefetchData from '@/hooks/usePrefetchData';
import { getAllCategoriesAction } from '@/actions/categories';
import Categories from '@/app/(admin)/components/sections/Categories';

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await prefetchData(
    queryClient,
    getAllCategoriesAction,
    ['categories'],
    params
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Categories searchParams={params} />
    </HydrationBoundary>
  );
}
