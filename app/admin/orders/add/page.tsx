import { getAllGoods } from "@/actions/goods"
import { OrderForm } from "@/admin/components"
import { IGood } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}

export const dynamic = "force-dynamic"

const AddOrderPage = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queryClient = new QueryClient()

  const goodsKey = ["goods", searchParams]

  await queryClient.prefetchQuery({
    queryKey: goodsKey,
    queryFn: () => getAllGoods(searchParams)
  })

  const goods = (queryClient.getQueryData(goodsKey) as GoodsData)?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-20">
        <OrderForm title="Додати новий ордер" goods={goods} />
      </div>
    </HydrationBoundary>
  )
}

export default AddOrderPage
