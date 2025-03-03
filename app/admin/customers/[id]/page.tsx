import { getCustomerById, updateCustomer } from "@/actions/customers"
import { AddCustomerForm } from "@/components/index"

interface Params {
  id: string
}
const SingleCustomerPage = async ({ params }: { params: Params }) => {
  const { id } = params

  // const { data, isLoading, isError, error } = useFetchDataById(id, getCustomerById, 'customer')

  // if (isLoading) {
  // 	return <div>Loading...</div>
  // }

  // if (isError) {
  // 	return (
  // 		<div>
  // 			Error fetching customer data: {error instanceof Error ? error.message : 'Unknown error'}
  // 		</div>
  // 	)
  // }

  // const customer = data
  // consolole.log('customer')

  const customer = await getCustomerById(id)
  return (
    <div className="mb-20">
      <AddCustomerForm
        title={"Редагувати дані про товар"}
        customer={customer}
        action={updateCustomer}
      />
    </div>
  )
}

export default SingleCustomerPage
