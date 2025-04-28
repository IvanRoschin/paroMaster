import { getAllGoods } from "@/actions/goods"
import Goods from "@/components/admin/Goods"
import { usePrefetchData } from "@/hooks/usePrefetchData"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function ProductsPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClient = new QueryClient()

  await usePrefetchData(getAllGoods, ["goods"], searchParams)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Goods />
    </HydrationBoundary>
  )
}
