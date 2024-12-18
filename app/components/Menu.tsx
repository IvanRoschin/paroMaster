// import { signOut } from 'auth'
import Link from 'next/link'
import { menu } from '../config/constants'
import { Icon } from './Icon'

type Props = {}

const Menu = (props: Props) => {
	return (
		<nav className='flex items-center justify-center font-semibold'>
			<Link href='/catalog' className='flex justify-end items-center nav mr-2 lg:mr-4'>
				<Icon name='lucide/catalog' className='w-5 h-5 mr-2 lg:mr-3' />
				Каталог
			</Link>
			<ul className='flex justify-center items-center lg:mr-6'>
				{menu.map((item, index) => {
					return (
						<li key={index} className='nav mr-2 lg:mr-4'>
							<Link href={item.menuItemLink} target='_self' rel='noopener noreferrer'>
								{item.menuItemName}
							</Link>
						</li>
					)
				})}
			</ul>
		</nav>
	)
}

export default Menu
