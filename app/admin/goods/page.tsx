import { getAllGoods } from "@/actions/goods"
import Goods from "@/components/admin/Goods"
import { IGood } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}

export default async function ProductsPage({ searchParams }: { searchParams: ISearchParams }) {
  const queryClient = new QueryClient()
  const goodsKey = ["goods", searchParams]

  await queryClient.prefetchQuery({
    queryKey: goodsKey,
    queryFn: () => getAllGoods(searchParams)
  })

  const goods = (queryClient.getQueryData(goodsKey) as GoodsData)?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Goods />
    </HydrationBoundary>
  )
}
