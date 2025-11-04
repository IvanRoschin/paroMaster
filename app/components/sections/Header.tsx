'use client';

import {
  CartButton,
  Logo,
  Menu,
  MobileMenu,
  Search,
  Socials,
} from '@/components/index';
import { useMediaQuery } from '@/hooks/index';
import { SessionUser } from '@/types/IUser';

interface HeaderProps {
  user?: SessionUser | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

  return (
    <div className="">
      {/* Mobile and desktop styles */}
      {isMobile ? (
        <MobileMenu user={user} />
      ) : (
        <div className="bg-gray-300 flex p-4 px-8 items-center justify-between">
          <Socials /> <Menu user={user} />
        </div>
      )}
      <div
        className="flex
				 justify-between items-center border border-b p-4 px-8"
      >
        <Logo />
        {!isMobile && <Search placeholder="Пошук товарів" />}
        <CartButton />
      </div>
    </div>
  );
};

export default Header;
