import Link from 'next/link'
import { Icon } from './Icon'

const menu = [
	{ menuItemName: 'Головна', menuItemLink: '/ ' },
	{ menuItemName: 'Послуги', menuItemLink: '/ ' },
	{ menuItemName: 'Доставка та оплата', menuItemLink: '/ ' },
	{ menuItemName: 'Гарантія', menuItemLink: '/ ' },
	{ menuItemName: 'Контакти', menuItemLink: '/ ' },
]

type Props = {}

const Menu = (props: Props) => {
	return (
		<nav className='flex items-center justify-center font-semibold'>
			<Link href='/' className='flex justify-end items-center nav mr-4'>
				<Icon name='lucide/catalog' className='w-5 h-5 mr-3' />
				Каталог
			</Link>
			<ul className='flex justify-center items-center mr-6'>
				{menu.map((item, index) => {
					return (
						<li key={index} className='nav mr-4'>
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
