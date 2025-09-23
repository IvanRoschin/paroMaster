import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';

import { getAllCategories } from '@/actions/categories';
import Categories from '@/admin/components/sections/Categories';
import prefetchData from '@/hooks/usePrefetchData';
import { ISearchParams } from '@/types/index';

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<ISearchParams>;
}) {
  const params = await searchParams;

  const queryClient = new QueryClient();

  await prefetchData(queryClient, getAllCategories, ['categories'], params);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Categories searchParams={params} />
    </HydrationBoundary>
  );
}
