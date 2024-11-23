'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { IconType } from 'react-icons'

type MenuLinkProps = {
	title: string
	path: string
	icon: IconType
}

const MenuLink = ({ item }: { item: MenuLinkProps }) => {
	const pathname = usePathname()
	return (
		<Link href={item.path} className='flex items-center gap-2'>
			{item?.icon && <item.icon />} <span>{item.title}</span>
		</Link>
	)
}

export default MenuLink
