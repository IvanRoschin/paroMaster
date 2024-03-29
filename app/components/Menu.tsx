import Link from 'next/link'
import { Icon } from './Icon'

const menu = [
	{ menuItemName: 'Головна', menuItemLink: '/ ' },
	{ menuItemName: 'Доставка та оплата', menuItemLink: '/ ' },
	{ menuItemName: 'Гарантія', menuItemLink: '/ ' },
	{ menuItemName: 'Контакти', menuItemLink: '/ ' },
]

type Props = {}

const Menu = (props: Props) => {
	return (
		<nav className='flex items-center justify-center space-x-2'>
			<Link href='/' className='flex justify-end items-center px-4 nav'>
				<Icon name='lucide/catalog' className='w-5 h-5 mr-3' />
				Каталог
			</Link>
			<ul className='flex justify-center items-center space-x-6'>
				{menu.map((item, index) => {
					return (
						<li key={index} className='nav'>
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
