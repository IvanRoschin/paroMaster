// 'use client'

import { signOut } from 'auth'
import Image from 'next/image'
import Link from 'next/link'
// import { useRouter } from 'next/router'
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
		name?: string | null
	}
}
const AdminSidebar = ({ user }: AdminSidebarProps) => {
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
				<span className=''>{user?.name}</span>
				<span className=''>Admin</span>
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

			<form
				action={async () => {
					'use server'
					await signOut({ redirectTo: '/' })
				}}
			>
				<button
					className='text-white end-2.5 bottom-2.5 bg-primaryAccentColor hover:opacity-80 
					focus:opacity-80 
					focus:outline-none 
					focus:ring-secondaryBackground rounded-b-lg text-md px-4 py-3 w-full placeholder:bg-transparent flex justify-start items-center gap-2'
				>
					<MdLogout />
					Logout
				</button>
			</form>
		</div>
	)
}

export default AdminSidebar
