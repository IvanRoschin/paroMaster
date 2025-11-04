'use client';
import { signOut } from 'next-auth/react';
import { MdLogout } from 'react-icons/md';

import { routes } from '@/app/helpers/routes';

type Props = {
  // Define any props if necessary
};

const SingOutButton = (props: Props) => {
  return (
    <button
      onClick={() =>
        signOut({ callbackUrl: `${routes.publicRoutes.auth.signIn}` })
      }
      className="flex justify-center items-center gap-3 nav"
    >
      {' '}
      <MdLogout />
      Вихід
    </button>
  );
};

export default SingOutButton;
