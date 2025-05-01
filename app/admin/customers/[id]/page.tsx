import { getCustomerById, updateCustomer } from "@/actions/customers"
import { CustomerForm } from "@/admin/components/index"

interface Params {
  id: string
}
const SingleCustomerPage = async ({ params }: { params: Params }) => {
  const { id } = params

  const customer = await getCustomerById(id)
  return (
    <div className="mb-20">
      <CustomerForm
        title={"Редагувати дані про замовника"}
        customer={customer}
        action={updateCustomer}
      />
    </div>
  )
}

export default SingleCustomerPage
