import { getCustomerById, updateCustomer } from '@/actions/customers'
import { AddCustomerForm } from '@/components/index'

interface Params {
	id: string
}
const SingleCustomerPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const customer = await getCustomerById(id)
	return (
		<div className='mb-20'>
			<AddCustomerForm
				title={'Редагувати дані про товар'}
				customer={customer}
				action={updateCustomer}
			/>
		</div>
	)
}

export default SingleCustomerPage
