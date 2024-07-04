import { getAllOrders } from '@/actions/orders'
import Card from '@/components/admin/Card'

export default async function Admin() {
	try {
		const orders = await getAllOrders()
	} catch (error) {}

	return (
		<div className='mo:max-w-[480px] sm:w-[480px] md:w-[768px] lg:w-[1280px] mx-auto p-5 flex justify-center'>
			<div className='flex justify-between items-center gap-2'>
				<Card />
				<Card />
				<Card />
			</div>
		</div>
	)
}
