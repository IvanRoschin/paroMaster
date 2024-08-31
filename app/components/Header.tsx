import Cart from './Cart/Cart'
import Logo from './Logo'
import Menu from './Menu'
import Search from './Search'
import SingOutButton from './SingOutButton'
import Socials from './Socials'

interface HeaderProps {
	session?: any
}
const Header = ({ session }: HeaderProps) => {
	return (
		<div className='mb-9'>
			<div className='flex justify-between p-4 px-8 bg-gray-300'>
				<Socials />
				<Menu />
				{session && <SingOutButton />}
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
