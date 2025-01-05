// import { signOut } from 'auth'
import { signOut } from "next-auth/react"
import Link from "next/link"
import { MdLogout } from "react-icons/md"
import { menu } from "../config/constants"
import Button from "./Button"
import { Icon } from "./Icon"

interface MenuProps {
  session?: any
}

const Menu = ({ session }: MenuProps) => {
  return (
    <nav className="flex items-center justify-center font-semibold">
      <Link href="/catalog" className="flex justify-end items-center nav mr-2 lg:mr-4">
        <Icon name="lucide/catalog" className="w-5 h-5 mr-2 lg:mr-3" />
        Каталог
      </Link>
      <ul className="flex justify-center items-center lg:mr-6">
        {menu.map((item, index) => {
          return (
            <li key={index} className="nav mr-2 lg:mr-4">
              <Link href={item.menuItemLink} target="_self" rel="noopener noreferrer">
                {item.menuItemName}
              </Link>
            </li>
          )
        })}
      </ul>
      {session && (
        <Button small onClick={() => signOut({ callbackUrl: "/" })}>
          <MdLogout />
          Вихід
        </Button>
      )}
    </nav>
  )
}

export default Menu
