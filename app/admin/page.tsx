import { getAllOrders } from '@/actions/orders'
import Card from '@/components/admin/Card'
import { FaFirstOrder, FaGoodreads, FaUserPlus } from 'react-icons/fa'

const cardData = [
	{
		title: 'Нові користувачі',
		count: 10,
		link: 'admin/users',
		icon: FaUserPlus,
	},
	{
		title: 'Нові замовлення',
		count: 32,
		link: 'admin/orders',
		icon: FaFirstOrder,
	},
	{
		title: 'Товари',
		count: 323,
		link: 'admin/goods',
		icon: FaGoodreads,
	},
]
export default async function Admin() {
	try {
		const orders = await getAllOrders()
	} catch (error) {}

	return (
		<div className='flex items-center justify-center min-h-[85vh]'>
			<div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
				{cardData.map((data, index) => (
					<Card
						key={index}
						title={data.title}
						count={data.count}
						icon={data.icon}
						link={data.link}
					/>
				))}
			</div>
		</div>
	)
}
