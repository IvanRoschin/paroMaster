import { getAllCategories } from "@/actions/categories"
import Categories from "@/components/admin/Categories"
import { usePrefetchData } from "@/hooks/usePrefetchData"

import { ISearchParams } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function CategoriesPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()

  await usePrefetchData(getAllCategories, ["categories"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Categories searchParams={searchParams} />
    </HydrationBoundary>
  )
}
