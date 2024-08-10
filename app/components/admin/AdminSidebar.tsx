'use client'

import { signOut } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import {
	MdDashboard,
	MdLogout,
	MdProductionQuantityLimits,
	MdShoppingBag,
	MdSupervisedUserCircle,
	MdVerifiedUser,
} from 'react-icons/md'

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

type AdminSidebarProps = {
	user: {
		name: string
		image?: string
		email?: string
	}
}
const AdminSidebar = ({ user }: AdminSidebarProps) => {
	return (
		<div className='pt-0 mr-4 text-sm w-[250px] mb-4'>
			<h2 className='text-2xl text-primaryAccentColor mb-4 bold text-center'>Меню адміна</h2> 
			<div className='flex flex-col justify-center items-center mb-4'>
				{user.image ? (
					<Image
						src={user.image}
						alt='user photo'
						width={50}
						height={50}
						className='border-[50%] rounded-[50%]'
					/>
				) : (
					<Image
						src='/noavatar.png'
						alt='user photo'
						width={50}
						height={50}
						className='border-[50%] rounded-[50%] m-2'
					/>
				)}
				<div className='flex flex-col'>
					<span className='text-primaryAccentColor text-lg'>{user?.name}</span>
				</div>
			</div>
			<ul className='bg-secondaryBackground p-4 rounded-t-lg'>
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
			<button
				onClick={() => signOut({ callbackUrl: '/' })}
				className='text-white end-2.5 bottom-2.5 bg-primaryAccentColor hover:opacity-80 
					focus:opacity-80 
					focus:outline-none 
					focus:ring-secondaryBackground rounded-b-lg text-md px-4 py-3 w-full placeholder:bg-transparent flex justify-center items-center text-center gap-2'
			>
				<MdLogout />
				Вихід
			</button>
		</div>
	)
}

export default AdminSidebar
