'use server';

import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';

import { getUserByIdAction } from '@/app/actions';
import { authOptions } from '@/app/config/authOptions';
import { getMenuItemsByRole } from '@/app/config/sidebarMenuConfig';
import { UserRole } from '@/types/IUser';

export default async function Sidebar() {
  const session = await getServerSession(authOptions);

  const user = session?.user?.id
    ? await getUserByIdAction(session.user.id)
    : null;

  const role = (user?.role as UserRole) ?? UserRole.GUEST;

  const isCustomer = role === UserRole.CUSTOMER;
  const menuItems = getMenuItemsByRole(
    isCustomer ? UserRole.CUSTOMER : UserRole.ADMIN
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-3 container md:w-[250px]">
      <h2 className="text-2xl text-primaryAccentColor mb-4 bold text-center">
        {isCustomer ? 'Меню користувача' : 'Меню адміна'}
      </h2>

      <div className="flex flex-col justify-center items-center mb-4">
        <Image
          src={session?.user?.image || '/noavatar.png'}
          alt="user photo"
          width={50}
          height={50}
          className="rounded-full m-2"
          priority
        />
        <span className="text-primaryAccentColor text-lg">
          {user?.name ?? 'Гість'}
        </span>
      </div>

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
}
