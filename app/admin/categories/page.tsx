import { getAllCategories } from "@/actions/categories"
import Categories from "@/components/admin/Categories"

import { ISearchParams } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

const limit = 10

export default async function CategoriesPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["categories"],
    queryFn: () => getAllCategories(searchParams, limit)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Categories searchParams={searchParams} limit={limit} />
    </HydrationBoundary>
  )
}
