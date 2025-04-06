import { getAllGoods } from "@/actions/goods"
import Goods from "@/components/admin/Goods"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

export default async function ProductsPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClinet = new QueryClient()
  await queryClinet.prefetchQuery({
    queryKey: ["goods"],
    queryFn: () => getAllGoods(searchParams)
  })

  return (
    <HydrationBoundary state={dehydrate(queryClinet)}>
      <Goods searchParams={searchParams} />
    </HydrationBoundary>
  )
}
