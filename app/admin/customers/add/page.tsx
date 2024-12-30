import { addCustomer } from "@/actions/customers"
import { AddCustomerForm } from "@/components/index"

const AddCustomerPage = () => {
  return (
    <div className="mb-20">
      <AddCustomerForm title="Додати нового клієнта" action={addCustomer} />
    </div>
  )
}

export default AddCustomerPage
