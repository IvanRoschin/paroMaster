import { getAllGoods } from "@/actions/goods"
import { addOrderAction } from "@/actions/orders"
import { AddOrderForm } from "@/components/index"
import { IGood } from "@/types/index"
import { ISearchParams } from "@/types/searchParams"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface GoodsData {
  goods: IGood[]
}

const AddOrderPage = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queryClient = new QueryClient()
  try {
    await queryClient.prefetchQuery({
      queryKey: ["goods"],
      queryFn: () => getAllGoods(searchParams)
    })
  } catch (error) {
    console.error("Error prefetching data:", error)
  }
  const queryState = queryClient.getQueryState(["goods"])

  const goods = (queryState?.data as GoodsData)?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-20">
        <AddOrderForm title="Додати новий ордер" action={addOrderAction} goods={goods} />
      </div>
    </HydrationBoundary>
  )
}

export default AddOrderPage
