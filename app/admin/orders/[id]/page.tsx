import { getOrderById, updateOrder } from '@/actions/orders'
import AddUserForm from '@/components/admin/AddUserForm'

interface Params {
	id: string
}

const SingleOrderPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const order = await getOrderById(id)

	return (
		<div className='mb-20'>
			<AddUserForm order={order} title={'Редагувати дані ордера'} action={updateOrder} />
		</div>
	)
}

export default SingleOrderPage
