import { getAllGoods } from "@/actions/goods"
import { Breadcrumbs, EmptyState, InfiniteScroll } from "@/components/index"
import { IGood } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}

export const dynamic = "force-dynamic"

export default async function SearchPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClient = new QueryClient()

  const goodsKey = ["goods", searchParams]

  await queryClient.prefetchQuery({
    queryKey: goodsKey,
    queryFn: () => getAllGoods(searchParams)
  })
  const queryState = queryClient.getQueryState(goodsKey)

  const goods = (queryState?.data as GoodsData)?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="container">
        <Breadcrumbs />

        <h2 className="title mb-1">Результати пошуку:</h2>
        {goods.length > 0 ? (
          <div key={Math.random()}>
            <InfiniteScroll initialGoods={goods} searchParams={searchParams} />
          </div>
        ) : (
          <EmptyState showReset />
        )}
      </div>
    </HydrationBoundary>
  )
}
