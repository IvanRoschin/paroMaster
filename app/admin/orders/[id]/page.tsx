import { getOrderById, updateOrder } from "@/actions/orders"
import { AddOrderForm } from "@/components/index"

interface Params {
  id: string
}

const SingleOrderPage = async ({ params }: { params: Params }) => {
  const { id } = params
  const order = await getOrderById(id)

  return (
    <div className="mb-20">
      <AddOrderForm
        order={order}
        title={`Редагувати дані ордера ${order.number}`}
        action={updateOrder}
      />
    </div>
  )
}

export default SingleOrderPage
