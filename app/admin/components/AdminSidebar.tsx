'use client';

import Image from 'next/image';
import Link from 'next/link';
import {
  MdDashboard,
  MdProductionQuantityLimits,
  MdShoppingBag,
  MdSupervisedUserCircle,
  MdVerifiedUser,
} from 'react-icons/md';
import { SiTestinglibrary } from 'react-icons/si';
import { TbCategoryPlus } from 'react-icons/tb';
import { TfiLayoutSlider } from 'react-icons/tfi';

const menuItems = [
  {
    title: 'Панель керування',
    path: '/admin/',
    icon: <MdDashboard />,
  },
  {
    title: 'Клієнти',
    path: '/admin/customers',
    icon: <MdSupervisedUserCircle />,
  },
  {
    title: 'Замовлення',
    path: '/admin/orders',
    icon: <MdProductionQuantityLimits />,
  },
  {
    title: 'Товари',
    path: '/admin/goods',
    icon: <MdShoppingBag />,
  },
  {
    title: 'Адміністратори',
    path: '/admin/users',
    icon: <MdVerifiedUser />,
  },
  {
    title: 'Категорії',
    path: '/admin/categories',
    icon: <TbCategoryPlus />,
  },
  {
    title: 'Відгуки',
    path: '/admin/testimonials',
    icon: <SiTestinglibrary />,
  },
  {
    title: 'Слайди',
    path: '/admin/slider',
    icon: <TfiLayoutSlider />,
  },
];

type AdminSidebarProps = {
  user: {
    name: string;
    image?: string;
    email?: string;
  };
};
const AdminSidebar = ({ user }: AdminSidebarProps) => {
  return (
    <div className="pt-0 mr-4 text-sm w-[250px] mb-4">
      <h2 className="text-2xl text-primaryAccentColor mb-4 bold text-center">
        Меню адміна
      </h2>
       
      <div className="flex flex-col justify-center items-center mb-4">
        {user.image ? (
          <Image
            src={user.image}
            alt="user photo"
            width={50}
            height={50}
            className="border-[50%] rounded-[50%]"
            priority={true}
          />
        ) : (
          <Image
            src={`${process.env.PUBLIC_URL}/noavatar.png`}
            alt="user photo"
            width={50}
            height={50}
            className="border-[50%] rounded-[50%] m-2"
            priority={true}
          />
        )}
        <div className="flex flex-col">
          <span className="text-primaryAccentColor text-lg">{user?.name}</span>
        </div>
      </div>
      <ul className="bg-secondaryBackground p-4 rounded-t-lg">
        {menuItems.map(({ title, path, icon }) => {
          return (
            <li key={title} className="mb-3 nav">
              <Link href={path} className="flex items-center gap-2">
                {icon}
                <span>{title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
