import { getAllGoods } from "@/actions/goods"
import Breadcrumbs from "@/components/common/Breadcrumbs"
import InfiniteScrollGoods from "@/components/common/InfiniteScroll"
import { usePrefetchData } from "@/hooks/usePrefetchData"
import { IGood } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
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
          <InfiniteScrollGoods initialGoods={goods} searchParams={searchParams} />
        </div>
      </div>
    </HydrationBoundary>
  )
}
