import { getAllGoods } from "@/actions/goods"
import Breadcrumbs from "@/components/Breadcrumbs"
import InfiniteScrollGoods from "@/components/InfiniteScrollGoods"
import { IGood } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}

export const dynamic = "force-dynamic"

export default async function categoryPage({ searchParams }: { searchParams: ISearchParams }) {
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
      <div className="max-w-6xl mx-auto px-4 pt-3 container">
        <Breadcrumbs />
        <h2 className="subtitle mb-1 text-center">{searchParams?.category}</h2>
        <div key={Math.random()}>
          <InfiniteScrollGoods initialGoods={goods} searchParams={searchParams} />
        </div>
      </div>
    </HydrationBoundary>
  )
}
