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

interface HeaderProps {
  session?: any;
}

const Header = ({ session }: HeaderProps) => {
  const isMobile = useMediaQuery('(max-width: 767px)');
  const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1024px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');

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
        <CartButton />
      </div>
    </div>
  );
};

export default Header;
