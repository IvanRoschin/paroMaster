'use client'

import { useScreenSize } from '../hooks' // Adjust the path if necessary
import Cart from './Cart/Cart'
import Logo from './Logo'
import Menu from './Menu'
import MobileMenu from './MobileMenu'
import Search from './Search'
import SingOutButton from './SingOutButton'
import Socials from './Socials'

interface HeaderProps {
	session?: any
}

const Header = ({ session }: HeaderProps) => {
	const { width } = useScreenSize()
	const isMobile = width <= 768

	return (
		<div className=''>
			{/* Mobile and desktop styles */}
			{isMobile ? (
				<MobileMenu />
			) : (
				<div className='bg-gray-300 flex p-4 px-8 items-center justify-between'>
					<Socials /> <Menu />
				</div>
			)}
			{session && <SingOutButton />}
			<div
				className={`flex ${
					isMobile ? 'flex-col' : 'flex-row'
				} justify-between items-center border border-b p-4 px-8`}
			>
				<Logo />
				<Search placeholder='Пошук товарів' />
				<Cart />
			</div>
		</div>
	)
}

export default Header
