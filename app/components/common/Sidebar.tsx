'use client';

import Image from 'next/image';
import Link from 'next/link';

import { getMenuItemsByRole } from '@/app/config/sidebarMenuConfig';
import { SessionUser, UserRole } from '@/types/IUser';

const Sidebar = ({ user }: { user: SessionUser }) => {
  const isCustomer = user.role === UserRole.CUSTOMER;
  const menuItems = getMenuItemsByRole(
    isCustomer ? UserRole.CUSTOMER : UserRole.CUSTOMER
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="text-2xl text-primaryAccentColor mb-4 bold text-center">
        {isCustomer ? 'Меню користувача' : 'Меню адміна'}
      </h2>

      {/* 👤 Профиль */}
      <div className="flex flex-col justify-center items-center mb-4">
        <Image
          src={user?.image || `${process.env.PUBLIC_URL}/noavatar.png`}
          alt="user photo"
          width={50}
          height={50}
          className="rounded-full m-2"
          priority
        />
        <span className="text-primaryAccentColor text-lg">{user?.name}</span>
      </div>

      {/* 🧭 Меню */}
      <ul className="bg-secondaryBackground p-4 rounded-t-lg">
        {menuItems.map(({ key, title, icon, path }) => (
          <li key={key} className="mb-3 nav">
            <Link href={path} className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
