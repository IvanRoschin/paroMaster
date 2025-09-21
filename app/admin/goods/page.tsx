import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

import { getAllGoods } from "@/actions/goods"
import Goods from "@/admin/components/sections/Goods"
import prefetchData from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"

export default async function ProductsPage({
  searchParams
}: {
  searchParams: Promise<ISearchParams>
}) {
  const params = await searchParams

  const queryClient = new QueryClient()

  await prefetchData(queryClient, getAllGoods, ["goods"], params)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Goods />
    </HydrationBoundary>
  )
}
