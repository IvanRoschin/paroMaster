import { addOrderAction } from "@/actions/orders"
import { AddOrderForm } from "@/components/index"

const AddOrderPage = () => {
  return (
    <div className="mb-20">
      <AddOrderForm title="Додати новий ордер" action={addOrderAction} />
    </div>
  )
}

export default AddOrderPage
