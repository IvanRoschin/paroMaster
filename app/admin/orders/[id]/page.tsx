import { getAllGoods } from "@/actions/goods"
import { getOrderById, updateOrder } from "@/actions/orders"
import { AddOrderForm } from "@/components/index"
import { IGood } from "@/types/index"
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query"

interface Params {
  id: string
}
interface GoodsData {
  goods: IGood[]
}

const SingleOrderPage = async ({ params }: { params: Params }) => {
  const { id } = params
  const order = await getOrderById(id)
  const queryClient = new QueryClient()
  try {
    await queryClient.prefetchQuery({
      queryKey: ["goods"],
      queryFn: () => getAllGoods(params)
    })
  } catch (error) {
    console.error("Error prefetching data:", error)
  }
  const queryState = queryClient.getQueryState(["goods"])
  const goods = (queryState?.data as GoodsData)?.goods || []

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="mb-20">
        <AddOrderForm
          order={order}
          title={`Редагувати дані ордера ${order.number}`}
          action={updateOrder}
          goods={goods}
        />
      </div>
    </HydrationBoundary>
  )
}

export default SingleOrderPage
