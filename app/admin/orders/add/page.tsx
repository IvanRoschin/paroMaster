import { getAllGoods } from "@/actions/goods"
import { addOrderAction } from "@/actions/orders"
import { AddOrderForm } from "@/components/index"
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
        <AddOrderForm title="Додати новий ордер" action={addOrderAction} goods={goods} />
      </div>
    </HydrationBoundary>
  )
}

export default AddOrderPage
