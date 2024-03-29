import Cart from './Cart'
import Logo from './Logo'
import Menu from './Menu'
import Search from './Search'

type Props = {}

const Header = (props: Props) => {
	return (
		<div className='flex justify-between border border-b px-4'>
			<Logo />
			<Menu />
			<Search />
			<Cart />
		</div>
	)
}

export default Header
