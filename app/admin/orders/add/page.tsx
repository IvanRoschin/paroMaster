import { addOrder } from '@/actions/orders'
import { AddGoodForm } from '@/components/index'

const AddOrderPage = () => {
	return (
		<div className='mb-20'>
			<AddGoodForm title='Додати новий ордер' action={addOrder} />
		</div>
	)
}

export default AddOrderPage
