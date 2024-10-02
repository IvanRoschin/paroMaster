import { getAllCategories } from '@/actions/categories'
import { getAllCustomers } from '@/actions/customers'
import { getAllGoods } from '@/actions/goods'
import { getAllOrders } from '@/actions/orders'
import { getAllSlides } from '@/actions/slider'
import { getAllTestimonials } from '@/actions/testimonials'
import { getAllUsers } from '@/actions/users'
import Card from '@/components/admin/Card'
import { QueryClient } from '@tanstack/react-query'
import { IconType } from 'react-icons'
import { FaShoppingCart, FaUser } from 'react-icons/fa'
import { FiPackage } from 'react-icons/fi'
import { RiAdminLine } from 'react-icons/ri'
import { SiTestinglibrary } from 'react-icons/si'

interface DataCount {
	count: number
}

interface CardData {
	title: string
	count: number
	link: string
	icon: IconType
}

export default async function Admin() {
	const queryClient = new QueryClient()

	// Define an array of queries to prefetch
	const queries = [
		{ key: 'users', fetchFn: getAllUsers },
		{ key: 'customers', fetchFn: getAllCustomers },
		{ key: 'orders', fetchFn: getAllOrders },
		{ key: 'slides', fetchFn: getAllSlides },
		{ key: 'testimonials', fetchFn: getAllTestimonials },
		{ key: 'goods', fetchFn: getAllGoods },
		{ key: 'categories', fetchFn: getAllCategories },
		{ key: 'testimonials', fetchFn: getAllTestimonials },
	]

	// Prefetch all queries
	try {
		await Promise.all(
			queries.map(({ key, fetchFn }) =>
				queryClient.prefetchQuery({
					queryKey: [key],
					queryFn: fetchFn,
				}),
			),
		)
	} catch (error) {
		console.error('Error prefetching data:', error)
	}

	// Get query states
	const getCount = (key: string) =>
		(queryClient.getQueryState([key])?.data as DataCount)?.count || 0

	// Card data using the count fetched from queries
	const cardData: CardData[] = [
		{
			title: 'Адміністратори',
			count: getCount('users'),
			link: 'admin/users',
			icon: RiAdminLine,
		},
		{
			title: 'Клієнти',
			count: getCount('customers'),
			link: 'admin/customers',
			icon: FaUser,
		},
		{
			title: 'Замовлення',
			count: getCount('orders'),
			link: 'admin/orders',
			icon: FaShoppingCart,
		},
		{
			title: 'Товари',
			count: getCount('goods'),
			link: 'admin/goods',
			icon: FiPackage,
		},
		{
			title: 'Категорії',
			count: getCount('categories'),
			link: 'admin/categories',
			icon: FiPackage,
		},
		{
			title: 'Відгуки',
			count: getCount('testimonials'),
			link: 'admin/testimonials',
			icon: SiTestinglibrary,
		},
	]

	return (
		<div className='flex items-center justify-center m-4'>
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
