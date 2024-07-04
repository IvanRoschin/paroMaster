import Image from 'next/image'
import Link from 'next/link'
import {
	MdDashboard,
	MdProductionQuantityLimits,
	MdShoppingBag,
	MdSupervisedUserCircle,
	MdVerifiedUser,
} from 'react-icons/md'
import Button from '../Button'

type Props = {}

const menuItems = [
	{
		title: 'Dashboard',
		path: '/admin',
		icon: <MdDashboard />,
	},
	{
		title: 'Customers',
		path: '/admin/customers',
		icon: <MdSupervisedUserCircle />,
	},
	{
		title: 'Orders',
		path: '/admin/orders',
		icon: <MdProductionQuantityLimits />,
	},
	{
		title: 'Goods',
		path: '/admin/goods',
		icon: <MdShoppingBag />,
	},
	{
		title: 'Users',
		path: '/admin/users',
		icon: <MdVerifiedUser />,
	},
	{
		title: 'Edit Product',
		path: '/admin/edit-product',
		icon: <MdShoppingBag />,
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
				{menuItems.map(({ title, path, icon }) => {
					return (
						<li key={title} className='mb-3 nav'>
							<Link href={path} className='flex items-center gap-2'>
								{icon}
								<span>{title}</span>
							</Link>
						</li>
					)
				})}
			</ul>
			<Button label='Logout'></Button>
		</div>
	)
}

export default Sidebar