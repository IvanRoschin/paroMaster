'use client';

import Link from 'next/link';
import { FaPlus } from 'react-icons/fa';

import { Button } from '@/components';
import { UserRole } from '@/types/IUser';

export const ButtonAddGood = ({ role }: { role: UserRole }) => {
  if (role !== UserRole.ADMIN) return null;

  return (
    <Link href="/admin/goods/add">
      <Button
        small
        type="button"
        label="Додати товар"
        icon={FaPlus}
        className="bg-primaryAccentColor text-white hover:bg-primaryAccentColor/90 transition"
      />
    </Link>
  );
};
