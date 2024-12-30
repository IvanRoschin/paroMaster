"use client"

import Link from "next/link"
import { useState } from "react"
import { MdMenu, MdMenuOpen } from "react-icons/md"

import { menu } from "../config/constants"
import { Icon } from "./Icon"
import Socials from "./Socials"

const MobileMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleNavbar = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <div className="bg-gray-300 flex justify-between p-4 px-8">
      <Socials />
      <nav className="flex flex-col justify-center items-center">
        <button onClick={toggleNavbar} className="self-end mb-6 place-self-center">
          {isMenuOpen ? (
            <MdMenuOpen size={32} className="nav" />
          ) : (
            <MdMenu size={32} className="nav" />
          )}
        </button>

        {/* Conditional rendering for menu */}
        {isMenuOpen && (
          <div className="flex flex-col items-end justify-center pb-2 ">
            {/* Catalog Link */}
            <Link href="/catalog" className="flex items-center nav mb-4">
              <Icon name="lucide/catalog" className="w-5 h-5 mr-3" />
              Каталог
            </Link>
            {/* Menu Items */}
            <ul className="flex flex-col items-end justify-center">
              {menu.map((item, index) => (
                <li key={index} className="nav mb-2">
                  <Link
                    href={item.menuItemLink}
                    target="_self"
                    rel="noopener noreferrer"
                    className="text-center"
                  >
                    {item.menuItemName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
    </div>
  )
}

export default MobileMenu
