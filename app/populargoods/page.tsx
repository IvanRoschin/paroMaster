"use client"

import { getMostPopularGoods } from "@/actions/goods"
import InfiniteScrollGoods from "@/components/InfiniteScrollGoods"
import { IGood, ISearchParams } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}
export default async function MostPopularGoodsPage({
  searchParams
}: {
  searchParams: ISearchParams
}) {
  const queryClient = new QueryClient()
  await queryClient.prefetchQuery({
    queryKey: ["populargoods"],
    queryFn: () => getMostPopularGoods()
  })

  const queryState = queryClient.getQueryState(["populargoods"])

  const goods = (queryState?.data as GoodsData)?.goods || []
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <h2 className="title mb-1">Популярні товари</h2>
        <div key={Math.random()}>
          <InfiniteScrollGoods initialGoods={goods} searchParams={searchParams} />
        </div>
      </div>
    </HydrationBoundary>
  )
}
