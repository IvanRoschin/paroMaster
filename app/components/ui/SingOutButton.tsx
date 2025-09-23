'use client';
import { signOut } from 'next-auth/react';
import { MdLogout } from 'react-icons/md';

type Props = {
  // Define any props if necessary
};

const SingOutButton = (props: Props) => {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="flex justify-center items-center gap-3 nav"
    >
      {' '}
      <MdLogout />
      Вихід
    </button>
  );
};

export default SingOutButton;
