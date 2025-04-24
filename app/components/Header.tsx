"use client"

import { useMediaQuery } from "../hooks" // Adjust the path if necessary
import Cart from "./Cart/CartButton"
import Logo from "./Logo"
import Menu from "./Menu"
import MobileMenu from "./MobileMenu"
import Search from "./Search"
import Socials from "./Socials"

interface HeaderProps {
  session?: any
}

const Header = ({ session }: HeaderProps) => {
  const isMobile = useMediaQuery("(max-width: 767px)")
  const isTablet = useMediaQuery("(min-width: 768px) and (max-width: 1024px)")
  const isDesktop = useMediaQuery("(min-width: 1025px)")

  return (
    <div className="">
      {/* Mobile and desktop styles */}
      {isMobile ? (
        <MobileMenu session={session} />
      ) : (
        <div className="bg-gray-300 flex p-4 px-8 items-center justify-between">
          <Socials /> <Menu session={session} />
        </div>
      )}
      <div
        className="flex
				 justify-between items-center border border-b p-4 px-8"
      >
        <Logo />
        {!isMobile && <Search placeholder="Пошук товарів" />}
        <Cart />
      </div>
    </div>
  )
}

export default Header
