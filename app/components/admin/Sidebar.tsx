import Image from 'next/image'
import {
	MdDashboard,
	MdProductionQuantityLimits,
	MdShoppingBag,
	MdSupervisedUserCircle,
} from 'react-icons/md'
import Button from '../Button'
import MenuLink from './MenuLink'

type Props = {}

const menuItems = [
	{
		title: 'Pages',
		list: [
			{
				title: 'Dashboard',
				path: '/admin',
				icon: <MdDashboard />,
			},
			{
				title: 'Clients',
				path: '/admin/clients',
				icon: <MdSupervisedUserCircle />,
			},
			{
				title: 'Orders',
				path: '/admin/orders',
				icon: <MdProductionQuantityLimits />,
			},
			{
				title: 'Products',
				path: '/admin/products',
				icon: <MdShoppingBag />,
			},
			{
				title: 'Edit Product',
				path: '/admin/edit-product',
				icon: <MdShoppingBag />,
			},
		],
	},
]

const Sidebar = (props: Props) => {
	return (
		<div className='pt-0 mr-4 text-sm w-[250px] mb-4'>
			<h2 className='text-2xl text-primaryAccentColor mb-4 bold'>Меню адміна</h2>
			<Image
				src='/noavatar.png'
				alt=''
				width={50}
				height={50}
				objectFit='cover'
				className='border-[50%]'
			/>
			<div className='flex flex-col'>
				<span className=''> John Doe</span>
				<span className=''>Adiministrator</span>
			</div>
			<ul className='bg-secondaryBackground p-4 rounded-lg'>
				{menuItems.map(cat => {
					return (
						<li key={cat.title} className='mb-3 nav'>
							<span>{cat.title}</span>
							<ul>
								{cat.list.map(item => (
									<MenuLink item={item} key={item.title} />
								))}
							</ul>
						</li>
					)
				})}
			</ul>
			<Button label='Logout'></Button>
		</div>
	)
}

export default Sidebar
