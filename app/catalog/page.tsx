import { getAllGoods } from "@/actions/goods"
import { Breadcrumbs, InfiniteScroll } from "@/components/index"
import { usePrefetchData } from "@/hooks/index"
import { IGood, ISearchParams } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}

export const dynamic = "force-dynamic"

export default async function CatalogPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClient = new QueryClient()

  await usePrefetchData(getAllGoods, ["goods"], { ...searchParams, limit: 8 })

  const goodsKey = ["goods", searchParams]

  const queryState = queryClient.getQueryState(goodsKey)
  const goods = (queryState?.data as GoodsData)?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Каталог товарів</h2>
        <div key={Math.random()}>
          <InfiniteScroll initialGoods={goods} searchParams={searchParams} />
        </div>
      </div>
    </HydrationBoundary>
  )
}
