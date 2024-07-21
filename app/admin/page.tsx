import { getAllOrders } from '@/actions/orders'
import Card from '@/components/admin/Card'

export default async function Admin() {
	try {
		const orders = await getAllOrders()
	} catch (error) {}

	return (
		<div className='flex justify-between items-center gap-2'>
			<Card />
			<Card />
			<Card />
		</div>
	)
}
