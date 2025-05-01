import { menu } from "app/config/constants"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { MdLogout } from "react-icons/md"

import { Button, Icon } from "@/components/ui"

interface MenuProps {
  session?: any
}

const Menu = ({ session }: MenuProps) => {
  return (
    <nav className="text-base flex items-center justify-center font-semibold">
      <Link href="/catalog" className="flex items-center nav mr-2 lg:mr-4">
        <Icon name="lucide/catalog" className="w-5 h-5 mr-2 lg:mr-3" />
        Каталог
      </Link>
      <ul className="flex items-center space-x-2 lg:space-x-4 lg:mr-6">
        {menu.map((item, index) => (
          <li key={index} className="nav whitespace-nowrap">
            <Link
              href={item.menuItemLink}
              target="_self"
              rel="noopener noreferrer"
              className="inline-block"
            >
              {item.menuItemName}
            </Link>
          </li>
        ))}
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
