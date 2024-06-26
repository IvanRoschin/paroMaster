import { getAllOrders } from '@/actions/orders'
import { AdminMenu } from '@/components/index'

export default async function Admin() {
	try {
		const orders = await getAllOrders()
	} catch (error) {}

	return (
		<div className='mo:max-w-[480px] sm:w-[480px] md:w-[768px] lg:w-[1280px] mx-auto p-5 flex justify-center'>
			<AdminMenu />
			{/* <AdminForm /> */}
		</div>
	)
}
