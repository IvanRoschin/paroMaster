import Link from 'next/link'
import Cart from './Cart'
import { Icon } from './Icon'
import Logo from './Logo'
import Menu from './Menu'
import Search from './Search'

type Props = {}

const Header = (props: Props) => {
	return (
		<>
			<div className='flex justify-between p-4 bg-gray-300'>
				<ul className=''>
					<li>
						<Link
							href='tel:+380977440979'
							target='_blank'
							rel='noopener noreferrer'
							className='flex items-center justify-center'
						>
							<Icon name='lucide/phone' className='w-5 h-5 mr-3 hover:text-orange-400' />
							<Icon name='simpleIcons/viber' className='w-5 h-5 mr-1 hover:text-orange-400' />
							<span className='nav'>+38 097 744 09 79</span>
						</Link>
					</li>
				</ul>
				<Menu />
			</div>

			<div className='flex justify-between items-center border border-b px-4'>
				<Logo />

				<Search />
				<Cart />
			</div>
		</>
	)
}

export default Header
