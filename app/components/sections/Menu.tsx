import { menu } from 'app/config/constants';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { MdLogout } from 'react-icons/md';

import { routes } from '@/app/helpers/routes';
import { Button, Icon } from '@/components/ui';
import { SessionUser, UserRole } from '@/types/IUser';

interface MenuProps {
  user?: SessionUser | null;
}

const Menu = ({ user }: MenuProps) => {
  const isAuthenticated =
    user && (user.role === UserRole.ADMIN || user.role === UserRole.CUSTOMER);

  const visibleMenu = isAuthenticated
    ? menu.filter(item => item.menuItemName !== 'Кабінет')
    : menu;

  return (
    <nav className="text-base flex items-center justify-center font-semibold">
      <Link href="/catalog" className="flex items-center nav mr-2 lg:mr-4">
        <Icon name="lucide/catalog" className="w-5 h-5 mr-2 lg:mr-3" />
        Каталог
      </Link>
      <ul className="flex items-center space-x-2 lg:space-x-4 lg:mr-6">
        {visibleMenu.map((item, i) => (
          <li key={i} className="nav whitespace-nowrap">
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
      {user &&
        (user.role === UserRole.ADMIN || user.role === UserRole.CUSTOMER) && (
          <Button
            small
            onClick={() =>
              signOut({
                callbackUrl: routes.publicRoutes.auth.signIn,
              })
            }
          >
            <MdLogout />
            Вихід
          </Button>
        )}
    </nav>
  );
};

export default Menu;
