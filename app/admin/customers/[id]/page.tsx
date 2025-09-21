import { getCustomerById, updateCustomer } from "@/actions/customers"
import { CustomerForm } from "@/admin/components/index"
import { ISearchParams } from "@/types/searchParams"

const SingleCustomerPage = async ({ searchParams }: { searchParams: Promise<ISearchParams> }) => {
  const params = await searchParams

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
