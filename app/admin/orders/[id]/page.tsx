import { getOrderById, updateOrder } from '@/actions/orders'
import { AddOrderForm } from '@/components/index'

interface Params {
	id: string
}

const SingleOrderPage = async ({ params }: { params: Params }) => {
	const { id } = params
	const order = await getOrderById(id)

	console.log('order', order)

	return (
		<div className='mb-20'>
			<AddOrderForm
				order={order}
				title={`Редагувати дані ордера ${order.orderNumber}`}
				action={updateOrder}
			/>
		</div>
	)
}

export default SingleOrderPage
