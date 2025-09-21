import { getAllGoods } from "@/actions/goods"
import { Breadcrumbs, InfiniteScroll } from "@/components/index"
import prefetchData from "@/hooks/usePrefetchData"
import { IGood, ISearchParams } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

// app/catalog/page.tsx

interface GoodsData {
  goods: IGood[]
}

export const dynamic = "force-dynamic"

export default async function CatalogPage({
  searchParams
}: {
  searchParams: Promise<ISearchParams>
}) {
  const params = await searchParams
  const queryClient = new QueryClient()

  const goodsKey = ["goods", params] // единый ключ

  await prefetchData(queryClient, getAllGoods, goodsKey, { ...params, limit: 8 })

  const goodsData = queryClient.getQueryData<GoodsData>(goodsKey)
  const goods = goodsData?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="max-w-6xl mx-auto py-3 container">
        <Breadcrumbs />
        <h2 className="subtitle text-center">Каталог товарів</h2>
        <InfiniteScroll initialGoods={goods} searchParams={params} />
      </div>
    </HydrationBoundary>
  )
}
