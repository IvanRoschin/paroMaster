import Cart from './Cart/Cart'
import Logo from './Logo'
import Menu from './Menu'
import Search from './Search'
import Socials from './Socials'

type Props = {}

const Header = (props: Props) => {
	return (
		<div className='mb-9'>
			<div className='flex justify-between p-4 px-8 bg-gray-300'>
				<Socials />
				<Menu />
			</div>
			<div className='flex justify-between items-center border border-b p-4 px-8'>
				<Logo />
				<Search placeholder='Пошук товарів' />
				<Cart />
			</div>
		</div>
	)
}

export default Header
